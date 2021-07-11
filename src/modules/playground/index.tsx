import React from "react"
import parse from "@/parser/parse_new"
const Playground: React.FC<{}> = () => {
  const re = parse("/(a|bc)(?<n>12)/u")
  console.log(re)
  return <>{/* <RangeOption range={range} /> */}</>
}
export default Playground
