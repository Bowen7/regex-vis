import React from "react"
import ReactDOM from "react-dom"
import { enableMapSet } from "immer"
import App from "./App"
import "./i18n"
import * as serviceWorker from "./serviceWorker"

enableMapSet()
ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
