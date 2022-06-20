import React from "react"
import { useTranslation } from "react-i18next"
import Cell from "@/components/cell"
type Prop = {
  expression: String
}
const Expression: React.FC<Prop> = ({ expression }) => {
  const { t } = useTranslation()
  return (
    <>
      <Cell label={t("Expression")}>
        <span className="expression">{expression}</span>
      </Cell>
      <style jsx>{`
        .expression {
          color: #3291ff;
        }
      `}</style>
    </>
  )
}

export default Expression
