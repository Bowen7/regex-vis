const {
  override,
  addWebpackAlias,
  addBabelPlugin,
  fixBabelImports,
  // addWebpackPlugin,
} = require("customize-cra")
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const path = require("path")

const findWebpackPlugin = (plugins, pluginName) =>
  plugins.find((plugin) => plugin.constructor.name === pluginName)

const overrideProcessEnv = (value) => (config) => {
  const plugin = findWebpackPlugin(config.plugins, "DefinePlugin")
  const processEnv = plugin.definitions["process.env"] || {}

  plugin.definitions["process.env"] = {
    ...processEnv,
    ...value,
  }

  return config
}

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  addBabelPlugin("styled-jsx/babel"),
  fixBabelImports("@geist-ui/react", {
    libraryDirectory: "esm",
  }),
  // addWebpackPlugin(new BundleAnalyzerPlugin()),
  overrideProcessEnv({
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
    VERCEL_ANALYTICS_ID: JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
  })
)
