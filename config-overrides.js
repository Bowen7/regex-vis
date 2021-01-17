const { override, addWebpackAlias, addBabelPlugin } = require("customize-cra")
const path = require("path")

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addBabelPlugin("styled-jsx/babel")
)
