import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import styles from "./styles.scss"
import { parseSourceNote } from "./schema"

function headingId(fileData: QuartzComponentProps["fileData"]): string {
  const slug = typeof fileData?.slug === "string" ? fileData.slug : "brief"
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "")
  return `source-note-brief-${safeSlug || "brief"}`
}

type SourceNoteBriefOptions = Record<string, never>

const SourceNoteBrief: QuartzComponentConstructor<SourceNoteBriefOptions> = (_opts?) => {
  const Component: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const note = parseSourceNote(fileData?.frontmatter as Record<string, unknown> | undefined)
    if (!note) return null

    const titleId = headingId(fileData)
    return (
      <section
        class={`source-note-brief source-${note.sourceTypeToken}`}
        role="region"
        aria-labelledby={titleId}
      >
        <div class="source-note-summary">
          <h1 id={titleId}>{note.title || "Untitled source note"}</h1>
          {note.description && <p class="source-note-description">{note.description}</p>}

          {note.warnings.length > 0 && (
            <div class="source-note-warning" role="status" aria-live="polite">
              <strong>{note.publish ? "출처 노트 확인 필요" : "초안 확인 필요"}</strong>
              <ul>
                {note.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <section class="source-note-takeaway" aria-labelledby={`${titleId}-takeaway`}>
            <h2 id={`${titleId}-takeaway`}>한 문장 핵심</h2>
            <p>{note.keyTakeaway || "No takeaway has been added yet."}</p>
          </section>

          <section class="source-note-points-section" aria-labelledby={`${titleId}-points`}>
            <h2 id={`${titleId}-points`}>핵심 포인트</h2>
            <ol class="source-note-points">
              {note.keyPoints.map((point, index) => (
                <li key={`${point.at}-${point.title}-${index}`}>
                  {point.at && <time>{point.at}</time>}
                  <strong>{point.title || `Point ${index + 1}`}</strong>
                  <span>{point.summary}</span>
                </li>
              ))}
            </ol>
          </section>

          <div class="source-note-interpretation">
            <section aria-labelledby={`${titleId}-claim`}>
              <h2 id={`${titleId}-claim`}>원문의 주장</h2>
              <p>{note.sourceClaim || "No source claim has been added yet."}</p>
            </section>
            <section aria-labelledby={`${titleId}-interpretation`}>
              <h2 id={`${titleId}-interpretation`}>나의 해석</h2>
              <p>{note.myInterpretation || "No interpretation has been added yet."}</p>
            </section>
          </div>

          <section class="source-note-actions-section" aria-labelledby={`${titleId}-actions`}>
            <h2 id={`${titleId}-actions`}>다음 행동</h2>
            <ul class="source-note-actions">
              {note.nextActions.map((action, index) => (
                <li key={`${action}-${index}`}>{action}</li>
              ))}
            </ul>
          </section>

          <aside class="source-note-meta" aria-label="원문 메타데이터">
            <header class="source-note-meta-header">
              <h2>출처 정보</h2>
              <p class="source-note-type">{note.sourceTypeLabel}</p>
            </header>
            <dl>
              <dt>원문 제목</dt>
              <dd>{note.sourceTitle || "Unknown"}</dd>
              <dt>작성자·채널</dt>
              <dd>{note.sourceAuthor || "Unknown"}</dd>
              {note.sourcePublisher && (
                <>
                  <dt>게시자</dt>
                  <dd>{note.sourcePublisher}</dd>
                </>
              )}
              <dt>게시일</dt>
              <dd>{note.sourcePublishedLabel}</dd>
              <dt>확인일</dt>
              <dd>{note.sourceAccessed}</dd>
              <dt>원문 위치</dt>
              <dd>{note.sourceLocator}</dd>
              <dt>라이선스</dt>
              <dd>
                {note.sourceLicense}
                {note.sourceLicenseUrl && (
                  <>
                    {" "}
                    <a href={note.sourceLicenseUrl} rel="noopener noreferrer">
                      라이선스 상세
                    </a>
                  </>
                )}
              </dd>
              <dt>이용 범위</dt>
              <dd>{note.sourceUsage || "Not specified"}</dd>
              <dt>원문 URL</dt>
              <dd>
                {note.sourceUrl ? (
                  <a class="source-note-url-link" href={note.sourceUrl} rel="noopener noreferrer">
                    {note.sourceUrl}
                  </a>
                ) : (
                  "확인 불가"
                )}
              </dd>
              {note.permissionReference && (
                <>
                  <dt>허락 근거</dt>
                  <dd>{note.permissionReference}</dd>
                </>
              )}
            </dl>
          </aside>
        </div>
      </section>
    )
  }

  Component.css = styles
  return Component
}

export { SourceNoteBrief }
export default SourceNoteBrief
