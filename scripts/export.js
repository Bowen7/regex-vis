const React = require("react")
const ReactDOMServer = require("react-dom/server")
const fs = require("fs")
const path = require("path")
const MinimumRailroad = require("../dest/index.js")
const exportList = [
  {
    name: "string",
    regex: "/a/",
    selected: false,
  },
]
const classRegexp = / class="[\w-]+"/g

exportList.forEach(({ name, regex, select }) => {
  const string = ReactDOMServer.renderToString(
    React.createElement(MinimumRailroad, { regex, select })
  ).replace(classRegexp, "")

  fs.writeFileSync(
    path.resolve(__dirname, "../src/assets/" + name + ".svg"),
    string
  )
})
