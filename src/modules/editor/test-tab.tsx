import React, { useMemo } from "react"
import { Button, Spacer, useToasts, useClipboard } from "@geist-ui/core"
import Plus from "@geist-ui/icons/plus"
import Link from "@geist-ui/icons/link"
import { useTranslation } from "react-i18next"
import { useAtomValue } from "jotai"
import { useLocalStorage } from "react-use"
import produce from "immer"
import TestItem from "@/components/test-item"
import { gen } from "@/parser"
import { astAtom } from "@/atom"
import { genPermalink } from "@/utils/helpers"
import { STORAGE_TEST_CASES } from "@/constants"

const TestTab = () => {
  const { t } = useTranslation()
  const [cases, setCases] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [""])
  const ast = useAtomValue(astAtom)
  const regExp = useMemo(() => {
    const regex = gen(ast, { literal: false, escapeBackslash: false })
    return new RegExp(regex, ast.flags.join(""))
  }, [ast])

  const { setToast } = useToasts()
  const { copy } = useClipboard()

  const handleCopyPermalink = () => {
    const permalink = genPermalink(ast.escapeBackslash, cases)
    copy(permalink)
    setToast({ text: t("Permalink copied.") })
  }

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
          <Button
            iconRight={<Plus />}
            auto
            scale={2 / 3}
            px={0.6}
            onClick={handleAdd}
          />
          <Spacer w={1} />
          <Button
            iconRight={<Link />}
            auto
            scale={2 / 3}
            px={0.6}
            onClick={handleCopyPermalink}
          />
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          padding: 24px 12px;
        }
        .btn {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }
      `}</style>
    </>
  )
}

export default TestTab
