import React from "react"
import { Route } from "react-router-dom"
import Home from "./modules/home"
import Playground from "@/modules/playground"
export default function Routes() {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route path="/guide">
        <p>Todo</p>
      </Route>
      <Route path="/samples">
        <p>Todo</p>
      </Route>
      <Route path="/about">
        <p>Todo</p>
      </Route>
      <Route path="/playground">
        <Playground />
      </Route>
    </>
  )
}
