import React, { useEffect } from "react"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { useMainReducer, MainActionTypes } from "@/redux"

type Props = {
  value: string
}
const SimpleString: React.FC<Props> = ({ value }) => {
  const [, dispatch] = useMainReducer()

  const [setString, stringBindings] = useDebounceInput(
    (value: string) =>
      dispatch({
        type: MainActionTypes.UPDATE_CONTENT,
        payload: {
          kind: "string",
          value,
        },
      }),
    []
  )

  useEffect(() => {
    setString(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <>
      <Input size="small" {...stringBindings} />
    </>
  )
}

export default SimpleString
