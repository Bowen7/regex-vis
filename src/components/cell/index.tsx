import React from "react"
import styled from "styled-components"
type Props = {
  label: string
}
const StyledCell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`
const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  user-select: none;
  cursor: default;
  margin-right: 10px;
`

const Cell: React.FC<Props> = ({ label, children }) => {
  return (
    <StyledCell>
      <Label>{label}</Label>
      <div>{children}</div>
    </StyledCell>
  )
}

export default Cell
