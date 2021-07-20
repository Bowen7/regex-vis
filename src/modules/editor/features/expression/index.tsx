import React from "react"
import Cell from "@/components/cell"
type Prop = {
  expression: String
}
const Expression: React.FC<Prop> = ({ expression }) => {
  return (
    <>
      <Cell label="Expression">
        <span className="expression">{expression}</span>
      </Cell>
      <style jsx>{`
        .expression {
          color: #3291ff;
        }
      `}</style>
    </>
  )
}

export default Expression
