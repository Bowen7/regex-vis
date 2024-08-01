import React from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { type Range, RangeInput } from '@/components/range-input'
import Cell from '@/components/cell'
import type { AST } from '@/parser'
import { updateContentAtom } from '@/atom'
import { ButtonDropdown, ButtonDropdownItem } from '@/components/button-dropdown'
import { type Transformer, Validation, type ValidatorResult } from '@/components/validation'

interface Prop {
  ranges: AST.Range[]
  negate: boolean
}

const commonUsedRanges = [
  // { from: '', to: '', desc: 'An Empty Range' },
  { from: '0', to: '9', desc: '0 - 9' },
  { from: 'a', to: 'z', desc: 'a - z' },
  { from: 'A', to: 'Z', desc: 'A - Z' },
]

const rangeTransformers: [Transformer<AST.Range, Range>, Transformer<Range, AST.Range>] = [(range: AST.Range): Range => {
  return {
    start: range.from,
    end: range.to,
  }
}, (range: Range): AST.Range => {
  return {
    from: range.start,
    to: range.end,
  }
}]

function rangeValidator(range: Range): ValidatorResult {
  let { start, end } = range
  start = start.trim()
  end = end.trim()
  if (!start && !end) {
    return {
      ok: true,
    }
  }
  if (!start) {
    return {
      ok: false,
      error: {
        type: 'start',
        message: '',
      },
    }
  }
  if (!end) {
    return {
      ok: false,
      error: {
        type: 'end',
        message: '',
      },
    }
  }
  try {
    // TODO find a better way to validate the range
    // eslint-disable-next-line no-new
    new RegExp(`[${start}-${end}]`)
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (e) {
    return {
      ok: false,
      error: {
        type: 'order',
        message: 'The range out of order in character class',
      },
    }
  }
  return {
    ok: true,
  }
}

function rangeClassName(result: ValidatorResult) {
  if (result.ok) {
    return ''
  }
  const { error } = result
  if (error.type === 'start') {
    return '[&_:is(input):first-child]:border-red-500'
  } else if (error.type === 'end') {
    return '[&_:is(input):last-child]:border-red-500'
  } else {
    return '[&>input]:text-red-500'
  }
}

const Ranges: React.FC<Prop> = ({ ranges, negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  // const { palette } = useTheme()

  const handleAdd = (newRanges: AST.Range[]) => {
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: ranges.concat(newRanges),
      negate,
    }
    updateContent(payload)
  }

  const onRangeChange = (index: number, range: AST.Range) => {
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: ranges.map((_range, _index) => {
        if (_index === index) {
          return range
        }
        return _range
      }),
      negate,
    }
    updateContent(payload)
  }

  const handleRemove = (index: number) => {
    const payload: AST.RangesCharacter = {
      kind: 'ranges',
      ranges: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate,
    }
    updateContent(payload)
  }

  // const onGreedyChange = (e: CheckboxEvent) => {
  //   const negate = e.target.checked
  //   updateContent({ kind: 'ranges', ranges, negate })
  // }

  return (
    <Cell.Item label={t('Ranges')}>
      <div className="space-y-4">
        <div className="space-y-2">
          {ranges.map((range, index) => (
            // eslint-disable-next-line react/no-missing-key
            <Validation
              className={rangeClassName}
              value={range}
              transformers={rangeTransformers}
              onChange={(range: AST.Range) => onRangeChange(index, range)}
              validator={rangeValidator}
            >
              {(value: Range, onChange: (value: Range) => void) => (
                <RangeInput
                  value={value}
                  onChange={onChange}
                  onRemove={() => handleRemove(index)}
                />
              )}

            </Validation>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="font-normal">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            An Empty Range
          </Button>
          <ButtonDropdown>
            {commonUsedRanges.map(({ from, to, desc }, index) => (
              <ButtonDropdownItem
                onClick={() => handleAdd([{ from, to }])}
                key={index}
              >
                {desc}
              </ButtonDropdownItem>
            ))}
          </ButtonDropdown>
        </div>
        {/* <Spacer h={0.5} />
      <ButtonDropdown scale={0.75}>
        {commonUsedRanges.map(({ from, to, desc }, index) => (
          <ButtonDropdown.Item
            main={index === 0}
            onClick={() => handleAdd([{ from, to }])}
            key={index}
          >
            {desc}
          </ButtonDropdown.Item>
        ))}
      </ButtonDropdown> */}
        <Cell.Item label="Negate">
          {/* <Checkbox checked={negate} onChange={onGreedyChange}>
          {t('negate')}
        </Checkbox> */}
          <></>
        </Cell.Item>
        {/* <style jsx>
        {`
        h6 {
          color: ${palette.secondary};
        }

        .range-options > :global(.range-wrapper:not(:first-child)) {
          margin-top: 12px;
        }
      `}
      </style> */}
      </div>
    </Cell.Item>
  )
}

export default Ranges
