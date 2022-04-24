import React, { useEffect, useState } from "react"
import { Button, Spacer, Textarea } from "@geist-ui/react"
import XCircle from "@geist-ui/react-icons/xCircle"
import { useLocalStorage } from "react-use"
import produce from "immer"
import { gen } from "@/parser"
import { astAtom, useAtomValue } from "@/atom"
import { withDebounce } from "@/utils/hocs"
const DebouncedTextarea = withDebounce<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(Textarea)

const TestTab: React.FC<{}> = () => {
  const [cases, setCases] = useLocalStorage<string[]>("test-case", [""])
  const ast = useAtomValue(astAtom)
  const [regExp, setRegExp] = useState<RegExp>(() => {
    const regex = gen(ast, false)
    return new RegExp(regex, ast.flags.join(""))
  })

  useEffect(() => {
    if (cases!.length === 0) {
      setCases([""])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases])

  useEffect(() => {
    const regex = gen(ast, false)
    const regExp = new RegExp(regex, ast.flags.join(""))
    setRegExp(regExp)
  }, [ast])

  const handleInputChange = (value: string, index: number) => {
    setCases(
      produce(cases!, (draft) => {
        draft[index] = value
      })
    )
  }
  const handleRemove = (index: number) => {
    setCases(
      produce(cases!, (draft) => {
        draft.splice(index, 1)
      })
    )
  }
  const handleAdd = () => {
    setCases(
      produce(cases!, (draft) => {
        draft.push("")
      })
    )
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      <div className="wrapper">
        {cases!.map((value, index) => (
          <React.Fragment key={index}>
            <div className="case-input">
              <DebouncedTextarea
                value={value}
                width="215px"
                rows={Math.min(3, value.split("\n").length)}
                status={regExp.test(value) ? "success" : "error"}
                onKeyDown={handleKeyDown}
                onChange={(value: string) => handleInputChange(value, index)}
              />
              <XCircle cursor="pointer" onClick={() => handleRemove(index)} />
            </div>
            <Spacer y={0.5} />
          </React.Fragment>
        ))}
        <div className="btn">
          <Button onClick={handleAdd}>Add A Case</Button>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          padding: 24px 12px;
        }
        .case-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .case-input :global(textarea) {
          min-height: auto;
        }
        .btn {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default TestTab
