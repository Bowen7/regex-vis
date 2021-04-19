import React, { useEffect } from "react"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { checkInputValid, RangeError } from "./utils"
type Props = {
  value: string
  onChange: (value: string) => void
  onError: (err: RangeError) => void
}
const RangeInput: React.FC<Props> = ({ value, onChange, onError }) => {
  const [setValue, valueBindings] = useDebounceInput((value: string) => {
    const error = checkInputValid(value)
    if (error !== null) {
      return onError(error)
    }
    onChange(value)
  }, [])
  useEffect(() => {
    if (value !== valueBindings.value) {
      setValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <Input {...valueBindings} width="85px" />
}
export default RangeInput
