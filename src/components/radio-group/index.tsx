import React from "react"
import { Radio } from "@geist-ui/react"
type Option = {
  value: string
  label: string
}
type Prop = {
  value: string
  options: Option[]
  onChange: (value: string) => void
}
const RadioGroup: React.FC<Prop> = ({ value, options, onChange }) => {
  return (
    <>
      <Radio.Group
        value={value}
        useRow
        size="mini"
        onChange={(value: string | number) => onChange(value as string)}
      >
        {options.map(({ value, label }) => (
          <Radio value={value} key={value}>
            {label}
          </Radio>
        ))}
      </Radio.Group>
      <style jsx global>{`
        .radio-group .name {
          font-weight: normal;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

export default RadioGroup
