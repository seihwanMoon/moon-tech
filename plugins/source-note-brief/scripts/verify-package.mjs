import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const builtEntries = ["dist/index.js", "dist/components.js"]
const npmCli = process.env.npm_execpath

for (const entry of builtEntries) {
  const module = await import(pathToFileURL(join(packageRoot, entry)).href)
  assert.equal(typeof module.default, "function", `${entry} must export a constructor default`)
  assert.equal(typeof module.SourceNoteBrief, "function", `${entry} must export SourceNoteBrief`)
}

const packDirectory = mkdtempSync(join(tmpdir(), "source-note-brief-pack-"))
try {
  assert.ok(npmCli, "npm_execpath must be available when verify:package runs through npm")
  const result = execFileSync(
    process.execPath,
    [npmCli, "pack", "--json", "--pack-destination", packDirectory],
    {
      cwd: packageRoot,
      encoding: "utf8",
    },
  )
  const manifest = JSON.parse(result)
  const files = new Set(manifest[0].files.map((file) => file.path))
  for (const entry of builtEntries) assert.ok(files.has(entry), `npm pack must include ${entry}`)
  const tarball = join(packDirectory, manifest[0].filename)
  assert.ok(readFileSync(tarball).length > 0, "npm pack must create a non-empty tarball")
  console.log(`Verified ${builtEntries.join(", ")} and npm pack contents.`)
} finally {
  rmSync(packDirectory, { recursive: true, force: true })
}
