import React from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@geist-ui/core"
import Cell from "@/components/cell"
type Prop = {
  regex: string
  startIndex: number
  endIndex: number
}
const Expression: React.FC<Prop> = ({ regex, startIndex, endIndex }) => {
  const { t } = useTranslation()
  const { palette } = useTheme()
  return (
    <>
      <Cell label={t("Expression")}>
        <span>{regex.slice(0, startIndex)}</span>
        <span className="highlight">{regex.slice(startIndex, endIndex)}</span>
        <span>{regex.slice(endIndex)}</span>
      </Cell>
      <style jsx>{`
        .highlight {
          color: #fff;
          background-color: ${palette.success};
          padding: 2px;
          margin: 0 2px;
        }
      `}</style>
    </>
  )
}

export default Expression
