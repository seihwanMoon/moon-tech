import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(new URL(path, import.meta.url), "utf8")

test("local scripts use installed binaries and sync returns to its caller", async () => {
  const [manifestText, runner] = await Promise.all([
    read("../package.json"),
    read("../scripts/run-local.ps1"),
  ])
  const manifest = JSON.parse(manifestText)

  assert.equal(manifest.scripts.check, "tsc --noEmit && prettier . --check")
  assert.equal(manifest.scripts.format, "prettier . --write")
  assert.equal(
    manifest.scripts["install-plugins"],
    "tsx ./quartz/plugins/loader/install-plugins.ts",
  )
  assert.match(runner, /if \(\$Command -eq "sync"\) \{\s+return\s+\}/)
  assert.doesNotMatch(runner, /if \(\$Command -eq "sync"\) \{\s+exit\s+0/)
})

test("container build installs the local Source Note plugin without npx", async () => {
  const [dockerfile, dockerignore] = await Promise.all([
    read("../Dockerfile"),
    read("../.dockerignore"),
  ])

  assert.match(dockerfile, /COPY plugins\/source-note-brief\/package\*\.json/)
  assert.match(dockerfile, /npm ci --prefix plugins\/source-note-brief/)
  assert.match(dockerfile, /npm run verify:package --prefix plugins\/source-note-brief/)
  assert.match(dockerfile, /npm run install-plugins/)
  assert.doesNotMatch(dockerfile, /\bnpx\b/)
  for (const privatePath of [
    "_inbox",
    "_sources",
    "_synthesis",
    "_templates",
    "_attachments-private",
  ]) {
    assert.match(dockerignore, new RegExp(`^${privatePath}/?$`, "m"))
  }
})

test("Pages workflow validates pull requests and limits write permissions to deploy", async () => {
  const workflow = await read("../.github/workflows/deploy.yml")

  assert.match(workflow, /pull_request:/)
  assert.match(workflow, /build:[\s\S]*permissions:\s*\n\s+contents:\s+read/)
  assert.match(workflow, /deploy:[\s\S]*permissions:[\s\S]*pages:\s+write[\s\S]*id-token:\s+write/)
  assert.match(workflow, /run:\s+npm run check\s*$/m)
  assert.match(workflow, /run:\s+npm run check --prefix plugins\/source-note-brief\s*$/m)
  assert.match(workflow, /run:\s+npm run verify:package --prefix plugins\/source-note-brief\s*$/m)
  assert.match(workflow, /run:\s+npm run build\s*$/m)
  assert.doesNotMatch(workflow, /run:\s+npx\b/)
})
