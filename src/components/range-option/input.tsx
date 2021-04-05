import React, { useState, useEffect } from "react"
import { Input } from "@geist-ui/react"
import InjectInput from "@/utils/hoc/inject-input"
const InjectedInput = InjectInput(Input)
type Props = {
  value: string
  onChange?: (isError: boolean, value?: string) => void
}
const RangeInput: React.FC<Props> = ({ value, onChange }) => {
  const [innerValue, setInnerValue] = useState(value)
  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value)
  }

  return (
    <InjectedInput value={innerValue} onChange={handleChange} width="85px" />
  )
}
export default RangeInput
