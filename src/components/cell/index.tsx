import React from 'react'
import { Question as QuestionIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import type { MdnLinkKey } from '@/utils/links'
import mdnLinks from '@/utils/links'

interface ItemProps {
  label: string
  children: React.ReactNode
}
function CellItem({ label, children }: ItemProps) {
  return (
    <>
      <h6 className="text-secondary-foreground">{label}</h6>
      {children}
    </>
  )
}

interface Props {
  label: string
  mdnLinkKey?: MdnLinkKey
  rightLabel?: string
  children: React.ReactNode
  onRightLabelClick?: () => void
}
function Cell({
  label,
  mdnLinkKey,
  children,
  rightLabel,
  onRightLabelClick,
}: Props) {
  return (
    <div>
      <div className={clsx('flex items-center mb-2', { 'justify-between': rightLabel })}>
        <h5 className="font-semibold">{label}</h5>
        {mdnLinkKey && (
          <a href={mdnLinks[mdnLinkKey]} target="_blank" rel="noreferrer" className="ml-2">
            <QuestionIcon className="w-5 h-5" />
          </a>
        )}
        {rightLabel && (
          <span className="text-secondary-foreground cursor-pointer" onClick={onRightLabelClick}>
            {rightLabel}
          </span>
        )}
      </div>
      <div className="content">{children}</div>
    </div>
  )
}

Cell.Item = CellItem
export default Cell
