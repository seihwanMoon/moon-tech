import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { extname, relative } from "node:path"
import test from "node:test"

const root = new URL("../", import.meta.url)

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = new URL(entry.name, directory)
    if (entry.isDirectory()) {
      files.push(...(await walk(new URL(`${entry.name}/`, directory))))
    } else {
      files.push(path)
    }
  }

  return files
}

test("the public content tree contains only reviewed Markdown documents", async () => {
  const content = new URL("content/", root)
  const files = await walk(content)

  assert.ok(files.length > 0)
  for (const file of files) {
    assert.equal(
      extname(file.pathname),
      ".md",
      `unexpected public asset: ${relative(content.pathname, file.pathname)}`,
    )
  }
})

test("public Markdown leaves the global copyright to the site footer", async () => {
  const content = new URL("content/", root)
  const files = await walk(content)

  for (const file of files) {
    const markdown = await readFile(file, "utf8")
    assert.doesNotMatch(
      markdown,
      /^© moon's tech\. All rights reserved\.$/m,
      `duplicate copyright in ${relative(content.pathname, file.pathname)}`,
    )
  }
})

test("private knowledge-work and local Obsidian state stay outside Git", async () => {
  const gitignore = await readFile(new URL(".gitignore", root), "utf8")

  for (const path of [
    "_inbox/",
    "_sources/",
    "_synthesis/",
    "_templates/",
    "_attachments-private/",
    ".obsidian/workspace.json",
    ".obsidian/workspace-mobile.json",
  ]) {
    assert.match(gitignore, new RegExp(`^${path.replaceAll(".", "\\.")}$`, "m"))
  }
})
