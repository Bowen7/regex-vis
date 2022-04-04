const React = require("react")
const ReactDOMServer = require("react-dom/server")
const fs = require("fs")
const path = require("path")
const MinimumGraph = require("../export/graph.js").default
const { parse } = require("../export/parser.js")
const svgs = require("./svgs")
const assetsDir = path.resolve(__dirname, "../src/assets/")

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir)
}

svgs.forEach(({ name, regex }) => {
  const ast = parse(regex)
  const string = ReactDOMServer.renderToString(
    React.createElement(MinimumGraph, { regex, ast })
  )

  fs.writeFileSync(path.resolve(assetsDir, name + ".svg"), string)
})
