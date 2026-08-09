import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { parseDocument } from "yaml"

import { validateSourceNote } from "./source-note-schema.mjs"

function parseArgs(argv) {
  const args = { contentDir: path.resolve(process.cwd(), "content"), checkExternalLinks: true }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--content-dir") {
      args.contentDir = path.resolve(argv[++index])
    } else if (arg.startsWith("--content-dir=")) {
      args.contentDir = path.resolve(arg.slice("--content-dir=".length))
    } else if (arg === "--now") {
      args.now = argv[++index]
    } else if (arg.startsWith("--now=")) {
      args.now = arg.slice("--now=".length)
    } else if (arg === "--skip-link-check") {
      args.checkExternalLinks = false
    } else if (arg === "--help" || arg === "-h") {
      args.help = true
    }
  }
  return args
}

function extractFrontmatter(source) {
  if (!source.startsWith("---")) return { frontmatter: null, body: source }
  const openingEnd = source.indexOf("\n")
  if (openingEnd < 0) return { frontmatter: null, body: source }
  const closingMatch = /(?:^|\n)---\s*(?:\n|$)/g
  closingMatch.lastIndex = openingEnd + 1
  const closing = closingMatch.exec(source)
  if (!closing) {
    return {
      frontmatter: null,
      body: source,
      parseIssue: {
        field: "frontmatter",
        code: "unclosed-frontmatter",
        message: "Frontmatter opening delimiter has no closing delimiter.",
        severity: "error",
      },
    }
  }
  const yamlText = source.slice(openingEnd + 1, closing.index)
  try {
    const document = parseDocument(yamlText)
    if (document.errors.length > 0) {
      return {
        frontmatter: null,
        body: source.slice(closing.index + closing[0].length),
        parseIssue: {
          field: "frontmatter",
          code: "invalid-yaml",
          message: document.errors.map((error) => error.message).join("; "),
          severity: "error",
        },
      }
    }
    return {
      frontmatter: document.toJS({ mapAsMap: false }) ?? {},
      body: source.slice(closing.index + closing[0].length),
    }
  } catch (error) {
    return {
      frontmatter: null,
      body: source.slice(closing.index + closing[0].length),
      parseIssue: {
        field: "frontmatter",
        code: "invalid-yaml",
        message: error instanceof Error ? error.message : String(error),
        severity: "error",
      },
    }
  }
}

async function markdownFiles(root) {
  const output = []
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(fullPath)
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) output.push(fullPath)
    }
  }
  await visit(root)
  return output.sort()
}

async function checkExternalLink(url, timeoutMs = 3000) {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return null
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let response
    try {
      response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal })
    } catch {
      response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal })
    }
    if (!response.ok) {
      return `External source URL responded with HTTP ${response.status}.`
    }
    return null
  } catch (error) {
    const detail = error?.name === "AbortError" ? "request timed out" : "request failed"
    return `External source URL ${detail}; verify it manually.`
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Scan all Markdown files below a content directory. Non-source-note Markdown
 * is counted but skipped by the schema validator.
 */
export async function scanContentDirectory(contentDir, options = {}) {
  const root = path.resolve(contentDir)
  const files = await markdownFiles(root)
  const result = {
    contentDir: root,
    filesScanned: files.length,
    sourceNotes: 0,
    publishedErrors: 0,
    warnings: 0,
    draftWarnings: 0,
    files: [],
  }

  for (const filename of files) {
    const source = await fs.readFile(filename, "utf8")
    const parsed = extractFrontmatter(source)
    const relativePath = path.relative(root, filename)
    if (parsed.parseIssue) {
      // A malformed frontmatter block cannot be classified as a safe draft;
      // fail closed so an unpublished source note cannot slip into a build.
      result.publishedErrors += 1
      result.files.push({
        path: relativePath,
        published: false,
        sourceNote: false,
        issues: [parsed.parseIssue],
      })
      continue
    }
    if (!parsed.frontmatter || parsed.frontmatter.type !== "source-note") continue

    result.sourceNotes += 1
    const frontmatter = parsed.frontmatter
    const issues = validateSourceNote(frontmatter, { ...options, body: parsed.body })
    if (options.checkExternalLinks !== false && typeof frontmatter.source_url === "string") {
      const externalMessage = await checkExternalLink(frontmatter.source_url, options.linkTimeoutMs)
      if (externalMessage) {
        issues.push({
          field: "source_url",
          code: "external-link-unreachable",
          message: externalMessage,
          severity: "warning",
        })
      }
    }

    const published = frontmatter.publish === true
    result.publishedErrors += issues.filter((item) => published && item.severity === "error").length
    result.warnings += issues.filter((item) => item.severity === "warning").length
    result.draftWarnings += issues.filter(
      (item) => !published && item.severity === "warning",
    ).length
    result.files.push({ path: relativePath, published, sourceNote: true, issues })
  }

  return result
}

function printReport(result) {
  const lines = [
    "Source note validation",
    `Markdown files scanned: ${result.filesScanned}`,
    `Source notes: ${result.sourceNotes}`,
    `Published errors: ${result.publishedErrors}`,
    `Warnings: ${result.warnings}`,
    `Draft warnings: ${result.draftWarnings}`,
  ]
  for (const file of result.files) {
    if (file.issues.length === 0) continue
    lines.push(`\n${file.published ? "[published]" : "[draft]"} ${file.path}`)
    for (const item of file.issues) {
      lines.push(`  ${item.severity.toUpperCase()} ${item.field} (${item.code}): ${item.message}`)
    }
  }
  return lines.join("\n")
}

export { extractFrontmatter, checkExternalLink, printReport }

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(
      "Usage: node scripts/validate-source-notes.mjs [--content-dir DIR] [--now YYYY-MM-DD] [--skip-link-check]",
    )
    process.exit(0)
  }
  try {
    const result = await scanContentDirectory(args.contentDir, args)
    console.log(printReport(result))
    if (result.publishedErrors > 0) process.exitCode = 1
  } catch (error) {
    console.error(`Source note validation could not scan ${args.contentDir}: ${error.message}`)
    process.exitCode = 1
  }
}
