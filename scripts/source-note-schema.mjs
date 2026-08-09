/**
 * Source Note frontmatter contract.
 *
 * The validator deliberately returns data instead of throwing so callers can
 * distinguish blocking published errors from draft warnings.
 */

import spdxLicenseIds from "spdx-license-ids/index.json" with { type: "json" }

export const ALLOWED_SOURCE_TYPES = ["youtube", "threads", "github", "web"]
export const ALLOWED_SOURCE_PUBLISHED_STATUSES = ["confirmed", "unknown"]
export const ALLOWED_SOURCE_USAGES = [
  "link-only",
  "summary-only",
  "summary-and-short-quotation",
  "licensed-reuse",
  "permission-granted",
]
export const ALLOWED_SOURCE_LICENSE_STATES = ["proprietary", "all-rights-reserved", "unknown"]

const SPDX_LICENSE_IDENTIFIERS = new Set(spdxLicenseIds)

export const REQUIRED_SOURCE_FIELDS = [
  "title",
  "description",
  "type",
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
]

export const CHARACTER_BUDGETS = {
  title: 60,
  description: 120,
  key_takeaway: 120,
  source_claim: 140,
  my_interpretation: 160,
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function text(value) {
  return typeof value === "string" ? value.trim() : ""
}

function dateText(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10)
  }
  return typeof value === "string" ? value.trim() : ""
}

export function isValidDate(value) {
  const valueText = dateText(value)
  if (!DATE_RE.test(valueText)) return false
  const [year, month, day] = valueText.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

function issue(field, code, message, severity) {
  return { field, code, message, severity }
}

function severityFor(frontmatter) {
  return frontmatter.publish === true ? "error" : "warning"
}

function addContractIssue(issues, frontmatter, field, code, message) {
  issues.push(issue(field, code, message, severityFor(frontmatter)))
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (value instanceof Date) return !Number.isNaN(value.getTime())
  return text(value).length > 0
}

function isSpdxLicense(value) {
  if (typeof value !== "string") return false
  if (SPDX_LICENSE_IDENTIFIERS.has(value)) return true
  return /^LicenseRef-[A-Za-z0-9][A-Za-z0-9.-]*$/.test(value)
}

function parseNow(value) {
  if (value === undefined) return new Date()
  if (value instanceof Date) return value
  if (typeof value === "string" && isValidDate(value)) {
    return new Date(`${value}T00:00:00.000Z`)
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

function addDateIssueIfPresent(issues, frontmatter, field) {
  const value = frontmatter[field]
  if (value === undefined || value === null || text(value) === "") return
  if (!isValidDate(value)) {
    addContractIssue(
      issues,
      frontmatter,
      field,
      "invalid-date",
      `${field} must be an ISO date (YYYY-MM-DD).`,
    )
  }
}

function urlIsHttp(value) {
  if (typeof value !== "string" || !value.trim()) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Validate one parsed source-note frontmatter object.
 * @param {Record<string, unknown>} frontmatter
 * @param {{now?: string|Date, staleAfterDays?: number}} options
 * @returns {Array<{field:string,code:string,message:string,severity:string}>}
 */
export function validateSourceNote(frontmatter, options = {}) {
  if (!frontmatter || typeof frontmatter !== "object") {
    return [
      {
        field: "frontmatter",
        code: "invalid-frontmatter",
        message: "Frontmatter must be a mapping.",
        severity: "error",
      },
    ]
  }

  // This module is intentionally safe to call for every Markdown document.
  if (frontmatter.type !== "source-note") return []

  const issues = []
  const contractSeverity = severityFor(frontmatter)

  if (typeof frontmatter.publish !== "boolean") {
    issues.push(
      issue(
        "publish",
        "invalid-type",
        "publish must be a boolean (true or false).",
        contractSeverity,
      ),
    )
  }

  for (const field of REQUIRED_SOURCE_FIELDS) {
    const value = frontmatter[field]
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      addContractIssue(
        issues,
        frontmatter,
        field,
        "required",
        `${field} is required for a source note.`,
      )
    }
  }

  if (frontmatter.type !== "source-note") {
    addContractIssue(issues, frontmatter, "type", "invalid-value", "type must be source-note.")
  }

  if (
    frontmatter.source_type !== undefined &&
    !ALLOWED_SOURCE_TYPES.includes(frontmatter.source_type)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "source_type",
      "invalid-value",
      `source_type must be one of: ${ALLOWED_SOURCE_TYPES.join(", ")}.`,
    )
  }

  if (frontmatter.source_url !== undefined && !urlIsHttp(frontmatter.source_url)) {
    addContractIssue(
      issues,
      frontmatter,
      "source_url",
      "invalid-url",
      "source_url must be an absolute HTTP or HTTPS URL.",
    )
  }

  addDateIssueIfPresent(issues, frontmatter, "source_accessed")
  addDateIssueIfPresent(issues, frontmatter, "source_published")

  const publicationDateMissing = !hasValue(frontmatter.source_published)
  const publicationStatus = frontmatter.source_published_status
  if (publicationDateMissing && publicationStatus !== "unknown") {
    addContractIssue(
      issues,
      frontmatter,
      "source_published",
      "missing-publication-date",
      "Provide source_published or set source_published_status to unknown.",
    )
    addContractIssue(
      issues,
      frontmatter,
      "source_published_status",
      "missing-publication-status",
      "Provide source_published or set source_published_status to unknown.",
    )
  }
  if (
    publicationStatus !== undefined &&
    publicationStatus !== null &&
    !ALLOWED_SOURCE_PUBLISHED_STATUSES.includes(publicationStatus)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "source_published_status",
      "invalid-value",
      `source_published_status must be one of: ${ALLOWED_SOURCE_PUBLISHED_STATUSES.join(", ")}.`,
    )
  }

  if (
    frontmatter.source_license !== undefined &&
    !ALLOWED_SOURCE_LICENSE_STATES.includes(frontmatter.source_license) &&
    !isSpdxLicense(frontmatter.source_license)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "source_license",
      "invalid-value",
      "source_license must be an SPDX identifier or proprietary, all-rights-reserved, or unknown.",
    )
  }

  if (
    frontmatter.source_usage !== undefined &&
    !ALLOWED_SOURCE_USAGES.includes(frontmatter.source_usage)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "source_usage",
      "invalid-value",
      `source_usage must be one of: ${ALLOWED_SOURCE_USAGES.join(", ")}.`,
    )
  }

  for (const [field, max] of Object.entries(CHARACTER_BUDGETS)) {
    if (typeof frontmatter[field] === "string" && frontmatter[field].length > max) {
      issues.push(
        issue(
          field,
          "character-budget",
          `${field} exceeds the recommended ${max}-character first-screen budget (${frontmatter[field].length}).`,
          "warning",
        ),
      )
    }
  }

  for (const field of ["key_points", "next_actions"]) {
    const value = frontmatter[field]
    if (!Array.isArray(value) || value.length === 0) {
      addContractIssue(
        issues,
        frontmatter,
        field,
        "empty-list",
        `${field} must contain at least one item.`,
      )
    } else if (value.length > 3) {
      addContractIssue(
        issues,
        frontmatter,
        field,
        "too-many-items",
        `${field} must contain no more than three items.`,
      )
    }
  }

  if (
    frontmatter.source_usage === "summary-and-short-quotation" &&
    !hasValue(frontmatter.source_locator)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "source_locator",
      "required-for-quotation",
      "source_locator is required when using short quotations.",
    )
  }
  if (frontmatter.source_usage === "licensed-reuse" && frontmatter.source_license === "unknown") {
    addContractIssue(
      issues,
      frontmatter,
      "source_license",
      "license-required-for-reuse",
      "licensed-reuse requires a known license.",
    )
  }
  if (
    frontmatter.source_usage === "permission-granted" &&
    !hasValue(frontmatter.permission_reference)
  ) {
    addContractIssue(
      issues,
      frontmatter,
      "permission_reference",
      "required-for-permission",
      "permission_reference is required when permission-granted is used.",
    )
  }

  const accessed = dateText(frontmatter.source_accessed)
  if (isValidDate(accessed)) {
    const now = parseNow(options.now)
    const ageDays = Number.isFinite(options.staleAfterDays) ? options.staleAfterDays : 180
    const accessedDate = new Date(`${accessed}T00:00:00.000Z`)
    const threshold = new Date(now.getTime() - ageDays * 24 * 60 * 60 * 1000)
    if (accessedDate <= threshold) {
      issues.push(
        issue(
          "source_accessed",
          "stale-access",
          `source_accessed is ${ageDays} days or more old; re-check the source.`,
          "warning",
        ),
      )
    }
  }

  if (!Array.isArray(frontmatter.related) || frontmatter.related.length === 0) {
    issues.push(issue("related", "missing-related", "Add at least one related note.", "warning"))
  }

  if (Array.isArray(frontmatter.service_relevance) && frontmatter.service_relevance.length > 0) {
    const related = Array.isArray(frontmatter.related) ? frontmatter.related : []
    const body = typeof options.body === "string" ? options.body : ""
    const hasServiceLink =
      related.some(
        (entry) => typeof entry === "string" && /\[\[(?:services?|service)\//i.test(entry),
      ) ||
      /\[\[(?:services?|service)\//i.test(body) ||
      /\]\(\s*\/?(?:services?|service)\//i.test(body)
    if (!hasServiceLink) {
      issues.push(
        issue(
          "service_relevance",
          "missing-service-link",
          "service_relevance should include a related service link.",
          "warning",
        ),
      )
    }
  }

  return issues
}

export function hasBlockingErrors(issues) {
  return issues.some((item) => item.severity === "error")
}
