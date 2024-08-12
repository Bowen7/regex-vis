import React, { useMemo } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import Cell from '@/components/cell'
import type { CharacterClassKey } from '@/parser'
import { characterClassTextMap } from '@/parser'
import { updateContentAtom } from '@/atom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Validation } from '@/components/validation'

const classOptions: { value: CharacterClassKey, text: string }[] = []
for (const key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

const xhhSchema = z.string().regex(/^\\x[0-9a-fA-F]{2}$/)
const uhhhhSchema = z.string().regex(/^\\u[0-9a-fA-F]{4}$/)

type Props = {
  value: string
}
const ClassCharacter: React.FC<Props> = ({ value }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)

  const classKind = useMemo(() => {
    if (xhhSchema.safeParse(value).success) {
      return '\\xhh'
    } else if (uhhhhSchema.safeParse(value).success) {
      return '\\uhhhh'
    }
    return value
  }, [value])

  const handleSelectChange = (value: string) => {
    value = value as string
    if (value === '\\xhh') {
      value = '\\x00'
    } else if (value === '\\uhhhh') {
      value = '\\u0000'
    }
    updateContent({
      kind: 'class',
      value,
    })
  }

  const onInputChange = (value: string) =>
    updateContent({
      kind: 'class',
      value,
    })

  return (
    <Cell.Item label={t('Class')}>
      <div className="space-y-2">
        <Select
          value={classKind}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder={t('Choose one')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {classOptions.map(({ value, text }) => (
                <SelectItem value={value} key={value}>
                  <span className="text-teal-400 font-mono text-sm mr-2">{value}</span>
                  <span>{t(text)}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {classKind === '\\xhh' && (
          <Validation defaultValue={value} onChange={onInputChange} schema={xhhSchema}>
            {(value: string, onChange: (value: string) => void) => (
              <Input
                className="w-52 font-mono"
                value={value}
                onChange={onChange}
              />
            )}
          </Validation>
        )}
        {classKind === '\\uhhhh' && (
          <Validation defaultValue={value} onChange={onInputChange} schema={uhhhhSchema}>
            {(value: string, onChange: (value: string) => void) => (
              <Input
                className="w-52 font-mono"
                value={value}
                onChange={onChange}
              />
            )}
          </Validation>
        )}
      </div>
    </Cell.Item>
  )
}

export default ClassCharacter
