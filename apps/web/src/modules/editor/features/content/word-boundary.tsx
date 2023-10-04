import React from "react"
import { Checkbox } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useSetAtom } from "jotai"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import { updateContentAtom } from "@/atom"

type Props = {
  negate: boolean
}
const SimpleString: React.FC<Props> = ({ negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  const handleChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    updateContent({
      kind: "wordBoundaryAssertion",
      negate,
    })
  }

  return (
    <Cell.Item label={t("Negate")}>
      <Checkbox checked={negate} onChange={handleChange}>
        {t("negate")}
      </Checkbox>
    </Cell.Item>
  )
}

export default SimpleString
