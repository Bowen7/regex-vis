import React from "react"
import Input from "@/components/input"
import { checkInputValid, RangeError } from "./utils"
type Props = {
  value: string
  onChange: (value: string) => void
  onError: (err: RangeError) => void
}
const RangeInput: React.FC<Props> = ({ value, onChange, onError }) => {
  const handleChange = () => {
    const error = checkInputValid(value)
    if (error !== null) {
      return onError(error)
    }
    onChange(value)
  }
  return <Input value={value} onChange={handleChange} width="85px" />
}
export default RangeInput
