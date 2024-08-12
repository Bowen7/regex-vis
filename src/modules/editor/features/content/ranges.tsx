import React from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import { type Range, RangeInput } from '@/components/range-input'
import Cell from '@/components/cell'
import type { AST } from '@/parser'
import { updateContentAtom } from '@/atom'
import { ButtonDropdown, ButtonDropdownItem } from '@/components/button-dropdown'
import { Validation } from '@/components/validation'
import { Checkbox } from '@/components/ui/checkbox'

type Prop = {
  ranges: AST.Range[]
  negate: boolean
}

const commonUsedRanges = [
  { from: '0', to: '9', desc: '0 - 9' },
  { from: 'a', to: 'z', desc: 'a - z' },
  { from: 'A', to: 'Z', desc: 'A - Z' },
]

const unicodeRegex = /^(?:\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]{4}\}|\\u\{[0-9a-fA-F]{5}\})$/
const singleValueSchema = z.string().superRefine((input, ctx) => {
  if (input.length === 1 || unicodeRegex.test(input)) {
    return
  }
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    fatal: true,
    message: 'The range value must be a single character or unicode',
  })
})
const rangeRefine = ({ start, end }: Range) => {
  try {
    // TODO find a better way to validate the range
    // eslint-disable-next-line no-new
    new RegExp(`[${start}-${end}]`)
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (e) {
    return false
  }
  return true
}

export const rangeSchema: z.ZodType<AST.Range, z.ZodTypeDef, Range> = z.object({
  start: singleValueSchema,
  end: singleValueSchema,
}).refine(rangeRefine, { message: 'The range out of order in character class', path: ['start', 'end'] })
  .transform((value: Range) => ({
    from: value.start,
    to: value.end,
    id: '',
  }))

const Ranges: React.FC<Prop> = ({ ranges, negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)

  const onAdd = (range: Omit<AST.Range, 'id'>) => {
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: [...ranges, { ...range, id: nanoid() }],
      negate,
    }
    updateContent(payload)
  }

  const onRangeChange = (index: number, range: AST.Range) => {
    const { id, ...rangeWithoutId } = range
    const newRanges = [...ranges]
    const newRange = {
      ...newRanges[index],
      ...rangeWithoutId,
    }
    newRanges[index] = newRange
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: newRanges,
      negate,
    }
    updateContent(payload)
  }

  const onRemove = (index: number) => {
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate,
    }
    updateContent(payload)
  }

  const onNegateChange = (negate: boolean) => {
    updateContent({ kind: 'ranges', ranges, negate })
  }

  return (
    <Cell.Item label={t('Ranges')}>
      <div className="space-y-4">
        <div className="space-y-2.5">
          {ranges.map((range, index) => (
            <Validation
              key={range.id}
              defaultValue={{ start: range.from, end: range.to }}
              onChange={(range: AST.Range) => onRangeChange(index, range)}
              schema={rangeSchema}
            >
              {(value: Range, onChange: (value: Range) => void) => (
                <RangeInput
                  value={value}
                  onChange={onChange}
                  onRemove={() => onRemove(index)}
                />
              )}
            </Validation>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="font-normal"
            onClick={() => onAdd({ from: '', to: '' })}
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            {t('An Empty Range')}
          </Button>
          <ButtonDropdown>
            {commonUsedRanges.map(({ from, to, desc }) => (
              <ButtonDropdownItem
                onClick={() => onAdd({ from, to })}
                key={desc}
              >
                {desc}
              </ButtonDropdownItem>
            ))}
          </ButtonDropdown>
        </div>
        <div>
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <h6 className="text-foreground/60 font-semibold text-sm">{t('Negate')}</h6>
              <Checkbox checked={negate} onCheckedChange={onNegateChange} />
            </div>
          </label>
        </div>
      </div>
    </Cell.Item>
  )
}

export default Ranges
