const React = require("react")
const ReactDOMServer = require("react-dom/server")
const fs = require("fs")
const path = require("path")
const MinimumRailroad = require("../dest/index.js")
const exportList = [
  {
    name: "characters",
    regex: "/a/",
    selected: false,
  },
]
const classRegexp = / class="[\w-]+"/g

exportList.forEach(({ name, regex, select }) => {
  const darkString = ReactDOMServer.renderToString(
    React.createElement(MinimumRailroad, { regex, select, mode: "dark" })
  ).replace(classRegexp, "")

  const lightString = ReactDOMServer.renderToString(
    React.createElement(MinimumRailroad, { regex, select, mode: "light" })
  ).replace(classRegexp, "")

  fs.writeFileSync(
    path.resolve(__dirname, "../public/" + name + "-dark.svg"),
    darkString
  )
  fs.writeFileSync(
    path.resolve(__dirname, "../public/" + name + "-light.svg"),
    lightString
  )
})
