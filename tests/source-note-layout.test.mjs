import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const renderPagePath = new URL("../quartz/components/renderPage.tsx", import.meta.url)
const siteStylesPath = new URL("../quartz/styles/custom.scss", import.meta.url)
const pluginStylesPath = new URL("../plugins/source-note-brief/src/styles.scss", import.meta.url)
const configPath = new URL("../quartz.config.yaml", import.meta.url)

test("Source Note pages use a single reading column with the standard right rail", async () => {
  const [renderPage, siteStyles, pluginStyles, config] = await Promise.all([
    readFile(renderPagePath, "utf8"),
    readFile(siteStylesPath, "utf8"),
    readFile(pluginStylesPath, "utf8"),
    readFile(configPath, "utf8"),
  ])

  assert.match(renderPage, /data-content-type=\{contentType\}/)
  assert.match(pluginStyles, /\.page\[data-content-type="source-note"\]/)
  assert.match(pluginStyles, /\.source-note-brief\s*\{[^}]*display:\s*block/s)
  assert.doesNotMatch(pluginStyles, /grid-template-columns:\s*(?:26%\s+74%|30%\s+70%)/)
  assert.doesNotMatch(
    siteStyles,
    /\.page\[data-content-type="source-note"\][^{]*\.sidebar\.right\s*\{[^}]*display:\s*none/s,
  )
  assert.doesNotMatch(
    siteStyles,
    /\.page\[data-content-type="source-note"\]\s*>\s*#quartz-body\s*\{[^}]*grid-template-columns/s,
  )
  for (const source of [
    "@quartz-community/table-of-contents",
    "@quartz-community/graph",
    "@quartz-community/backlinks",
  ]) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const block = config.match(new RegExp(`- source: "${escaped}"[\\s\\S]*?(?=\\n  - source:|$)`))
    assert.ok(block, `${source} configuration should exist`)
    assert.doesNotMatch(block[0], /condition:\s*not-source-note/)
    if (source === "@quartz-community/table-of-contents") {
      assert.match(block[0], /minEntries:\s*0/)
    }
  }
  assert.match(
    siteStyles,
    /@media\s+print[\s\S]*\.page\s*>\s*#quartz-body\s+\.page-header\s*>\s*header[\s\S]*display:\s*none\s*!important/s,
  )
  assert.doesNotMatch(
    siteStyles,
    /@media\s+print[\s\S]*\.page\s*>\s*#quartz-body\s+\.page-header,\s*\.sidebar\.left/s,
  )
  assert.match(
    siteStyles,
    /@media\s+print[\s\S]*footer\.moons-tech-footer[\s\S]*display:\s*none\s*!important/s,
  )
  assert.match(
    siteStyles,
    /@media\s+print[\s\S]*\.center\s*>\s*article\s+h2\s*\{[^}]*break-after:\s*avoid/s,
  )
})
