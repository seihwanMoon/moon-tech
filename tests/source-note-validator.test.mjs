import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"

import {
  ALLOWED_SOURCE_TYPES,
  ALLOWED_SOURCE_USAGES,
  validateSourceNote,
} from "../scripts/source-note-schema.mjs"
import { checkExternalLink, scanContentDirectory } from "../scripts/validate-source-notes.mjs"

const workspaceRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

function validNote(overrides = {}) {
  return {
    title: "A source note",
    description: "A concise description.",
    publish: true,
    type: "source-note",
    source_type: "web",
    source_title: "The source",
    source_author: "An author",
    source_publisher: "A publisher",
    source_url: "https://example.com/source",
    source_published: "2026-07-01",
    source_published_status: "confirmed",
    source_accessed: "2026-08-08",
    source_locator: "Evaluation section, paragraph 4",
    source_language: "en",
    source_license: "all-rights-reserved",
    source_license_url: "",
    source_usage: "summary-only",
    permission_reference: "",
    key_takeaway: "The key takeaway.",
    source_claim: "The source claim.",
    my_interpretation: "My interpretation.",
    key_points: [{ at: "p. 1", title: "Point", summary: "Summary" }],
    next_actions: ["Do the next thing"],
    related: ["[[related-note]]"],
    service_relevance: [],
    ...overrides,
  }
}

function issuesFor(frontmatter, options = {}) {
  return validateSourceNote(frontmatter, { now: "2026-08-08", ...options })
}

function issue(issues, field, code) {
  return issues.find((item) => item.field === field && (!code || item.code === code))
}

test("valid published source note passes the schema", () => {
  const issues = issuesFor(validNote())

  assert.deepEqual(
    issues.filter((item) => item.severity === "error"),
    [],
  )
  assert.deepEqual(
    issues.filter((item) => item.severity === "warning"),
    [],
  )
  assert.deepEqual(ALLOWED_SOURCE_TYPES, ["youtube", "threads", "github", "web"])
  assert.ok(ALLOWED_SOURCE_USAGES.includes("summary-and-short-quotation"))
})

test("published source note rejects every missing required field", () => {
  const required = [
    "title",
    "description",
    "source_type",
    "source_title",
    "source_author",
    "source_url",
    "source_accessed",
    "source_license",
    "source_usage",
    "key_takeaway",
    "source_claim",
    "my_interpretation",
    "key_points",
    "next_actions",
  ]
  const note = validNote()
  for (const field of required) delete note[field]
  delete note.source_published
  delete note.source_published_status

  const issues = issuesFor(note)
  for (const field of [...required, "source_published"]) {
    assert.equal(issue(issues, field)?.severity, "error", `missing ${field}`)
  }
  assert.equal(issue(issues, "source_published_status")?.severity, "error")
})

test("draft source note reports the same contract violations as warnings", () => {
  const note = validNote({ publish: false })
  delete note.source_url
  note.source_type = "podcast"
  note.source_license = "not-a-license"
  note.source_usage = "copy-all"
  note.key_points = []
  note.next_actions = []

  const issues = issuesFor(note)
  assert.equal(issue(issues, "source_url")?.severity, "warning")
  assert.equal(issue(issues, "source_type")?.severity, "warning")
  assert.equal(issue(issues, "source_license")?.severity, "warning")
  assert.equal(issue(issues, "source_usage")?.severity, "warning")
  assert.equal(issue(issues, "key_points")?.severity, "warning")
  assert.equal(issue(issues, "next_actions")?.severity, "warning")
  assert.equal(
    issues.some((item) => item.severity === "error"),
    false,
  )
})

test("source type, URL, date, license, and usage use strict allowed values", () => {
  const issues = issuesFor(
    validNote({
      source_type: "Web",
      source_url: "ftp://example.com/source",
      source_accessed: "08/08/2026",
      source_license: "unknown-license",
      source_usage: "summary",
    }),
  )

  assert.equal(issue(issues, "source_type", "invalid-value")?.severity, "error")
  assert.equal(issue(issues, "source_url", "invalid-url")?.severity, "error")
  assert.equal(issue(issues, "source_accessed", "invalid-date")?.severity, "error")
  assert.equal(issue(issues, "source_license", "invalid-value")?.severity, "error")
  assert.equal(issue(issues, "source_usage", "invalid-value")?.severity, "error")
})

test("accepts the complete SPDX identifier CC-BY-NC-4.0", () => {
  const issues = issuesFor(validNote({ source_license: "CC-BY-NC-4.0" }))
  assert.equal(issue(issues, "source_license", "invalid-value"), undefined)
})

test("source published date must be a valid date unless publication status is unknown", () => {
  const invalid = issuesFor(validNote({ source_published: "not-a-date" }))
  assert.equal(issue(invalid, "source_published", "invalid-date")?.severity, "error")

  const unknown = issuesFor(
    validNote({ source_published: undefined, source_published_status: "unknown" }),
  )
  assert.equal(issue(unknown, "source_published"), undefined)
  assert.equal(issue(unknown, "source_published_status"), undefined)
})

test("key point and next action lists are non-empty and limited to three", () => {
  const empty = issuesFor(validNote({ key_points: [], next_actions: [] }))
  assert.equal(issue(empty, "key_points", "empty-list")?.severity, "error")
  assert.equal(issue(empty, "next_actions", "empty-list")?.severity, "error")

  const tooMany = issuesFor(validNote({ key_points: [1, 2, 3, 4], next_actions: [1, 2, 3, 4] }))
  assert.equal(issue(tooMany, "key_points", "too-many-items")?.severity, "error")
  assert.equal(issue(tooMany, "next_actions", "too-many-items")?.severity, "error")
})

test("conditional citation, reuse, and permission rules are enforced", () => {
  const quotation = issuesFor(
    validNote({ source_usage: "summary-and-short-quotation", source_locator: "" }),
  )
  assert.equal(issue(quotation, "source_locator", "required-for-quotation")?.severity, "error")

  const reuse = issuesFor(validNote({ source_usage: "licensed-reuse", source_license: "unknown" }))
  assert.equal(issue(reuse, "source_license", "license-required-for-reuse")?.severity, "error")

  const permission = issuesFor(
    validNote({ source_usage: "permission-granted", permission_reference: "" }),
  )
  assert.equal(
    issue(permission, "permission_reference", "required-for-permission")?.severity,
    "error",
  )
})

test("summary character budgets are warnings while list budgets remain errors", () => {
  const issues = issuesFor(
    validNote({
      title: "x".repeat(61),
      description: "x".repeat(121),
      key_takeaway: "x".repeat(121),
      source_claim: "x".repeat(141),
      my_interpretation: "x".repeat(161),
      key_points: [1, 2, 3, 4],
    }),
  )

  for (const field of [
    "title",
    "description",
    "key_takeaway",
    "source_claim",
    "my_interpretation",
  ]) {
    assert.equal(issue(issues, field, "character-budget")?.severity, "warning", field)
  }
  assert.equal(issue(issues, "key_points", "too-many-items")?.severity, "error")
})

test("stale source access and absent related notes are deterministic warnings", () => {
  const issues = issuesFor(validNote({ source_accessed: "2025-01-01", related: [] }), {
    now: "2026-08-08",
    staleAfterDays: 180,
  })

  assert.equal(issue(issues, "source_accessed", "stale-access")?.severity, "warning")
  assert.equal(issue(issues, "related", "missing-related")?.severity, "warning")
})

test("marks a source as stale at exactly 180 days", () => {
  const issues = issuesFor(validNote({ source_accessed: "2026-02-09" }), {
    now: "2026-08-08",
    staleAfterDays: 180,
  })
  assert.equal(issue(issues, "source_accessed", "stale-access")?.severity, "warning")
})

test("service relevance without a related service link is a warning", () => {
  const issues = issuesFor(
    validNote({ service_relevance: ["development-process"], related: ["[[related-note]]"] }),
  )
  assert.equal(issue(issues, "service_relevance", "missing-service-link")?.severity, "warning")
})

test("external link failures become deterministic non-blocking warnings", async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response("unavailable", { status: 503 })
  try {
    const warning = await checkExternalLink("https://example.com/source", 50)
    assert.match(warning, /HTTP 503/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("external link success produces no warning", async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response("", { status: 200 })
  try {
    assert.equal(await checkExternalLink("https://example.com/source", 50), null)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("content scanner recursively validates source notes and reports file counts", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "source-note-validator-"))
  await fs.mkdir(path.join(root, "nested"), { recursive: true })
  const frontmatter = (note) =>
    `---\n${Object.entries(note)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join("\n")}\n---\n\nBody\n`
  await fs.writeFile(path.join(root, "valid.md"), frontmatter(validNote()))
  await fs.writeFile(
    path.join(root, "nested", "draft.md"),
    frontmatter(validNote({ publish: false, source_url: "bad" })),
  )
  await fs.writeFile(
    path.join(root, "article.md"),
    frontmatter({ type: "article", publish: true, title: "Article" }),
  )

  const result = await scanContentDirectory(root, { now: "2026-08-08", checkExternalLinks: false })
  assert.equal(result.filesScanned, 3)
  assert.equal(result.sourceNotes, 2)
  assert.equal(result.publishedErrors, 0)
  assert.ok(result.draftWarnings >= 1)
  assert.ok(result.files.some((file) => file.path.endsWith(path.join("nested", "draft.md"))))
})

test("content scanner recognizes a service link in Markdown body detail", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "source-note-service-link-"))
  const note = validNote({ service_relevance: ["development-process"], related: [] })
  const frontmatter = `---\n${Object.entries(note)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(
      "\n",
    )}\n---\n\n> [!source-detail]+ 05. 출처\n> [[services/development-process|개발 프로세스 개선]]\n`
  await fs.writeFile(path.join(root, "service.md"), frontmatter)

  const result = await scanContentDirectory(root, {
    now: "2026-08-08",
    checkExternalLinks: false,
  })
  assert.equal(result.publishedErrors, 0)
  assert.equal(
    result.files[0].issues.some((item) => item.code === "missing-service-link"),
    false,
  )
})

test("validator CLI exits nonzero for published errors and zero for draft warnings", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "source-note-cli-"))
  await fs.writeFile(
    path.join(root, "draft.md"),
    "---\ntype: source-note\npublish: false\nsource_url: bad\n---\n",
  )
  const cli = path.join(workspaceRoot, "scripts", "validate-source-notes.mjs")
  const run = (args) =>
    new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [cli, ...args], { cwd: workspaceRoot })
      let stdout = ""
      let stderr = ""
      child.stdout.on("data", (chunk) => (stdout += chunk))
      child.stderr.on("data", (chunk) => (stderr += chunk))
      child.on("error", reject)
      child.on("close", (code) => resolve({ code, stdout, stderr }))
    })

  const draftResult = await run(["--content-dir", root, "--skip-link-check"])
  assert.equal(draftResult.code, 0)
  assert.match(draftResult.stdout, /source note/i)
  assert.match(draftResult.stdout, /warning/i)

  await fs.writeFile(
    path.join(root, "published.md"),
    "---\ntype: source-note\npublish: true\nsource_url: bad\n---\n",
  )
  const publishedResult = await run(["--content-dir", root, "--skip-link-check"])
  assert.notEqual(publishedResult.code, 0)
  assert.match(publishedResult.stdout, /published|error/i)
})
