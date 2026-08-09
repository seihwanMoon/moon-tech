import { test } from "node:test"
import assert from "node:assert/strict"

const sourceFrontmatter = {
  type: "source-note",
  publish: true,
  title: "Agent research <brief>",
  description: "A short description",
  source_type: "youtube",
  source_title: "Original talk",
  source_author: "Research Channel",
  source_publisher: "YouTube",
  source_url: "https://www.youtube.com/watch?v=abc",
  source_published: "2026-07-28",
  source_published_status: "confirmed",
  source_accessed: "2026-08-08",
  source_locator: "03:15–16:25",
  source_license: "unknown",
  source_license_url: "",
  source_usage: "summary-and-short-quotation",
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

async function loadSchema() {
  return import("./schema").catch(() => undefined)
}

test("parseSourceNote normalizes supported source metadata and preserves ordered content", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")

  const note = schema.parseSourceNote(sourceFrontmatter)
  assert.ok(note)
  assert.equal(note.sourceType, "youtube")
  assert.equal(note.sourceTypeToken, "youtube")
  assert.equal(note.sourceTypeLabel, "YouTube")
  assert.equal(note.sourceUrl, sourceFrontmatter.source_url)
  assert.equal(note.sourcePublishedLabel, "2026-07-28")
  assert.equal(note.sourceLicense, "unknown")
  assert.equal(note.sourceUsage, "summary-and-short-quotation")
  assert.deepEqual(
    note.keyPoints.map((point) => point.title),
    ["A good starting point", "Connect data"],
  )
  assert.deepEqual(note.nextActions, [
    "Choose three candidate workflows",
    "Define an approval point",
  ])
  assert.deepEqual(note.warnings, [])
})

test("parseSourceNote returns null for non-source-note frontmatter", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")
  assert.equal(schema.parseSourceNote({ ...sourceFrontmatter, type: "article" }), null)
})

test("parseSourceNote gives unsupported source types a neutral token and warns", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")
  const note = schema.parseSourceNote({ ...sourceFrontmatter, source_type: "podcast" })
  assert.ok(note)
  assert.equal(note.sourceType, "podcast")
  assert.equal(note.sourceTypeToken, "unknown")
  assert.equal(note.sourceTypeLabel, "Podcast")
  assert.match(note.warnings.join(" "), /source_type/i)
})

test("parseSourceNote rejects unsafe source URLs while retaining a warning", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")
  const note = schema.parseSourceNote({ ...sourceFrontmatter, source_url: "javascript:alert(1)" })
  assert.ok(note)
  assert.equal(note.sourceUrl, null)
  assert.match(note.warnings.join(" "), /URL/i)
})

test("parseSourceNote keeps values available for safe HTML escaping at render time", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")
  const note = schema.parseSourceNote({ ...sourceFrontmatter, source_title: "<Original> & source" })
  assert.ok(note)
  assert.equal(note.sourceTitle, "<Original> & source")
})

test("parseSourceNote reports missing required values for a local draft", async () => {
  const schema = await loadSchema()
  assert.ok(schema, "schema module should exist")
  const note = schema.parseSourceNote({ type: "source-note", publish: false, title: "Draft" })
  assert.ok(note)
  assert.match(note.warnings.join(" "), /source_title/i)
  assert.match(note.warnings.join(" "), /key_points/i)
})
