import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link2Icon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CheckboxGroup, CheckboxItem } from '@/components/ui/checkbox-group'

interface Props {
  regex: string
  flags: string[]
  literal: boolean
  onChange: (regex: string) => void
  onFlagsChange: (flags: string[]) => void
  onCopy: () => void
  className?: string
}

const FLAGS = [{
  value: 'g',
  label: 'Global search',
}, {
  value: 'i',
  label: 'Case-insensitive',
}, {
  value: 'm',
  label: 'Multi-line',
}, {
  value: 's',
  label: 'Allows . to match newline',
}]

const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  literal,
  onChange,
  onFlagsChange,
  onCopy,
  className,
}) => {
  const { t } = useTranslation()
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  const flagStr = flags.join('')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }
  return (
    <div className={clsx('px-4 py-8 flex justify-center', className)}>
      <div className="max-w-4xl flex-1 flex flex-col items-center gap-4">
        <div className="flex w-full justify-center">
          <Input
            data-testid="regex-input"
            value={regex === null ? '' : regex}
            placeholder={t('Input a regular expression')}
            // labelRight={literal ? '' : flagStr}
            className="flex-1 font-mono rounded-r-none"
            onChange={onChange}
            onKeyDown={handleKeyDown}
          />
          <span className="h-9 inline-flex items-center px-2 border border-l-0 rounded-r-md text-sm">{flagStr}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onCopy}
                >
                  <Link2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('Copy permalink')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {regex !== '' && (
          <div className="flex items-center gap-3">
            <label className="mr-2">{t('Flags: ')}</label>
            <CheckboxGroup
              value={flags}
              onChange={handleFlagsChange}
            >
              {FLAGS.map(({ value, label }) => {
                return (
                  <label
                    key={value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-1">
                      <CheckboxItem value={value} />
                      {label}
                    </div>
                  </label>
                )
              })}
            </CheckboxGroup>
          </div>
        )}
      </div>
    </div>
  )
}
export default RegexInput
