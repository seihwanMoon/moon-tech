import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

const contentRoot = path.resolve("content")

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name)
      return entry.isDirectory() ? markdownFiles(target) : target.endsWith(".md") ? [target] : []
    }),
  )
  return nested.flat()
}

test("published pages expose one rendered H1 without duplicating Quartz ArticleTitle", async () => {
  const files = await markdownFiles(contentRoot)
  const violations = []

  for (const file of files) {
    const markdown = await readFile(file, "utf8")
    if (!/^publish:\s*true$/m.test(markdown)) continue

    const body = markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "")
    const bodyH1Count = (body.match(/^#\s+/gm) ?? []).length
    const relative = path.relative(contentRoot, file).replaceAll("\\", "/")
    const type = markdown.match(/^type:\s*([^\s]+)$/m)?.[1]
    const expected = relative === "index.md" ? 1 : 0

    if (bodyH1Count !== expected) {
      violations.push({ relative, type, bodyH1Count, expected })
    }
  }

  assert.deepEqual(violations, [])
})
