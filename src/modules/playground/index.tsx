import React from "react"
import parse from "@/parser/parse_new"
// const r = "/[\\z-\\a]/u"
const r = "/(?<a>(?<=\\w{3}))f/"
const Playground: React.FC<{}> = () => {
  const re = parse(r)
  console.log(re)
  return <>{/* <RangeOption range={range} /> */}</>
}
export default Playground
