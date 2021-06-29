const React = require("react")
const ReactDOMServer = require("react-dom/server")
const MinimumGraph = require("../dest/index.js")
let string = ReactDOMServer.renderToString(
  React.createElement(MinimumGraph, {
    regex: "/([a-zA-Z_])*?@[a-zA-Z](\\.[a-zA-Z-]{0,10})?(a|b)/",
    selected: false,
  })
)

string = string
  .replace(/class="stroke"/g, `stroke="#000"`)
  .replace(
    /class="transparent-fill stroke"/g,
    `fill="rgba(255,255,255,0)" stroke="#000"`
  )
  .replace(
    /class="second-stroke transparent-fill"/g,
    `fill="rgba(255,255,255,0)" stroke="#444"`
  )
  .replace(
    /class="transparent-fill second-stroke"/g,
    `fill="rgba(255,255,255,0)" stroke="#444"`
  )
  .replace(/class="transparent-fill"/g, `fill="rgba(255,255,255,0)"`)
  .replace(
    /class="transparent-fill none-stroke"/g,
    `fill="rgba(255,255,255,0)" stroke="none"`
  )
  .replace(/class="text"/g, `fill="#000"`)
  .replace(/<g><g>/g, ``)
  .replace(/<\/g><\/g>/g, ``)
console.log(string)
