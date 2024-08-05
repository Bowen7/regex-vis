import React from 'react'
import { Question as QuestionIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import type { MdnLinkKey } from '@/utils/links'
import mdnLinks from '@/utils/links'
import { Button } from '@/components/ui/button'

interface ItemProps {
  label: string
  children: React.ReactNode
}
function CellItem({ label, children }: ItemProps) {
  return (
    <div>
      <h6 className="text-foreground/60 font-semibold mb-2 text-sm">{label}</h6>
      {children}
    </div>
  )
}

interface Props {
  className?: string
  label: string
  mdnLinkKey?: MdnLinkKey
  rightLabel?: string
  children: React.ReactNode
  onRightLabelClick?: () => void
}
function Cell({
  className,
  label,
  mdnLinkKey,
  children,
  rightLabel,
  onRightLabelClick,
}: Props) {
  return (
    <div>
      <div className={clsx('flex items-center mb-2.5', { 'justify-between': rightLabel })}>
        <h5 className="font-semibold">{label}</h5>
        {mdnLinkKey && (
          <a href={mdnLinks[mdnLinkKey]} target="_blank" rel="noreferrer" className="ml-2">
            <QuestionIcon className="w-4 h-4" />
          </a>
        )}
        {rightLabel && (
          <Button onClick={onRightLabelClick} variant="outline" size="sm" className="px-2 h-7">
            {rightLabel}
          </Button>
        )}
      </div>
      <div className={className}>{children}</div>
    </div>
  )
}

Cell.Item = CellItem
export default Cell
