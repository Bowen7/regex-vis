import React from 'react'
import { Question as QuestionIcon } from '@phosphor-icons/react'
import clsx from 'clsx'
import type { MdnLinkKey } from '@/utils/links'
import mdnLinks from '@/utils/links'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type ItemProps = {
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

type Props = {
  className?: string
  label: string
  mdnLinkKey?: MdnLinkKey
  rightIcon?: React.ReactNode
  rightTooltip?: string
  onRightIconClick?: () => void
  children: React.ReactNode
}
function Cell({
  className,
  label,
  mdnLinkKey,
  children,
  rightIcon,
  rightTooltip,
  onRightIconClick,
}: Props) {
  return (
    <div>
      <div className={clsx('flex items-center mb-2.5', { 'justify-between': !!rightIcon })}>
        <h5 className="font-semibold">{label}</h5>
        {mdnLinkKey && (
          <a href={mdnLinks[mdnLinkKey]} target="_blank" rel="noreferrer" className="ml-2">
            <QuestionIcon className="w-4 h-4" />
          </a>
        )}
        {rightIcon && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onRightIconClick} variant="outline" size="icon" className="px-2 h-7">
                  {rightIcon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{rightTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className={className}>{children}</div>
    </div>
  )
}

Cell.Item = CellItem
export default Cell
