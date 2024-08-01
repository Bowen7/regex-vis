import React from 'react'
import { Trash as TrashIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import { Input } from '@/components/ui/input'
import { useFocus } from '@/utils/hooks/use-focus'
import { useHover } from '@/utils/hooks/use-hover'

export interface Range {
  start: string
  end: string
}

interface Prop {
  className?: string
  value: Range
  startPlaceholder?: string
  endPlaceholder?: string
  removable?: boolean
  onChange: (value: Range) => void
  onRemove?: () => void
}
export const RangeInput: React.FC<Prop> = ({
  className,
  value,
  startPlaceholder = '',
  endPlaceholder = '',
  removable = true,
  onChange,
  onRemove,
}) => {
  const { hovered, hoverProps } = useHover()
  const { focused, focusProps } = useFocus()
  const removeBtnVisible = hovered || focused

  const onStartChange = (start: string) => {
    onChange({ start, end: value.end })
  }
  const onEndChange = (end: string) => {
    onChange({ start: value.start, end })
  }

  return (
    <div {...hoverProps} {...focusProps} className={clsx('flex items-center', className)}>
      <div className="flex items-center space-x-2">
        <Input
          className="flex-1"
          value={value.start}
          placeholder={startPlaceholder}
          onChange={onStartChange}
        />
        <span>{' - '}</span>
        <Input
          className="flex-1"
          value={value.end}
          placeholder={endPlaceholder}
          onChange={onEndChange}
        />
      </div>
      {removable && (
        <span className={clsx('p-2 cursor-pointer', {
          invisible: !removeBtnVisible,
        })}
        >
          <TrashIcon className="w-4 h-4" onClick={onRemove} />
        </span>
      )}
    </div>
  )
}
