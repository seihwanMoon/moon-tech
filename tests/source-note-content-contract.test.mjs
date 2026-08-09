import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

const notesDirectory = new URL("../content/source-notes/", import.meta.url)

test("every published Source Note records its initial public change", async () => {
  const entries = await readdir(notesDirectory, { withFileTypes: true })
  const sourceNotes = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  const missing = []

  for (const entry of sourceNotes) {
    const source = await readFile(new URL(entry.name, notesDirectory), "utf8")
    if (!/^type:\s*source-note$/m.test(source) || !/^publish:\s*true$/m.test(source)) continue
    if (!/^>\s+-\s+변경 기록:\s+\d{4}-\d{2}-\d{2}\s+—\s+.+$/m.test(source)) {
      missing.push(path.basename(entry.name))
    }
  }

  assert.deepEqual(missing, [])
})

test("the final Source Note callout keeps change history without duplicate provenance", async () => {
  const entries = await readdir(notesDirectory, { withFileTypes: true })
  const sourceNotes = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))

  for (const entry of sourceNotes) {
    const source = await readFile(new URL(entry.name, notesDirectory), "utf8")
    if (!/^type:\s*source-note$/m.test(source) || !/^publish:\s*true$/m.test(source)) continue
    assert.match(source, /^enableToc:\s*true$/m)
    assert.match(source, /^> \[!source-detail\]\+ 05\. 변경 기록$/m)
    assert.doesNotMatch(source, /^> - (?:원문|작성자\/게시자|게시일|확인일|라이선스|이용 범위):/m)
  }
})
