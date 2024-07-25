import React from 'react'
import { useTranslation } from 'react-i18next'
import Cell from '@/components/cell'

interface Prop {
  regex: string
  startIndex: number
  endIndex: number
}
const Expression: React.FC<Prop> = ({ regex, startIndex, endIndex }) => {
  const { t } = useTranslation()
  return (
    <Cell label={t('Expression')}>
      <p className="font-mono text-sm">
        <span>{regex.slice(0, startIndex)}</span>
        <span className="bg-blue-500/50 rounded py-1">{regex.slice(startIndex, endIndex)}</span>
        <span>{regex.slice(endIndex)}</span>
      </p>
    </Cell>
  )
}

export default Expression
