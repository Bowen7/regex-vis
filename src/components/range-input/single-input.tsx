import React, { useEffect } from "react"
import Input from "../input"
import { useDebounceInput } from "@/utils/hooks"
type Props = {
  value: string
  onChange: (value: string) => void
}
const SingleInput: React.FC<Props> = ({ value, onChange }) => {
  const [setValue, valueBindings] = useDebounceInput((value: string) => {
    onChange(value)
  }, [])
  useEffect(() => {
    if (value !== valueBindings.value) {
      setValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <Input {...valueBindings} />
}
export default SingleInput
