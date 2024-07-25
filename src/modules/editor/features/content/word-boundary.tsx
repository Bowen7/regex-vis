import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import Cell from '@/components/cell'
import { updateContentAtom } from '@/atom'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  negate: boolean
}
const WordBoundary: React.FC<Props> = ({ negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  const onCheckedChange = (negate: boolean) => {
    updateContent({
      kind: 'wordBoundaryAssertion',
      negate,
    })
  }

  return (
    <Cell.Item label={t('Negate')}>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Checkbox checked={negate} onCheckedChange={onCheckedChange} />
          <span>{t('negate')}</span>
        </div>
      </label>
    </Cell.Item>
  )
}

export default WordBoundary
