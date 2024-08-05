import React, { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import Cell from '@/components/cell'
import { groupNamesAtom, updateContentAtom } from '@/atom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  reference: string
}
const BackRef: React.FC<Props> = ({ reference }) => {
  const { t } = useTranslation()
  const groupNames = useAtomValue(groupNamesAtom)
  const updateContent = useSetAtom(updateContentAtom)

  const options = useMemo(() => {
    if (groupNames.includes(reference)) {
      return groupNames
    }
    return [reference, ...groupNames]
  }, [groupNames, reference])

  const onChange = (value: string | string[]) =>
    updateContent({ kind: 'backReference', ref: value as string })

  return (
    <Cell.Item label={t('Back Reference')}>
      <Select
        value={reference}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder={t('Choose one')} className="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(option => (
              <SelectItem value={option} key={option}>
                {t('Group')}
                {' '}
                #
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Cell.Item>
  )
}

export default BackRef
