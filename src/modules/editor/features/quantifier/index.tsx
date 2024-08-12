import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import { z } from 'zod'
import Cell from '@/components/cell'
import { type Range, RangeInput } from '@/components/range-input'
import type { AST } from '@/parser'
import { updateQuantifierAtom } from '@/atom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Validation } from '@/components/validation'

const QUANTIFIER_OPTIONS = [
  { value: 'non', label: '1 (default)', code: '' },
  { value: '?', label: '0 or 1', code: '?' },
  { value: '*', label: '0 or more', code: '*' },
  { value: '+', label: '1 or more', code: '+' },
  {
    value: 'custom',
    label: 'custom',
    code: '{min,max}',
  },
]

const INFINITY = 'Infinity'
const INVALID_VALUE = 'Invalid quantifier value'
const startRegex = /^[1-9]\d*$|^$/
const endRegex = /^[1-9]\d*$|^$|^Infinity$/
const startSchema = z.string()
  .superRefine((input, ctx) => {
    if (startRegex.test(input)) {
      return
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      fatal: true,
      message: INVALID_VALUE,
    })
  })
  .transform(text => text ? Number(text) : 0)
const endSchema = z.string()
  .superRefine((input, ctx) => {
    if (endRegex.test(input)) {
      return
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      fatal: true,
      message: INVALID_VALUE,
    })
  })
  .transform(text => (text === '' || text === INFINITY) ? Infinity : Number(text))

const rangeSchema = z.object({
  start: startSchema,
  end: endSchema,
})
  .refine(({ start, end }) => start <= end, {
    message: 'Numbers out of order in the quantifier',
    path: ['start', 'end'],
  }).transform(({ start, end }) => ({
    min: start,
    max: end,
  })) as z.ZodType<{ min: number, max: number }, z.ZodTypeDef, Range>

type Props = {
  quantifier: AST.Quantifier | null
}

const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const { t } = useTranslation()
  const updateQuantifier = useSetAtom(updateQuantifierAtom)
  const [customRange, setCustomRange] = useState<Range | null>(() => quantifier
    ? ({
        start: quantifier.min.toString(),
        end: quantifier.max.toString(),
      })
    : null)

  const kind = quantifier?.kind ?? 'non'

  const onKindChange = (value: string) => {
    const greedy = quantifier?.greedy || true
    let nextQuantifier: AST.Quantifier | null = null
    switch (value) {
      case '?':
        nextQuantifier = { kind: '?', min: 0, max: 1, greedy }
        break
      case '*':
        nextQuantifier = { kind: '*', min: 0, max: Infinity, greedy }
        break
      case '+':
        nextQuantifier = { kind: '+', min: 1, max: Infinity, greedy }
        break
      case 'custom': {
        const min = quantifier?.min ?? 1
        const max = quantifier?.max ?? 1
        nextQuantifier = { kind: 'custom', min, max, greedy }
        setCustomRange({
          start: min.toString(),
          end: max.toString(),
        })
        break
      }
      default:
        break
    }
    if (value !== 'custom') {
      setCustomRange(null)
    }
    updateQuantifier(nextQuantifier)
  }

  const onCustomRangeChange = ({ min, max }: { min: number, max: number }) => {
    const greedy = quantifier?.greedy ?? true
    updateQuantifier({
      kind: 'custom',
      min: Number(min),
      max: Number(max),
      greedy,
    })
  }

  const onGreedyChange = (greedy: boolean) => {
    if (!quantifier) {
      return
    }
    updateQuantifier({
      ...(quantifier),
      greedy,
    })
  }

  return (
    <Cell label={t('Quantifier')} className="space-y-4">
      <Cell.Item label={t('times')}>
        <div className="space-y-2">
          <Select
            value={kind}
            onValueChange={onKindChange}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder={t('Choose one')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {QUANTIFIER_OPTIONS.map(({ value, label, code }) => (
                  <SelectItem value={value} key={value}>
                    {code && <span className="text-teal-400 font-mono text-sm mr-2">{code}</span>}
                    <span>{t(label)}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {customRange && (
            <Validation
              defaultValue={customRange}
              schema={rangeSchema}
              onChange={onCustomRangeChange}
            >
              {(value: Range, onChange: (value: Range) => void) => (
                <RangeInput
                  value={value}
                  startPlaceholder="0"
                  endPlaceholder={INFINITY}
                  onChange={onChange}
                />
              )}
            </Validation>
          )}
        </div>
      </Cell.Item>
      {quantifier && (
        <div>
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <h6 className="text-foreground/60 font-semibold text-sm">{t('Greedy')}</h6>
              <Checkbox checked={quantifier?.greedy ?? true} onCheckedChange={onGreedyChange} />
            </div>
          </label>
        </div>
      )}
    </Cell>
  )
}

export default QuantifierItem
