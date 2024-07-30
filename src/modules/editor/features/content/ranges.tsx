import React from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { RangeInput } from '@/components/range-input'
import Cell from '@/components/cell'
import type { AST } from '@/parser'
import { updateContentAtom } from '@/atom'
import { ButtonDropdown, ButtonDropdownItem } from '@/components/button-dropdown'

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

  const handleRangeChange = (index: number, range: AST.Range) => {
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
            <RangeInput
              start={range.from}
              end={range.to}
              key={index}
              onChange={(range: AST.Range) => handleRangeChange(index, range)}
              onRemove={() => handleRemove(index)}
            />
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
