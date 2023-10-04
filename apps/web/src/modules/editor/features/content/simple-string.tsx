import React from "react"
import { useTranslation } from "react-i18next"
import { Note, Spacer, useToasts } from "@geist-ui/core"
import { useSetAtom } from "jotai"
import Input from "@/components/input"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import { updateContentAtom } from "@/atom"

type Props = {
  value: string
  quantifier: AST.Quantifier | null
}
const SimpleString: React.FC<Props> = ({ value, quantifier }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  const { setToast } = useToasts()

  const handleChange = (value: string) => {
    if (value.length > 1 && quantifier) {
      setToast({ text: "Group selection automatically" })
    }
    updateContent({
      kind: "string",
      value,
    })
  }

  return (
    <Cell.Item label={t("Value")}>
      <Note type="secondary" style={{ lineHeight: 1.5 }} scale={0.5}>
        {t("The input will be escaped automatically.")}
      </Note>
      <Spacer h={0.5} />
      <Input value={value} onChange={handleChange} />
    </Cell.Item>
  )
}

export default SimpleString
