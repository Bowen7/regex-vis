import React from "react"
import { Routes as ReactRouters, Route } from "react-router-dom"
import Home from "./modules/home"
import Samples from "./modules/samples"
import Playground from "@/modules/playground"
export default function Routes() {
  return (
    <ReactRouters>
      <Route path="/" element={<Home />} />
      <Route path="/samples" element={<Samples />} />
      <Route path="/playground" element={<Playground />} />
    </ReactRouters>
  )
}
