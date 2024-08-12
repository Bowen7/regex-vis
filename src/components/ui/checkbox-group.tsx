import type { ComponentProps, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { Checkbox } from './checkbox'

const CheckboxGroupContext = createContext<{
  value: string[]
  onChange: (value: string, checked: boolean) => void
}>({
      value: [],
      onChange: () => {},
    })

type GroupProps = {
  value: string[]
  onChange: (value: string[]) => void
  children: ReactNode
}

export function CheckboxGroup(props: GroupProps) {
  const { value, onChange, children } = props

  const onItemChange = useCallback((itemValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, itemValue])
    } else {
      const index = value.indexOf(itemValue)
      if (index > -1) {
        const nextValue = [...value]
        nextValue.splice(index, 1)
        onChange(nextValue)
      }
    }
  }, [value, onChange])

  const provideValue = useMemo(() => ({ value, onChange: onItemChange }), [value, onItemChange])
  return (
    <CheckboxGroupContext.Provider value={provideValue}>
      {children}
    </CheckboxGroupContext.Provider>
  )
}

type ItemProps = {
  value: string
} & Omit<ComponentProps<typeof Checkbox>, 'value'>
export function CheckboxItem(props: ItemProps) {
  const { value: itemValue, ...rest } = props
  const { value, onChange } = useContext(CheckboxGroupContext)

  const checked = value.includes(itemValue)
  const onCheckedChange = (checked: boolean) => onChange(itemValue, checked)
  return <Checkbox checked={checked} onCheckedChange={onCheckedChange} {...rest}></Checkbox>
}
