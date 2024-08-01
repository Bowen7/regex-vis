import { memo, useCallback, useState } from 'react'

export type ValidatorResult = {
  ok: true
} | {
  ok: false
  error: { type: string, message: string }
}

export type Transformer<I, O> = (value: I) => O

const defaultTransformers = [(value: any) => value, (value: any) => value]

interface Props<I, O = I> {
  className?: (result: ValidatorResult) => string
  children: (value: O, onChange: (value: O) => void) => React.ReactNode
  value: I
  onChange: (value: I) => void
  transformers?: [(value: I) => O, (value: O) => I]
  validator: (value: O) => ValidatorResult
}

function InnerValidation<I, O>(props: Props<I, O>) {
  const {
    className,
    children,
    value,
    onChange,
    validator,
    transformers = defaultTransformers,
  } = props
  const [innerValue, setInnerValue] = useState(() => transformers[0](value))
  const [result, setResult] = useState<ValidatorResult>({ ok: true })

  const onValueChange = useCallback((value: O) => {
    setInnerValue(value)
    const result = validator(value)
    setResult(result)
    if (result.ok) {
      onChange(transformers[1](value))
    } else {
      console.error(result.error)
    }
  }, [setInnerValue, onChange, validator, transformers])

  return (
    <div className={className ? className(result) : ''}>
      {children(innerValue as O, onValueChange)}
      {result.ok ? null : <div className="text-red-500 text-xs">{result.error.message}</div>}
    </div>
  )
}

export const Validation = memo(InnerValidation) as typeof InnerValidation
