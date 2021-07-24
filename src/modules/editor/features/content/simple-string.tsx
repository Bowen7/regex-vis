import React, { useEffect } from "react"
import { Note, Spacer } from "@geist-ui/react"
import Input from "@/components/input"
import Cell from "@/components/cell"
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
    <Cell.Item label="Value">
      <Note type="secondary" small style={{ lineHeight: 1.5 }}>
        The input will be escaped automatically.
      </Note>
      <Spacer y={0.5} />
      <Input size="small" {...stringBindings} />
    </Cell.Item>
  )
}

export default SimpleString
