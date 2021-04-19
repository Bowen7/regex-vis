const {
  override,
  addWebpackAlias,
  addBabelPlugin,
  fixBabelImports,
} = require("customize-cra")
const path = require("path")

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addBabelPlugin("styled-jsx/babel"),
  fixBabelImports("@geist-ui/react", {
    libraryDirectory: "esm",
  })
)
