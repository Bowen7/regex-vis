import React from "react"
import RadioOption from "@/components/range-option"
const Playground: React.FC<{}> = () => {
  const range = { from: "a", to: "z" }
  return <RadioOption range={range} />
}
export default Playground
