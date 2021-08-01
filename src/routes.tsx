import React from "react"
import { Route } from "react-router-dom"
import Home from "./modules/home"
import Samples from "./modules/samples"
// import Playground from "@/modules/playground"
export default function Routes() {
  return (
    <>
      <Route exact path="/" component={Home} />
      {/* <Route path="/guide">
        <p>Todo</p>
      </Route> */}
      <Route path="/samples">
        <Samples />
      </Route>
      {/* <Route path="/about">
        <p>Todo</p>
      </Route> */}
      {/* <Route path="/playground">
        <Playground />
      </Route> */}
    </>
  )
}
