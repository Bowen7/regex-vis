import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import { SelectionSlash } from '@phosphor-icons/react'
import Cell from '@/components/cell'
import { updateLookAroundAtom } from '@/atom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  kind: 'lookahead' | 'lookbehind'
  negate: boolean
}
const LookAround: React.FC<Props> = ({ kind, negate }) => {
  const { t } = useTranslation()
  const updateLookAround = useSetAtom(updateLookAroundAtom)
  const onKindChange = (value: string) =>
    updateLookAround({
      kind: value as 'lookahead' | 'lookbehind',
      negate,
    })
  const onNegateChange = (negate: boolean) => {
    updateLookAround({
      kind,
      negate,
    })
  }
  const unLookAround = () => updateLookAround(null)

  return (
    <Cell
      label={t('Lookaround assertion')}
      rightIcon={(
        <SelectionSlash className="w-4 h-4" />
      )}
      rightTooltip={t('Cancel assertion')}
      onRightIconClick={unLookAround}
    >
      <div className="space-y-4">
        <Select
          value={kind}
          onValueChange={onKindChange}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder={t('Choose one')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lookahead">
                {t('Lookahead assertion')}
              </SelectItem>
              <SelectItem value="lookbehind">
                {t('Lookbehind assertion')}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
    </Cell>
  )
}

export default LookAround
