import { useMemo } from 'react'
import { Check as CheckIcon, Trash as TrashIcon, X as XIcon } from '@phosphor-icons/react'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  value: string
  regExp: RegExp
  onChange: (value: string) => void
  onRemove: () => void
}

function TestItem({ value, regExp, onChange, onRemove }: Props) {
  const isPass = useMemo(() => regExp.test(value), [value, regExp])

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="focus-within:outline-none focus-within:ring-1 focus-within:ring-ring rounded-md">
      <Textarea
        defaultValue={value}
        onChange={onChange}
        className="rounded-b-none"
        onKeyDown={onKeyDown}
      />
      <div className="border border-t-0 rounded-b-md flex justify-between items-center pl-4 bg-muted">
        {isPass ? <CheckIcon className="h-4 w-4 fill-green-700 dark:fill-green-500" /> : <XIcon className="h-4 w-4 fill-red-700 dark:fill-red-500" />}
        <TrashIcon className="h-4 w-4 p-2 box-content cursor-pointer fill-foreground/80" onClick={onRemove} />
      </div>
    </div>
  )
}

export default TestItem
