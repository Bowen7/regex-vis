import React, { useEffect } from "react"
import Input from "../input"
type Props = {
  value: string
  onChange: (value: string) => void
} & Omit<React.ComponentProps<typeof Input>, "onChange" | "value">

const SingleInput: React.FC<Props> = ({ value, onChange, ...restProps }) => {
  return <Input value={value} onChange={onChange} {...restProps} />
}

export default SingleInput
