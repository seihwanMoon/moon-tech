import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

type NavItem = {
  label: string
  slug: FullSlug
  children?: NavItem[]
}

const serviceItems: NavItem[] = [
  { label: "제조", slug: "manufacturing/index" as FullSlug },
  { label: "AI", slug: "ai/index" as FullSlug },
  { label: "프로젝트", slug: "projects/index" as FullSlug },
]

const navItems: NavItem[] = [
  { label: "News", slug: "source-notes/index" as FullSlug },
  { label: "Service", slug: "services/index" as FullSlug, children: serviceItems },
  { label: "About", slug: "about" as FullSlug },
  { label: "Contact", slug: "contact" as FullSlug },
]

const MoonsTechHeader: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <div class="moons-tech-header">
      <a
        class="moons-tech-wordmark internal internal-link"
        href={resolveRelative(props.fileData.slug!, "index" as FullSlug)}
        aria-label="Home"
      >
        Home
      </a>
      <nav class="moons-tech-nav" aria-label="주요 탐색">
        <ul>
          {navItems.map(({ label, slug, children }) => (
            <li key={slug} class={children ? "moons-tech-nav__has-children" : undefined}>
              <a
                class="internal internal-link"
                href={resolveRelative(props.fileData.slug!, slug)}
                aria-haspopup={children ? "true" : undefined}
              >
                {label}
              </a>
              {children && (
                <ul class="moons-tech-nav__submenu" aria-label={`${label} 하위 메뉴`}>
                  {children.map((child) => (
                    <li key={child.slug}>
                      <a
                        class="internal internal-link"
                        href={resolveRelative(props.fileData.slug!, child.slug)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

MoonsTechHeader.css = `
.moons-tech-header {
  display: flex;
  align-items: center;
  gap: 3.5rem;
  min-width: 0;
  flex: 1 1 auto;
}

.moons-tech-wordmark {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  flex: 0 0 auto;
  color: var(--dark);
  font-family: var(--headerFont);
  font-size: 1.25rem;
  font-weight: 760;
  letter-spacing: -0.035em;
  white-space: nowrap;
}

.moons-tech-nav {
  min-width: 0;
}

.moons-tech-nav > ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 1.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.moons-tech-nav li {
  margin: 0;
  padding: 0;
}

.moons-tech-nav__has-children {
  position: relative;
}

.moons-tech-nav__submenu {
  position: absolute;
  z-index: 20;
  top: calc(100% - 0.2rem);
  left: -1rem;
  display: grid;
  min-width: 9rem;
  margin: 0;
  padding: 0.55rem 1rem;
  border: 1px solid var(--lightgray);
  background: var(--light);
  box-shadow: 0 0.75rem 1.5rem rgba(18, 33, 63, 0.12);
  list-style: none;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-0.35rem);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.moons-tech-nav__has-children:hover > .moons-tech-nav__submenu,
.moons-tech-nav__has-children:focus-within > .moons-tech-nav__submenu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.moons-tech-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--darkgray);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

a.moons-tech-wordmark,
.moons-tech-nav a.internal {
  background: transparent;
  padding-inline: 0;
  border-radius: 0;
}

.moons-tech-nav a:hover,
.moons-tech-nav a:focus-visible,
.moons-tech-wordmark:hover,
.moons-tech-wordmark:focus-visible {
  color: var(--secondary);
}

@media all and (max-width: 800px) {
  .moons-tech-header {
    width: 100%;
    flex-wrap: nowrap;
    gap: 0.75rem;
    overflow-x: auto;
  }

  .moons-tech-nav {
    flex: 0 0 auto;
  }

  .moons-tech-nav > ul {
    flex-wrap: nowrap;
    gap: 0.75rem;
  }

  .moons-tech-nav__submenu {
    display: none;
  }
}
`

export default (() => MoonsTechHeader) satisfies QuartzComponentConstructor
