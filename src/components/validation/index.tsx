import { memo, useCallback, useState } from 'react'
import type { ZodIssue, ZodType, z } from 'zod'
import { useTranslation } from 'react-i18next'

export type Transformer<I, O> = (value: I) => O

interface Props<I, O> {
  className?: (errors: ZodIssue[]) => string
  transformer?: Transformer<I, O>
  errorFormatter?: (errors: ZodIssue[]) => string
  children: (value: O, onChange: (value: O) => void) => React.ReactNode
  value: I
  onChange: (value: Partial<I>) => void
  schema: ZodType<Partial<I>, z.ZodTypeDef, O>
}

const defaultTransformer = <T,>(value: T): T => value

const defaultErrorFormatter = () => {
  return 'Invalid input'
}

const defaultClassName = (errors: ZodIssue[]) => {
  if (errors.length === 0) {
    return ''
  }
  return '[&_:is(input)]:!ring-transparent [&_:is(input)]:!border-red-500'
}

function InnerValidation<I, O>(props: Props<I, O>) {
  const {
    className = defaultClassName,
    transformer = defaultTransformer,
    errorFormatter = defaultErrorFormatter,
    children,
    value,
    onChange,
    schema,
  } = props
  const [innerValue, setInnerValue] = useState(() => transformer(value))
  const [errors, setErrors] = useState<ZodIssue[]>([])
  const { t } = useTranslation()

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
      {errors.length > 0 ? <div className="text-red-500 text-xs">{t(errorFormatter(errors))}</div> : null }
    </div>
  )
}

export const Validation = memo(InnerValidation) as typeof InnerValidation
