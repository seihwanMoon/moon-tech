import { defineConfig } from "tsup"
import { sassPlugin } from "esbuild-sass-plugin"

export default defineConfig({
  entry: {
    index: "src/index.tsx",
    components: "src/index.tsx",
  },
  format: ["esm"],
  target: "es2022",
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  external: ["preact", "@quartz-community/types"],
  esbuildPlugins: [sassPlugin({ type: "css-text" })],
})
