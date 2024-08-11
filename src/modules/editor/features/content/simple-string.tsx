import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import { RocketIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import Cell from '@/components/cell'
import type { AST } from '@/parser'
import { updateContentAtom } from '@/atom'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Props = {
  value: string
  quantifier: AST.Quantifier | null
}
const SimpleString: React.FC<Props> = ({ value, quantifier }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  const { toast } = useToast()

  const handleChange = (value: string) => {
    if (value.length > 1 && quantifier) {
      toast({ description: 'Group selection automatically' })
    }
    updateContent({
      kind: 'string',
      value,
    })
  }

  return (
    <Cell.Item label={t('Value')}>
      <div className="space-y-2">
        <Alert className="p-2">
          <RocketIcon className="h-4 w-4" />
          <AlertDescription className="!pl-9">
            {t('The input will be escaped automatically.')}
          </AlertDescription>
        </Alert>
        <Input value={value} onChange={handleChange} />
      </div>
    </Cell.Item>
  )
}

export default SimpleString
