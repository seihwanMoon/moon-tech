import { Explorer as CommunityExplorer, ExplorerOptions } from "@quartz-community/explorer"
import { Fragment, h } from "preact"
import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

type ExplorerNode = {
  slugSegment?: string
  slugSegments?: string[]
  displayName?: string
  isFolder: boolean
  data: Record<string, unknown> | null
  children: ExplorerNode[]
}

const ROOT_LABELS = {
  "source-notes": "News",
  services: "Service",
  manufacturing: "제조",
  ai: "AI",
  projects: "프로젝트",
  about: "About",
  contact: "Contact",
} as const

const SERVICE_CHILDREN = ["manufacturing", "ai", "projects"] as const

const topicHierarchyScript = `
const topicServiceChildren = ["manufacturing", "ai", "projects"]

function topicRootSlug(item) {
  const folderPath = item.querySelector(":scope > .folder-container")?.dataset.folderpath
  if (folderPath) return folderPath.split("/")[0]
  const href = item.querySelector(":scope > a")?.getAttribute("href") ?? ""
  return href.replace(/^.*\\/moon-tech\\//, "").replace(/^\\//, "").split("/")[0]
}

function arrangeTopicExplorer() {
  document.querySelectorAll(".explorer-ul").forEach((root) => {
    const rootItems = Array.from(root.children).filter((item) => item.tagName === "LI")
    const serviceItem = rootItems.find((item) => topicRootSlug(item) === "services")
    const serviceList = serviceItem?.querySelector(":scope > .folder-outer > ul.content")
    if (!serviceList) return

    for (const slug of topicServiceChildren) {
      const child = rootItems.find((item) => topicRootSlug(item) === slug)
      if (child) serviceList.appendChild(child)
    }
  })
}

function attachTopicMobileToggle() {
  document.querySelectorAll("button.mobile-explorer").forEach((button) => {
    if (!button.querySelector(".topic-mobile-label")) {
      const label = document.createElement("span")
      label.className = "topic-mobile-label"
      label.textContent = "Topic"
      button.appendChild(label)
    }
    if (button.dataset.topicToggle === "true") return
    button.dataset.topicToggle = "true"
    button.addEventListener(
      "click",
      () => {
        const explorer = button.closest(".explorer")
        if (!explorer) return
        const shouldOpen = explorer.classList.contains("collapsed")
        setTimeout(() => {
          explorer.classList.toggle("collapsed", !shouldOpen)
          explorer.setAttribute("aria-expanded", shouldOpen ? "true" : "false")
          document.documentElement.classList.toggle("mobile-no-scroll", shouldOpen)
        }, 0)
      },
      true,
    )
  })
}

function observeTopicExplorer() {
  document.querySelectorAll(".explorer-ul").forEach((root) => {
    if (root.dataset.topicObserver === "true") return
    root.dataset.topicObserver = "true"
    new MutationObserver(() => queueMicrotask(arrangeTopicExplorer)).observe(root, {
      childList: true,
      subtree: true,
    })
  })
  attachTopicMobileToggle()
  queueMicrotask(arrangeTopicExplorer)
}

document.addEventListener("nav", observeTopicExplorer)
document.addEventListener("render", observeTopicExplorer)
observeTopicExplorer()
`

const MoonsTechExplorer = ((userOptions?: Partial<ExplorerOptions>) => {
  const communityExplorer = CommunityExplorer({
    ...userOptions,
    title: "Topic",
    order: ["filter", "map", "sort"],
    filterFn: (node: ExplorerNode) => {
      const approvedRootSlugs = new Set([
        "source-notes",
        "services",
        "manufacturing",
        "ai",
        "projects",
        "about",
        "contact",
      ])
      if (node.slugSegments?.[0] === "services" && node.slugSegments.length > 1) return false
      return (node.slugSegments?.length ?? 0) !== 1 || approvedRootSlugs.has(node.slugSegment ?? "")
    },
    mapFn: (node: ExplorerNode) => {
      const labels: Record<string, string> = {
        "source-notes": "News",
        services: "Service",
        manufacturing: "제조",
        ai: "AI",
        projects: "프로젝트",
        about: "About",
        contact: "Contact",
      }
      if ((node.slugSegments?.length ?? 0) === 1 && node.slugSegment) {
        node.displayName = labels[node.slugSegment] ?? node.displayName
      }
      return node
    },
    sortFn: (a: ExplorerNode, b: ExplorerNode) => {
      const rank: Record<string, number> = {
        "source-notes": 0,
        services: 1,
        manufacturing: 2,
        ai: 3,
        projects: 4,
        about: 5,
        contact: 6,
      }
      const bothRoot = (a.slugSegments?.length ?? 0) === 1 && (b.slugSegments?.length ?? 0) === 1
      if (bothRoot) return (rank[a.slugSegment ?? ""] ?? 99) - (rank[b.slugSegment ?? ""] ?? 99)
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
      return (a.displayName ?? "").localeCompare(b.displayName ?? "", undefined, {
        numeric: true,
        sensitivity: "base",
      })
    },
  }) as unknown as QuartzComponent

  const explorer: QuartzComponent = (props) =>
    h(
      Fragment,
      null,
      h(
        "a",
        {
          class: "moons-tech-sidebar-logo internal internal-link",
          href: resolveRelative(props.fileData.slug!, "index" as FullSlug),
          "aria-label": "Moon's Tech Home",
        },
        "Moon's Tech",
      ),
      h(communityExplorer, props),
    )

  explorer.css = `${communityExplorer.css ?? ""}
a.moons-tech-sidebar-logo.internal {
  display: inline-flex;
  width: fit-content;
  min-height: 44px;
  align-items: center;
  margin: 0 0 1.35rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: var(--dark);
  font-family: var(--headerFont);
  font-size: 1.25rem;
  font-weight: 760;
  letter-spacing: -0.04em;
}

.topic-mobile-label {
  display: none;
}

a.moons-tech-sidebar-logo.internal:hover,
a.moons-tech-sidebar-logo.internal:focus-visible {
  color: var(--secondary);
}

@media all and (max-width: 800px) {
  a.moons-tech-sidebar-logo.internal {
    position: relative;
    z-index: 102;
    margin: 0;
  }

  .explorer button.mobile-explorer {
    gap: 0.4rem;
  }

  .explorer button.mobile-explorer .topic-mobile-label {
    display: inline;
    color: var(--dark);
    font-family: var(--headerFont);
    font-size: 0.9rem;
    font-weight: 700;
  }
}
`
  explorer.beforeDOMLoaded = communityExplorer.beforeDOMLoaded
  explorer.afterDOMLoaded = [communityExplorer.afterDOMLoaded, topicHierarchyScript]
    .filter(Boolean)
    .join("\n")
  return explorer
}) satisfies QuartzComponentConstructor<Partial<ExplorerOptions>>

void ROOT_LABELS
void SERVICE_CHILDREN

export default MoonsTechExplorer
