import React, { useMemo } from "react"
import { Button, Spacer } from "@geist-ui/core"
import { useAtomValue } from "jotai"
import { useLocalStorage } from "react-use"
import produce from "immer"
import TestItem from "@/components/test-item"
import { gen } from "@/parser"
import { astAtom } from "@/atom"

const TestTab = () => {
  const [cases, setCases] = useLocalStorage<string[]>("test-case", [""])
  const ast = useAtomValue(astAtom)
  const regExp = useMemo(() => {
    const regex = gen(ast, { isLiteral: false, escapeSlash: ast.withSlash })
    return new RegExp(regex, ast.flags.join(""))
  }, [ast])

  const handleChange = (value: string, index: number) => {
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

  return (
    <>
      <div className="wrapper">
        {cases!.map((value, index) => (
          <React.Fragment key={index}>
            <TestItem
              value={value}
              regExp={regExp}
              onChange={(value) => handleChange(value, index)}
              onRemove={() => handleRemove(index)}
            />
            <Spacer h={0.5} />
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
        .btn {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default TestTab
