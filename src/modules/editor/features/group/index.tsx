import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import { SelectionSlash } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import type { AST } from '@/parser'
import Cell from '@/components/cell'
import { updateGroupAtom } from '@/atom'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type GroupSelectProps = {
  group: AST.Group
}
export const groupOptions = [
  {
    value: 'capturing',
    label: 'Capturing group',
  },
  {
    value: 'nonCapturing',
    label: 'Non-capturing group',
  },
  {
    value: 'namedCapturing',
    label: 'Named capturing group',
  },
]

function GroupSelect({ group }: GroupSelectProps) {
  const { t } = useTranslation()
  const updateGroup = useSetAtom(updateGroupAtom)
  const { kind } = group

  const handleGroupChange = (kind: AST.GroupKind, name = '') => {
    let payload: AST.Group
    switch (kind) {
      case 'capturing':
        payload = { kind, name: '', index: 0 }
        break
      case 'namedCapturing':
        if (!name) {
          name = 'name'
        }
        payload = { kind, name, index: 0 }
        break
      case 'nonCapturing':
        payload = { kind: 'nonCapturing' }
        break
    }
    updateGroup(payload)
  }

  const handleGroupNameChange = (value: string) =>
    handleGroupChange(kind, value)

  const onSelectChange = (value: string) =>
    handleGroupChange(value as AST.GroupKind)

  const unGroup = () => updateGroup(null)

  return (
    <Cell
      label={t('Group')}
      rightIcon={(
        <SelectionSlash className="w-4 h-4" />
      )}
      rightTooltip={t('UnGroup')}
      onRightIconClick={unGroup}
      className="space-y-2"
    >
      <Select value={kind} onValueChange={onSelectChange}>
        <SelectTrigger className="px-2 w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {groupOptions.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                <span>{t(label)}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {group.kind === 'namedCapturing' && (
        <div className="flex items-center">
          <span className="rounded-l-md border h-9 border-r-0 leading-9 px-2 text-xs bg-muted">{t('Group\'s name')}</span>
          <Input
            className="flex-1 rounded-l-none"
            value={group.name}
            onChange={handleGroupNameChange}
          />
        </div>
      )}
    </Cell>
  )
}

export default GroupSelect
