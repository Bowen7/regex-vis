const React = require("react")
const ReactDOMServer = require("react-dom/server")
const fs = require("fs")
const path = require("path")
const MinimumRailroad = require("../dest/index.js")
const exportList = [
  {
    name: "characters",
    regex: "/abc/",
    selected: false,
  },
  {
    name: "selected",
    regex: "/abc/",
    selected: true,
  },
]
const classRegexp = / class="[\w-]+"/g
const assetsDir = path.resolve(__dirname, "../public/assets/")

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir)
}

exportList.forEach(({ name, regex, selected }) => {
  const darkString = ReactDOMServer.renderToString(
    React.createElement(MinimumRailroad, { regex, selected, mode: "dark" })
  ).replace(classRegexp, "")

  const lightString = ReactDOMServer.renderToString(
    React.createElement(MinimumRailroad, { regex, selected, mode: "light" })
  ).replace(classRegexp, "")

  fs.writeFileSync(path.resolve(assetsDir, name + "-dark.svg"), darkString)
  fs.writeFileSync(path.resolve(assetsDir, name + "-light.svg"), lightString)
})
