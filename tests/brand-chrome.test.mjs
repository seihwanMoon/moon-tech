import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const headerPath = new URL("../quartz/components/MoonsTechHeader.tsx", import.meta.url)
const footerPath = new URL("../quartz/components/MoonsTechFooter.tsx", import.meta.url)
const homePath = new URL("../content/index.md", import.meta.url)
const siteStylesPath = new URL("../quartz/styles/custom.scss", import.meta.url)
const configPath = new URL("../quartz.config.yaml", import.meta.url)

test("brand navigation overrides generic internal-link pills", async () => {
  const source = await readFile(headerPath, "utf8")

  assert.match(source, />\s*Home\s*<\/a>/)
  assert.doesNotMatch(source, />\s*moon's tech\s*<\/a>/i)
  assert.match(
    source,
    /a\.moons-tech-wordmark,[\s\S]*\.moons-tech-nav\s+a\.internal\s*\{[^}]*background:\s*transparent[^}]*padding-inline:\s*0[^}]*border-radius:\s*0/s,
  )
})

test("footer is a single understated copyright line", async () => {
  const source = await readFile(footerPath, "utf8")

  assert.match(source, /<small>© moon's tech\. All rights reserved\.<\/small>/)
  assert.doesNotMatch(source, /<nav|<a\s|mailto:|GitHub/)
  assert.match(source, /\.moons-tech-footer\s+small\s*\{[^}]*color:\s*var\(--darkgray\)/s)
})

test("top navigation mirrors the approved News and Service information architecture", async () => {
  const source = await readFile(headerPath, "utf8")

  assert.match(source, /label:\s*"News"[\s\S]*slug:\s*"source-notes\/index"/)
  assert.match(source, /label:\s*"Service"[\s\S]*slug:\s*"services\/index"/)
  assert.match(source, /children:\s*serviceItems/)
  assert.match(source, /aria-haspopup=\{children\s*\?\s*"true"\s*:\s*undefined\}/)
  assert.match(source, /label:\s*"제조"[\s\S]*label:\s*"AI"[\s\S]*label:\s*"프로젝트"/)
  assert.match(source, /label:\s*"About"[\s\S]*label:\s*"Contact"/)
  assert.doesNotMatch(source, /label:\s*"코딩"/)
  assert.match(
    source,
    /@media all and \(max-width:\s*800px\)[\s\S]*\.moons-tech-nav__submenu\s*\{[^}]*display:\s*none/s,
  )
})

test("the left brand replaces reader mode in the logo position", async () => {
  const config = await readFile(configPath, "utf8")

  assert.match(config, /source:\s*"@quartz-community\/reader-mode"\s*\n\s*enabled:\s*false/)
})

test("home hero exposes the approved latest-post link without a pill treatment", async () => {
  const [home, styles] = await Promise.all([
    readFile(homePath, "utf8"),
    readFile(siteStylesPath, "utf8"),
  ])

  assert.match(home, /class="home-latest-link"[^>]*href="#최신-글"[^>]*>최신 글 보기/)
  assert.match(
    styles,
    /\.home-latest-link\s*\{[^}]*background:\s*transparent[^}]*border-radius:\s*0/s,
  )
})
