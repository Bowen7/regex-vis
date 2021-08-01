const React = require("react")
const ReactDOMServer = require("react-dom/server")
const fs = require("fs")
const path = require("path")
const MinimumGraph = require("../graph/index.js").default
const svgs = require("./svgs")
const assetsDir = path.resolve(__dirname, "../src/assets/")

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir)
}

svgs.forEach(({ name, regex, selected = false, withRoot = false }) => {
  const string = ReactDOMServer.renderToString(
    React.createElement(MinimumGraph, { regex, selected, withRoot })
  )

  fs.writeFileSync(path.resolve(assetsDir, name + ".svg"), string)
})
