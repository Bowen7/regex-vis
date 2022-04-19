import React, { useEffect, useState } from "react"
import { useDebounce } from "react-use"

const withDebounce = <
  Props extends {
    value: string
    onChange: (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void
  }
>(
  Component: React.FC<Props>,
  ms = 300
): React.FC<
  Props & {
    value: string
    onChange: (value: string) => void
  }
> => {
  return (props) => {
    const { value, onChange, ...restProps } = props
    const [innerValue, setInnerValue] = useState(value)

    useDebounce(
      () => {
        onChange(innerValue)
      },
      ms,
      [innerValue]
    )
    useEffect(() => {
      setInnerValue(value)
    }, [value])

    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      setInnerValue(e.target.value)
    }
    return (
      <Component
        {...(restProps as Props)}
        value={innerValue}
        onChange={handleChange}
      />
    )
  }
}

export default withDebounce
