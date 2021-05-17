const React = require("react")
const ReactDOMServer = require("react-dom/server")
const Header = require("./dest/index.js")
const string = ReactDOMServer.renderToString(
  React.createElement(Header, { regex: `/abc/` })
).replace(/ class="[\w-]+"/g, "")

console.log(string)
