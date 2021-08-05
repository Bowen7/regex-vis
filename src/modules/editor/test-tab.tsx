import React, { useEffect, useState } from "react"
import { useTheme, Button, Spacer } from "@geist-ui/react"
import XCircle from "@geist-ui/react-icons/xCircle"
import { useStorageState } from "@/utils/hooks"
import produce from "immer"
import Input from "@/components/input"
import { useMainReducer } from "@/redux"
import { gen } from "@/parser"
const TestTab: React.FC<{}> = () => {
  const { palette } = useTheme()
  const [cases, setCases] = useStorageState<string[]>("test-case", [""])
  const [{ ast }] = useMainReducer()
  const [regExp, setRegExp] = useState<RegExp>(() => {
    const regex = gen(ast, false)
    return new RegExp(regex, ast.flags.join(""))
  })

  useEffect(() => {
    if (cases.length === 0) {
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
      produce(cases, (draft) => {
        draft[index] = value
      })
    )
  }
  const handleRemove = (index: number) => {
    setCases(
      produce(cases, (draft) => {
        draft.splice(index, 1)
      })
    )
  }
  const handleAdd = () => {
    setCases(
      produce(cases, (draft) => {
        draft.push("")
      })
    )
  }
  return (
    <>
      <div className="wrapper">
        {cases.map((value, index) => (
          <React.Fragment key={index}>
            <div className="case-input">
              <Input
                value={value}
                width="215px"
                status={regExp.test(value) ? "success" : "error"}
                onChange={(value) => handleInputChange(value, index)}
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
        .btn {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default TestTab
