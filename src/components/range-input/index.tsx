import React from 'react'
import { Trash as TrashIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import { Input } from '@/components/ui/input'
import { useFocus } from '@/utils/hooks/use-focus'
import { useHover } from '@/utils/hooks/use-hover'

interface Prop {
  className?: string
  start: string
  end: string
  startPlaceholder?: string
  endPlaceholder?: string
  removable?: boolean
  onChange: (start: string, end: string) => void
  onRemove?: () => void
}
export const RangeInput: React.FC<Prop> = ({
  className,
  start,
  end,
  startPlaceholder = '',
  endPlaceholder = '',
  removable = true,
  onChange,
  onRemove,
}) => {
  const { hovered, hoverProps } = useHover()
  const { focused, focusProps } = useFocus()
  const removeBtnVisible = hovered || focused

  return (
    <div {...hoverProps} {...focusProps} className={clsx('flex items-center', className)}>
      <div className="flex items-center space-x-2">
        <Input
          className="flex-1"
          value={start}
          placeholder={startPlaceholder}
          onChange={(value: string) => handleInputChange('start', value)}
        />
        <span>{' - '}</span>
        <Input
          className="flex-1"
          value={end}
          placeholder={endPlaceholder}
          onChange={(value: string) => handleInputChange('end', value)}
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
