import React from "react"
import { Radio } from "@geist-ui/react"
import styled from "styled-components"
import Divide from "@/components/divide"
import { quantifierData } from "./helper"
const StyleRadioText = styled.span`
  font-weight: normal;
  font-size: 14px;
`
const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`
const Quantifier: React.FC<{}> = () => {
  return (
    <Wrap>
      <Radio.Group size="mini" useRow>
        {quantifierData.map(({ value, label }) => (
          <Radio value={value} key={value}>
            <StyleRadioText>{label}</StyleRadioText>
          </Radio>
        ))}
      </Radio.Group>
      <Divide />
    </Wrap>
  )
}

export default Quantifier
