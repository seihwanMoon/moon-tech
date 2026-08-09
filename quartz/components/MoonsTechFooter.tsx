import { QuartzComponent, QuartzComponentConstructor } from "./types"

const MoonsTechFooter: QuartzComponent = () => {
  return (
    <footer class="moons-tech-footer">
      <small>© moon's tech. All rights reserved.</small>
    </footer>
  )
}

MoonsTechFooter.css = `
.moons-tech-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 1.5rem clamp(1.25rem, 4vw, 3rem);
  border-top: 1px solid var(--lightgray);
  color: var(--darkgray);
  text-align: center;
}

.moons-tech-footer small {
  color: var(--darkgray);
  font-size: 0.78rem;
  letter-spacing: -0.01em;
}

@media all and (max-width: 800px) {
  .moons-tech-footer {
    padding: 1.25rem;
  }
}
`

export default (() => MoonsTechFooter) satisfies QuartzComponentConstructor
