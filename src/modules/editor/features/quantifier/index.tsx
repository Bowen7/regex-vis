import React from "react"
import { Radio } from "@geist-ui/react"
import Cell from "@/components/cell"
import { quantifierData } from "./helper"
const Quantifier: React.FC<{}> = () => {
  return (
    <>
      <Cell label="Quantifier times:">
        <div className="container">
          <Radio.Group size="mini" useRow>
            {quantifierData.map(({ value, label }) => (
              <Radio value={value} key={value}>
                <span className="radio-text">{label}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </Cell>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
        }
        .radio-text {
          font-weight: normal;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

export default Quantifier
