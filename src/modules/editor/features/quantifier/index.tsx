import React from "react"
import { Radio } from "@geist-ui/react"
import Divide from "@/components/divide"
import { quantifierData } from "./helper"
const Quantifier: React.FC<{}> = () => {
  return (
    <>
      <div className="container">
        <Radio.Group size="mini" useRow>
          {quantifierData.map(({ value, label }) => (
            <Radio value={value} key={value}>
              <span className="radio-text">{label}</span>
            </Radio>
          ))}
        </Radio.Group>
        <Divide />
      </div>
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
