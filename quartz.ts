import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import MoonsTechFooter from "./quartz/components/MoonsTechFooter"
import MoonsTechHeader from "./quartz/components/MoonsTechHeader"
import MoonsTechExplorer from "./quartz/components/MoonsTechExplorer"

// Keep the brand chrome local to the site while allowing the YAML layout to
// continue using Quartz's standard component names. Registration happens
// before loadQuartzConfig() resolves layouts.
componentRegistry.register("page-title", MoonsTechHeader, "local:moons-tech")
componentRegistry.register("PageTitle", MoonsTechHeader, "local:moons-tech")
componentRegistry.register("@quartz-community/page-title", MoonsTechHeader, "local:moons-tech")
componentRegistry.register("footer", MoonsTechFooter, "local:moons-tech")
componentRegistry.register("Footer", MoonsTechFooter, "local:moons-tech")
componentRegistry.register("@quartz-community/footer", MoonsTechFooter, "local:moons-tech")
componentRegistry.register("explorer", MoonsTechExplorer, "local:moons-tech")
componentRegistry.register("Explorer", MoonsTechExplorer, "local:moons-tech")
componentRegistry.register("@quartz-community/explorer", MoonsTechExplorer, "local:moons-tech")

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
