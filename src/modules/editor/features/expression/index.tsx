import React from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@geist-ui/core"
import Cell from "@/components/cell"
import { REGEX_FONT_FAMILY } from "@/constants"
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
        <p className="expression">
          <span>{regex.slice(0, startIndex)}</span>
          <span className="highlight">{regex.slice(startIndex, endIndex)}</span>
          <span>{regex.slice(endIndex)}</span>
        </p>
      </Cell>
      <style jsx>{`
        .expression {
          font-family: ${REGEX_FONT_FAMILY};
        }
        .highlight {
          border: 2px dashed ${palette.successLight};
          border-radius: 4px;
          padding: 2px 4px;
          margin: 0 2px;
        }
      `}</style>
    </>
  )
}

export default Expression
