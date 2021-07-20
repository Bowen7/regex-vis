import React, { useEffect } from "react"
import Input from "../input"
import { useDebounceInput } from "@/utils/hooks"
type Props = {
  value: string
  onChange: (value: string) => void
} & Omit<React.ComponentProps<typeof Input>, "onChange" | "value">

const SingleInput: React.FC<Props> = ({ value, onChange, ...restProps }) => {
  const [setValue, valueBindings] = useDebounceInput((value: string) => {
    onChange(value)
  }, [])
  useEffect(() => {
    if (value !== valueBindings.value) {
      setValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <Input {...valueBindings} {...restProps} />
}

export default SingleInput
