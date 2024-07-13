import React, { useCallback, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { REGEX_FONT_FAMILY } from '@/constants'
import { Input as UIInput } from '@/components/ui/input'

type Props = Omit<React.ComponentProps<typeof UIInput>, 'onChange'> & {
  validation?: RegExp
  errMsg?: string
  onChange: (value: string) => void
}

const Input: React.FC<Props> = (props) => {
  const {
    onChange,
    validation,
    errMsg = 'Invalid input',
    value,
    ...restProps
  } = props
  const [invalid, setInvalid] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleChange = useCallback((value: string) => {
    if (validation && !validation.test(value)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    onChange(value)
  }, [onChange, validation])

  const debouncedOnChange = useDebounceCallback(handleChange, 300)

  return (
    <>
      {invalid && <p className="error-msg">{errMsg}</p>}
      <UIInput
        onKeyDown={handleKeyDown}
        {...restProps}
        value={value}
        onChange={event => debouncedOnChange(event.target.value)}
        style={{ fontFamily: REGEX_FONT_FAMILY }}
      />
      {/* <style jsx>
        {`
        .error-msg {
          margin: 0;
          color: ${palette.error};
        }
      `}
      </style> */}
    </>
  )
}

export default Input
