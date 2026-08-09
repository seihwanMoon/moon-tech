import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const sourceFrontmatter = {
  type: "source-note",
  publish: true,
  title: "Agent research <brief>",
  description: "A short description",
  source_type: "github",
  source_title: "Original repository",
  source_author: "Maintainer",
  source_publisher: "GitHub",
  source_url: "https://github.com/example/repo",
  source_published: "2026-07-28",
  source_published_status: "confirmed",
  source_accessed: "2026-08-08",
  source_locator: "src/parser.ts:42",
  source_license: "MIT",
  source_license_url: "https://spdx.org/licenses/MIT.html",
  source_usage: "summary-only",
  permission_reference: "",
  key_takeaway: "Choose a small, verifiable workflow first.",
  source_claim: "The source claims context comes before model choice.",
  my_interpretation: "The first success depends on a narrow problem boundary.",
  key_points: [
    { at: "03:15", title: "A good starting point", summary: "Pick a small workflow." },
    { at: "07:40", title: "Connect data", summary: "Join data to a work context." },
  ],
  next_actions: ["Choose three candidate workflows", "Define an approval point"],
}

async function loadComponent() {
  return import("./index").catch(() => undefined)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
}

function renderTree(node: unknown): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return escapeHtml(String(node))
  if (Array.isArray(node)) return node.map(renderTree).join("")
  if (typeof node !== "object") return ""

  const vnode = node as { type?: unknown; props?: Record<string, unknown> }
  if (typeof vnode.type === "function") return renderTree(vnode.type(vnode.props ?? {}))
  if (typeof vnode.type !== "string") return renderTree(vnode.props?.children)

  const props = vnode.props ?? {}
  const attributes = Object.entries(props)
    .filter(([name, value]) => name !== "children" && value != null && value !== false)
    .map(
      ([name, value]) => ` ${name === "className" ? "class" : name}="${escapeHtml(String(value))}"`,
    )
    .join("")
  return `<${vnode.type}${attributes}>${renderTree(props.children)}</${vnode.type}>`
}

function renderWithConstructor(
  componentModule: typeof import("./index"),
  frontmatter = sourceFrontmatter,
): string {
  assert.equal(typeof componentModule.default, "function")
  const Component = componentModule.default({})
  return renderTree(Component({ fileData: { frontmatter } } as never))
}

test("SourceNoteBrief exports a Quartz constructor factory and returns null for non-source notes", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const constructor = componentModule.default
  assert.equal(typeof constructor, "function")
  const Component = constructor({})
  assert.equal(Component({ fileData: { frontmatter: { type: "article" } } } as never), null)
})

test("SourceNoteBrief applies the exact source labels and tokens for all four source types", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  for (const [sourceType, label] of [
    ["youtube", "YouTube"],
    ["threads", "Threads"],
    ["github", "GitHub"],
    ["web", "Web Page"],
  ] as const) {
    const html = renderWithConstructor(componentModule, {
      ...sourceFrontmatter,
      source_type: sourceType,
    })
    assert.match(html, new RegExp(`source-${sourceType}`))
    assert.match(html, new RegExp(label))
  }
})

test("SourceNoteBrief renders source type, provenance, claims, interpretation, actions, and origin link", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const SourceNoteBrief = componentModule.default
  const Component = SourceNoteBrief()
  const html = renderTree(
    Component({
      fileData: { frontmatter: sourceFrontmatter },
      cfg: { locale: "en-US" },
    } as never),
  )

  assert.match(html, /source-note-brief/)
  assert.match(html, /source-github/)
  assert.match(html, /GitHub/)
  assert.match(html, /Agent research &lt;brief&gt;/)
  assert.match(html, /Original repository/)
  assert.match(html, /2026-07-28/)
  assert.match(html, /2026-08-08/)
  assert.match(html, /src\/parser\.ts:42/)
  assert.match(html, /MIT/)
  assert.match(html, /summary-only/)
  assert.match(html, /A short description/)
  assert.match(html, /Choose a small, verifiable workflow first\./)
  assert.match(html, /A good starting point/)
  assert.match(html, /Connect data/)
  assert.match(html, /The source claims context comes before model choice\./)
  assert.match(html, /The first success depends on a narrow problem boundary\./)
  assert.match(html, /Choose three candidate workflows/)
  assert.match(html, /Define an approval point/)
  assert.match(html, /href="https:\/\/github\.com\/example\/repo"/)
  assert.match(html, /rel="noopener noreferrer"/)
  assert.match(html, /원문 URL/)
  assert.doesNotMatch(html, /source-note-origin/)
  assert.doesNotMatch(html, /원문 보기/)
})

test("SourceNoteBrief uses concise Korean labels without an unapproved kicker", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const html = renderWithConstructor(componentModule)
  assert.doesNotMatch(html, /Source research note/)
  for (const label of [
    "출처 정보",
    "원문 제목",
    "작성자·채널",
    "게시일",
    "확인일",
    "원문 위치",
    "라이선스",
    "이용 범위",
    "한 문장 핵심",
    "핵심 포인트",
    "원문의 주장",
    "나의 해석",
    "다음 행동",
    "원문 URL",
  ]) {
    assert.match(html, new RegExp(label))
  }
  assert.match(html, /source-note-actions-section[\s\S]*<aside class="source-note-meta"/)
})

test("SourceNoteBrief keeps one source URL link without rendering a CTA button", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const html = renderWithConstructor(componentModule)
  assert.match(html, /class="source-note-url-link"[^>]*>https:\/\/github\.com\/example\/repo/)
  assert.equal((html.match(/https:\/\/github\.com\/example\/repo/g) ?? []).length, 2)
  assert.doesNotMatch(html, /source-note-origin-link|원문 보기/)
  const styles = readFileSync(new URL("./styles.scss", import.meta.url), "utf8")
  assert.match(styles, /\.source-note-url-link\s*\{[^}]*overflow-wrap:\s*anywhere/s)
  assert.match(styles, /min-height:\s*44px/)
})

test("SourceNoteBrief styles define Quartz dark selector, a single reading column, and print behavior", () => {
  const styles = readFileSync(new URL("./styles.scss", import.meta.url), "utf8")
  for (const token of ["#B25247", "#5D554B", "#3F6F5B", "#4C718A"])
    assert.match(styles, new RegExp(token, "i"))
  for (const token of ["#D98A80", "#B8AEA3", "#79B89A", "#83B2CF"])
    assert.match(styles, new RegExp(token, "i"))
  assert.match(styles, /:root\[saved-theme=["']dark["']\]/)
  assert.match(styles, /max-width:\s*1050px/)
  assert.match(styles, /\.source-note-brief\s*\{[^}]*display:\s*block/s)
  assert.doesNotMatch(styles, /grid-template-columns:\s*(?:26%\s+74%|30%\s+70%)/)
  assert.match(
    styles,
    /\.source-note-meta\s+dl\s*\{[^}]*grid-template-columns:\s*minmax\(5rem,\s*auto\)\s+minmax\(0,\s*1fr\)\s+minmax\(5rem,\s*auto\)\s+minmax\(0,\s*1fr\)/s,
  )
  assert.match(styles, /@media\s*\(max-width:\s*720px\)/)
  assert.match(
    styles,
    /@media\s*\(max-width:\s*720px\)[\s\S]*\.source-note-meta\s+dl\s*\{[^}]*grid-template-columns:\s*minmax\(5rem,\s*auto\)\s+minmax\(0,\s*1fr\)/s,
  )
  assert.match(
    styles,
    /@media\s*\(max-width:\s*720px\)[\s\S]*\.source-note-points\s+li\s*\{[^}]*grid-template-columns:\s*1fr/s,
  )
  assert.match(styles, /@media\s+print/)
})

test("SourceNoteBrief styles provide compact metadata touch targets and source-detail print accordions", () => {
  const styles = readFileSync(new URL("./styles.scss", import.meta.url), "utf8")
  assert.match(styles, /\.source-note-meta\s+a[^}]*display:\s*inline-flex/s)
  assert.match(styles, /\.source-note-meta\s+a[^}]*min-height:\s*44px/s)
  assert.match(
    styles,
    /\.page\[data-content-type=["']source-note["']\]\s+\.callout\[data-callout=["']source-detail["']\]/,
  )
  assert.match(styles, /source-detail[^}]*grid-template-columns/s)
  assert.match(styles, /@media print[\s\S]*source-detail[\s\S]*display:\s*block\s*!important/s)
  assert.match(styles, /@media print[\s\S]*source-detail[\s\S]*visibility:\s*visible\s*!important/s)
})

test("SourceNoteBrief renders nothing for non-source-note pages", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const Component = componentModule.default()
  const output = Component({ fileData: { frontmatter: { type: "article" } } } as never)
  assert.equal(output, null)
})

test("SourceNoteBrief exposes an accessible structure and draft warning", async () => {
  const componentModule = await loadComponent()
  assert.ok(componentModule, "component module should exist")
  const Component = componentModule.default()
  const html = renderTree(
    Component({
      fileData: { frontmatter: { ...sourceFrontmatter, publish: false, key_points: [] } },
    } as never),
  )

  assert.match(html, /role="region"/)
  assert.match(html, /aria-labelledby=/)
  assert.match(html, /<h2[^>]*>원문의 주장<\/h2>/)
  assert.match(html, /<h2[^>]*>나의 해석<\/h2>/)
  assert.match(html, /source-note-warning/)
  assert.match(html, /source-note-points/)
  assert.match(html, /source-note-actions/)
})
