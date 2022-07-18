const {
  override,
  addWebpackAlias,
  addBabelPlugin,
  fixBabelImports,
} = require("customize-cra")
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
  overrideProcessEnv({
    "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
  })
)
