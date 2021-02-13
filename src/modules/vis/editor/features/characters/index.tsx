import React from "react"
import { Checkbox } from "@geist-ui/react"
import Cell from "@/components/cell"
import { charactersData } from "./helper"
const Characters: React.FC<{}> = () => {
  return (
    <>
      <Cell label="Characters:">
        <div className="checkboxes">
          {charactersData.map(({ value, label }) => (
            <Checkbox checked={false} key={value}>
              {label}
            </Checkbox>
          ))}
        </div>
      </Cell>
      <style jsx>{`
        .checkboxes :global(label:not(:last-child)) {
          margin-right: 20px;
        }
      `}</style>
    </>
  )
}

export default Characters
