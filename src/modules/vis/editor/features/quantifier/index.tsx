import React from "react"
import { Checkbox } from "@geist-ui/react"
import Cell from "@/components/cell"
import { quantifierData } from "./helper"
const Quantifier: React.FC<{}> = () => {
  return (
    <>
      <Cell label="Quantifier times:">
        <div className="checkboxes">
          {quantifierData.map(({ value, label }) => (
            <Checkbox checked={false} key={value}>
              {label}
            </Checkbox>
          ))}
        </div>
      </Cell>
      <Cell label="Quantifier greedy:">
        <Checkbox initialChecked={true}>Greedy</Checkbox>
      </Cell>
      <style jsx>{`
        .checkboxes :global(label:not(:last-child)) {
          margin-right: 20px;
        }
      `}</style>
    </>
  )
}

export default Quantifier
