import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import { z } from 'zod'
import { useLatest } from 'react-use'
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

const singleValueSchema = (z.literal(INFINITY).transform(() => Infinity)).or(z.coerce.number().int().nonnegative())
const emptyStartSchema = z.string().length(0).transform(() => 0)
const emptyEndSchema = z.string().length(0).transform(() => Infinity)
const rangeSchema = z.union([
  z.object({
    start: emptyStartSchema,
    end: emptyEndSchema,
  }),
  z.object({
    start: emptyStartSchema,
    end: singleValueSchema,
  }),
  z.object({
    start: singleValueSchema,
    end: emptyEndSchema,
  }),
  z.object({
    start: singleValueSchema,
    end: singleValueSchema,
  }),
]).refine(({ start, end }) => start !== Infinity || end !== Infinity, {
  message: 'Min cannot be Infinity',
}).refine(({ start, end }) => start <= end, {
  message: 'Numbers out of order in the quantifier',
}).transform(({ start, end }) => ({
  min: start,
  max: end,
})) as z.ZodType<{ min: number, max: number }, z.ZodTypeDef, Range>

const rangeTransformer = (quantifier: AST.Quantifier): Range => {
  return {
    start: `${quantifier.min}`,
    end: `${quantifier.max}`,
  }
}

interface Props {
  quantifier: AST.Quantifier | null
}

const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const { t } = useTranslation()
  const updateQuantifier = useSetAtom(updateQuantifierAtom)
  const [customRange, setCustomRange] = useState<Range | null>(null)
  const latestGreedy = useLatest<boolean>(quantifier?.greedy ?? true)

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
      default:
        break
    }
    if (['non', '*', '?', '+'].includes(value as string)) {
      updateQuantifier(nextQuantifier)
    } else {
      setCustomRange({
        start: '',
        end: '',
      })
    }
  }

  useEffect(() => {
    const result = rangeSchema.safeParse(customRange)
    if (result.success) {
      updateQuantifier({
        kind: 'custom',
        greedy: latestGreedy.current,
        ...result.data,
      })
    }
  }, [customRange, latestGreedy, updateQuantifier])

  const onCustomRangeChange = ({ min, max }: Partial<AST.Quantifier>) => {
    const greedy = quantifier?.greedy ?? false
    updateQuantifier({
      kind: 'custom',
      min: Number(min),
      max: Number(max),
      greedy,
    })
  }

  const onGreedyChange = (greedy: boolean) => {
    updateQuantifier({
      ...(quantifierRef.current as AST.Quantifier),
      greedy,
    })
  }
  return (
    <Cell label={t('Quantifier')} className="space-y-4">
      <Cell.Item label={t('times')}>
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
        {quantifier?.kind === 'custom' && (
          <Validation
            value={quantifier}
            transformer={rangeTransformer}
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
