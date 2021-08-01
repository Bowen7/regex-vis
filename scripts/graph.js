const { buildSync } = require("esbuild")
const path = require("path")

buildSync({
  entryPoints: [
    path.resolve(__dirname, "../src/modules/graph/minimum-graph.tsx"),
  ],
  outfile: path.resolve(__dirname, "../graph/index.js"),
  bundle: true,
  define: { "process.env.EXPORT": "true" },
  external: ["react", "react-dom", "styled-jsx", "canvas"],
  target: "es6",
  format: "cjs",
  platform: "node",
})
