import { useMemo } from 'react'
import { CrossCircledIcon } from '@radix-ui/react-icons'
import { useDebounceInput, useFocus } from '@/utils/hooks'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  value: string
  regExp: RegExp
  onChange: (value: string) => void
  onRemove: () => void
}

function DebouncedTextarea({
  value,
  onChange,
  ...restProps
}: Omit<React.ComponentProps<typeof Textarea>, 'onChange'> & {
  onChange: (value: string) => void
}) {
  const debouncedBindings = useDebounceInput(value as string, onChange)
  return <Textarea {...restProps} {...debouncedBindings} />
}

function TestItem({ value, regExp, onChange, onRemove }: Props) {
  // const { palette } = useTheme()
  const { focused, bindings } = useFocus()
  // const isError = useMemo(() => !regExp.test(value), [value, regExp])
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }
  return (
    <>
      <div className="test-item">
        <div className="case-input">
          <DebouncedTextarea
            value={value}
            // width="225px"
            onKeyDown={handleKeyDown}
            onChange={onChange}
            {...bindings}
          />
          {/* {focused && (
            <CrossCircledIcon
              cursor="pointer"
              size={20}
              onClick={onRemove}
              onMouseDown={handleMouseDown}
            />
          )} */}
        </div>
        <div className="status" />
      </div>
      {/* <style jsx>{`
        .test-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .case-input {
          position: relative;
        }
        .case-input :global(textarea) {
          min-height: auto;
          resize: vertical;
        }
        .case-input :global(svg) {
          position: absolute;
          top: -10px;
          right: -20px;
        }
        .status {
          width: 10px;
          height: 10px;
          background-color: ${isError ? palette.error : palette.cyan};
          border-radius: 100%;
        }
      `}</style> */}
    </>
  )
}

export default TestItem
