import { Routes as ReactRouters, Route } from "react-router-dom"
import Home from "./modules/home"
import Samples from "./modules/samples"
import Playground from "@/modules/playground"
const isDev = process.env.NODE_ENV === "development"

export default function Routes() {
  return (
    <ReactRouters>
      <Route path="/" element={<Home />} />
      <Route path="/samples" element={<Samples />} />
      {isDev && <Route path="/playground" element={<Playground />} />}
    </ReactRouters>
  )
}
