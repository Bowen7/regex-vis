import React, { useEffect } from "react"
import { Input } from "@geist-ui/react"
import InjectInput from "@/utils/hoc/inject-input"
import { useDebounceInput } from "@/utils/hooks"
import { checkInputValid } from "./utils"
const InjectedInput = InjectInput(Input)
type Props = {
  value: string
  onChange?: (isError: boolean, value?: string) => void
  onError?: (errMsg: string) => void
}
const RangeInput: React.FC<Props> = ({ value, onChange }) => {
  const [setValue, valueBindings] = useDebounceInput((value: string) => {
    const error = checkInputValid(value)
    if (error !== null) {
      console.log(error)
    }
  }, [])
  useEffect(() => {
    if (value !== valueBindings.value) {
      setValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <InjectedInput {...valueBindings} width="85px" />
}
export default RangeInput
