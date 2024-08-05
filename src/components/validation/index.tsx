import { memo, useCallback, useState } from 'react'
import type { ZodIssue, ZodType, z } from 'zod'

export type Transformer<I, O> = (value: I) => O

interface Props<I, O> {
  className?: (errors: ZodIssue[]) => string
  transformer: Transformer<I, O>
  errorFormatter: (errors: ZodIssue[]) => string
  children: (value: O, onChange: (value: O) => void) => React.ReactNode
  value: I
  onChange: (value: I) => void
  schema: ZodType<I, z.ZodTypeDef, O>
}

function InnerValidation<I, O>(props: Props<I, O>) {
  const {
    className,
    transformer,
    children,
    value,
    onChange,
    schema,
    errorFormatter,
  } = props
  const [innerValue, setInnerValue] = useState(() => transformer(value))
  const [errors, setErrors] = useState<ZodIssue[]>([])

  const onValueChange = useCallback((value: O) => {
    setInnerValue(value)
    const result = schema.safeParse(value)
    setErrors(result.error?.errors ?? [])
    if (result.success) {
      onChange(result.data)
    }
  }, [setInnerValue, onChange, schema])

  return (
    <div className={className ? className(errors) : ''}>
      {children(innerValue as O, onValueChange)}
      {errors.length > 0 ? <div className="text-red-500 text-xs">{errorFormatter(errors)}</div> : null }
    </div>
  )
}

export const Validation = memo(InnerValidation) as typeof InnerValidation
