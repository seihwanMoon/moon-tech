import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { QuartzComponentProps } from "../../components/types"
import { getCondition } from "./conditions"

function props(type: string | undefined, slug: string): QuartzComponentProps {
  return {
    fileData: {
      slug,
      frontmatter: type ? { type } : {},
    },
  } as QuartzComponentProps
}

describe("content type layout conditions", () => {
  it("matches source-note pages only", () => {
    const sourceNote = getCondition("source-note")
    assert.ok(sourceNote)
    assert.equal(sourceNote(props("source-note", "source-notes/example")), true)
    assert.equal(sourceNote(props("article", "ai/example")), false)
  })

  it("matches every page except source notes", () => {
    const notSourceNote = getCondition("not-source-note")
    assert.ok(notSourceNote)
    assert.equal(notSourceNote(props("source-note", "source-notes/example")), false)
    assert.equal(notSourceNote(props("article", "ai/example")), true)
  })

  it("keeps regular content chrome off index and source-note pages", () => {
    const regularContent = getCondition("regular-content")
    assert.ok(regularContent)
    assert.equal(regularContent(props("source-note", "source-notes/example")), false)
    assert.equal(regularContent(props("index", "index")), false)
    assert.equal(regularContent(props("article", "ai/example")), true)
  })
})
