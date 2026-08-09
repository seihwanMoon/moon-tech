export const SUPPORTED_SOURCE_TYPES = ["youtube", "threads", "github", "web"] as const

export type SupportedSourceType = (typeof SUPPORTED_SOURCE_TYPES)[number]
export type SourceTypeToken = SupportedSourceType | "unknown"

export interface SourceNotePoint {
  at: string
  title: string
  summary: string
}

export interface SourceNote {
  publish: boolean
  title: string
  description: string
  sourceType: string
  sourceTypeToken: SourceTypeToken
  sourceTypeLabel: string
  sourceTitle: string
  sourceAuthor: string
  sourcePublisher: string
  sourceUrl: string | null
  sourcePublishedLabel: string
  sourcePublishedStatus: "confirmed" | "unknown"
  sourceAccessed: string
  sourceLocator: string
  sourceLanguage: string
  sourceLicense: string
  sourceLicenseUrl: string | null
  sourceUsage: string
  permissionReference: string
  keyTakeaway: string
  sourceClaim: string
  myInterpretation: string
  keyPoints: SourceNotePoint[]
  nextActions: string[]
  warnings: string[]
}

type Frontmatter = Record<string, unknown>

const sourceTypeLabels: Record<SupportedSourceType, string> = {
  youtube: "YouTube",
  threads: "Threads",
  github: "GitHub",
  web: "Web Page",
}

const requiredFields = [
  "title",
  "description",
  "source_type",
  "source_title",
  "source_author",
  "source_url",
  "source_accessed",
  "source_license",
  "source_usage",
  "key_takeaway",
  "source_claim",
  "my_interpretation",
  "key_points",
  "next_actions",
] as const

function asText(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string") return value.trim()
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

function asBoolean(value: unknown): boolean {
  return value === true || (typeof value === "string" && value.toLowerCase() === "true")
}

function normalizeSourceType(value: unknown): string {
  const text = asText(value).toLowerCase()
  if (text === "web page" || text === "web-page" || text === "webpage") return "web"
  return text || "unknown"
}

function sourceTypeLabel(sourceType: string): string {
  if (sourceType in sourceTypeLabels) {
    return sourceTypeLabels[sourceType as SupportedSourceType]
  }
  if (sourceType === "unknown") return "Unknown source"
  return sourceType
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function normalizeUrl(value: unknown): string | null {
  const text = asText(value)
  if (!text) return null
  try {
    const url = new URL(text)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}

function normalizePoints(value: unknown): SourceNotePoint[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return []
    const point = entry as Record<string, unknown>
    const title = asText(point.title)
    const summary = asText(point.summary)
    if (!title && !summary && !asText(point.at)) return []
    return [{ at: asText(point.at), title, summary }]
  })
}

function normalizeActions(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(asText).filter(Boolean)
}

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  return Boolean(asText(value))
}

/** Normalize source-note frontmatter into a render-safe view model. */
export function parseSourceNote(frontmatter: Frontmatter | undefined | null): SourceNote | null {
  if (!frontmatter || asText(frontmatter.type).toLowerCase() !== "source-note") return null

  const sourceType = normalizeSourceType(frontmatter.source_type)
  const sourceTypeToken = SUPPORTED_SOURCE_TYPES.includes(sourceType as SupportedSourceType)
    ? (sourceType as SupportedSourceType)
    : "unknown"
  const sourceUrl = normalizeUrl(frontmatter.source_url)
  const sourceLicenseUrl = normalizeUrl(frontmatter.source_license_url)
  const sourcePublishedStatus = asText(frontmatter.source_published_status).toLowerCase()
  const normalizedPublishedStatus: "confirmed" | "unknown" =
    sourcePublishedStatus === "confirmed" ? "confirmed" : "unknown"
  const sourcePublished = asText(frontmatter.source_published)
  const warnings: string[] = []

  for (const field of requiredFields) {
    if (!hasValue(frontmatter[field])) warnings.push(`Missing required field: ${field}`)
  }
  if (!hasValue(frontmatter.source_published) && sourcePublishedStatus !== "unknown") {
    warnings.push("source_published or source_published_status: unknown is required")
  }
  if (sourceTypeToken === "unknown") warnings.push(`Unsupported source_type: ${sourceType}`)
  if (asText(frontmatter.source_url) && !sourceUrl)
    warnings.push("source_url must be a valid http(s) URL")
  if (asText(frontmatter.source_license_url) && !sourceLicenseUrl) {
    warnings.push("source_license_url must be a valid http(s) URL")
  }
  if (sourcePublishedStatus && !["confirmed", "unknown"].includes(sourcePublishedStatus)) {
    warnings.push("source_published_status must be confirmed or unknown")
  }

  return {
    publish: asBoolean(frontmatter.publish),
    title: asText(frontmatter.title),
    description: asText(frontmatter.description),
    sourceType,
    sourceTypeToken,
    sourceTypeLabel: sourceTypeLabel(sourceType),
    sourceTitle: asText(frontmatter.source_title),
    sourceAuthor: asText(frontmatter.source_author),
    sourcePublisher: asText(frontmatter.source_publisher),
    sourceUrl,
    sourcePublishedLabel: sourcePublished || "Unknown",
    sourcePublishedStatus: normalizedPublishedStatus,
    sourceAccessed: asText(frontmatter.source_accessed) || "Unknown",
    sourceLocator: asText(frontmatter.source_locator) || "Not specified",
    sourceLanguage: asText(frontmatter.source_language),
    sourceLicense: asText(frontmatter.source_license) || "unknown",
    sourceLicenseUrl,
    sourceUsage: asText(frontmatter.source_usage),
    permissionReference: asText(frontmatter.permission_reference),
    keyTakeaway: asText(frontmatter.key_takeaway),
    sourceClaim: asText(frontmatter.source_claim),
    myInterpretation: asText(frontmatter.my_interpretation),
    keyPoints: normalizePoints(frontmatter.key_points),
    nextActions: normalizeActions(frontmatter.next_actions),
    warnings,
  }
}
