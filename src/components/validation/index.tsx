import { createContext, memo, useCallback, useMemo, useState } from 'react'
import type { ZodIssue, ZodType, z } from 'zod'
import { useTranslation } from 'react-i18next'

export const ValidationContext = createContext<(string | number)[]>([])

type Props<T, O> = {
  className?: string
  children: (value: T, onChange: (value: T) => void) => React.ReactNode
  defaultValue: T
  onChange: (value: O) => void
  schema: ZodType<O, z.ZodTypeDef, T>
}

function InnerValidation<T, O>(props: Props<T, O>) {
  const {
    className,
    children,
    defaultValue,
    onChange,
    schema,
  } = props
  const [innerValue, setInnerValue] = useState(() => defaultValue)
  const [errors, setErrors] = useState<ZodIssue[]>([])
  const { t } = useTranslation()

  const onValueChange = useCallback((value: T) => {
    setInnerValue(value)
    const result = schema.safeParse(value)
    setErrors(result.error?.errors ?? [])
    if (result.success) {
      onChange(result.data)
    }
  }, [setInnerValue, onChange, schema])

  const message = useMemo(() => errors.length > 0 ? errors[0].message : '', [errors])

  const errorPaths = useMemo(() => {
    const paths: (string | number)[] = []
    errors.forEach((error) => {
      if (error.path.length === 0) {
        paths.push('')
      } else {
        paths.push(...error.path)
      }
    })
    return paths
  }, [errors])

  return (
    <ValidationContext.Provider value={errorPaths}>
      <div className={className}>
        {children(innerValue, onValueChange)}
        {message && <div className="text-red-500 text-xs">{t(message)}</div>}
      </div>
    </ValidationContext.Provider>
  )
}

export const Validation = memo(InnerValidation) as typeof InnerValidation
