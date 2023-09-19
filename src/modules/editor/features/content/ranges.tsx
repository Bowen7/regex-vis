import React from "react"
import { useTheme, ButtonDropdown, Spacer, Checkbox } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useSetAtom } from "jotai"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import { updateContentAtom } from "@/atom"

type Prop = {
  ranges: AST.Range[]
  negate: boolean
}

const commonUsedRanges = [
  { from: "", to: "", desc: "A Empty Range" },
  { from: "0", to: "9", desc: "0 - 9" },
  { from: "a", to: "z", desc: "a - z" },
  { from: "A", to: "Z", desc: "A - Z" },
]

const Ranges: React.FC<Prop> = ({ ranges, negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  const { palette } = useTheme()

  const handleAdd = (newRanges: AST.Range[]) => {
    const payload: AST.RangesCharacter = {
      kind: "ranges",
      ranges: ranges.concat(newRanges),
      negate,
    }
    updateContent(payload)
  }

  const handleRangeChange = (index: number, range: AST.Range) => {
    const payload: AST.RangesCharacter = {
      kind: "ranges",
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
      kind: "ranges",
      ranges: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate,
    }
    updateContent(payload)
  }

  const handleGreedyChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    updateContent({ kind: "ranges", ranges, negate })
  }

  return (
    <Cell.Item label={t("Ranges")}>
      <div className="range-options">
        {ranges.map((range, index) => (
          <RangeOption
            range={range}
            key={index}
            onChange={(range: AST.Range) => handleRangeChange(index, range)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
      <Spacer h={0.5} />
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
      </ButtonDropdown>
      <Cell.Item label="Negate">
        <Checkbox checked={negate} onChange={handleGreedyChange}>
          {t("negate")}
        </Checkbox>
      </Cell.Item>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }

        .range-options > :global(.range-wrapper:not(:first-child)) {
          margin-top: 12px;
        }
      `}</style>
    </Cell.Item>
  )
}

export default Ranges
