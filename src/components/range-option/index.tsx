import React from "react"
import { Code, AutoComplete } from "@geist-ui/react"
import { Range } from "@/types"
type Prop = {
  range: Range
}
const RangeOption: React.FC<Prop> = ({ range }) => {
  const { from, to } = range
  return (
    <>
      <div className="wrapper">
        <AutoComplete value={from} size="small" />
        {" - "}
        <AutoComplete value={to} size="small" />
      </div>
      <style jsx>{`
        .wrapper {
          display: inline-block;
          border: 1px solid rgb(234, 234, 234);
          border-radius: 5px;
        }
        .wrapper :global(.auto-complete) {
          display: inline-block;
          width: 75px;
        }

        .wrapper :global(.input-wrapper) {
          border: none;
        }
        .wrapper :global(input) {
          text-align: center;
        }
      `}</style>
    </>
  )
}
export default RangeOption
