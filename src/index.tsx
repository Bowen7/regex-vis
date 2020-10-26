import React from "react"
import ReactDOM from "react-dom"
import { enableMapSet } from "immer"
import { GeistProvider, CssBaseline } from "@geist-ui/react"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
enableMapSet()
ReactDOM.render(
  <GeistProvider>
    <CssBaseline />
    <App />
  </GeistProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
