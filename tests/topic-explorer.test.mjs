import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const explorerPath = new URL("../quartz/components/MoonsTechExplorer.ts", import.meta.url)
const configPath = new URL("../quartz.config.yaml", import.meta.url)
const entryPath = new URL("../quartz.ts", import.meta.url)
const stylesPath = new URL("../quartz/styles/custom.scss", import.meta.url)

test("Explorer is presented as Topic and registered as the local navigation", async () => {
  const [config, entry] = await Promise.all([
    readFile(configPath, "utf8"),
    readFile(entryPath, "utf8"),
  ])

  assert.match(config, /source:\s*"@quartz-community\/explorer"[\s\S]*title:\s*Topic/)
  assert.match(entry, /MoonsTechExplorer/)
  assert.match(entry, /componentRegistry\.register\("explorer",\s*MoonsTechExplorer/)
})

test("Topic navigation exposes only the approved root labels and nests service topics", async () => {
  const [source, styles] = await Promise.all([
    readFile(explorerPath, "utf8"),
    readFile(stylesPath, "utf8"),
  ])

  assert.match(source, /Moon's Tech/)
  assert.match(source, /moons-tech-sidebar-logo/)
  assert.match(source, /a\.moons-tech-sidebar-logo\.internal[\s\S]*background:\s*transparent/)
  assert.match(source, /"source-notes":\s*"News"/)
  assert.match(source, /services:\s*"Service"/)
  assert.match(source, /manufacturing:\s*"제조"/)
  assert.match(source, /ai:\s*"AI"/)
  assert.match(source, /projects:\s*"프로젝트"/)
  assert.match(source, /about:\s*"About"/)
  assert.match(source, /contact:\s*"Contact"/)
  assert.match(source, /SERVICE_CHILDREN\s*=\s*\["manufacturing",\s*"ai",\s*"projects"\]/)
  assert.match(source, /approvedRootSlugs\.has/)
  assert.match(source, /topicToggle/)
  assert.match(source, /topic-mobile-label/)
  assert.match(source, /classList\.toggle\("collapsed",\s*!shouldOpen\)/)
  assert.match(styles, /html\.mobile-no-scroll[\s\S]*overflow:\s*hidden/)
  assert.doesNotMatch(source, /coding:\s*"코딩"/)
})
