import React from "react"
import { parse } from "@/parser"
import MinimumGraph from "../graph/minimum-graph"
// const r = "/[\\z-\\a]/u"
const r = "/abc/"
const Playground: React.FC<{}> = () => {
  return (
    <>
      <MinimumGraph regex={r} />
    </>
  )
}
export default Playground
