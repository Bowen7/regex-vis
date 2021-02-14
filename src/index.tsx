import React from "react"
import ReactDOM from "react-dom"
import { GeistProvider, CssBaseline } from "@geist-ui/react"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

const theme = {
  palette: {
    selection: "#3291ff",
  },
}

ReactDOM.render(
  <>
    <GeistProvider theme={theme}>
      <CssBaseline />
      <App />
    </GeistProvider>
    <style jsx global>{`
      ::selection {
        color: #fff !important;
      }
      body {
        font-family: Consolas, Monaco, monospace;

        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
          Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
      }
    `}</style>
  </>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
