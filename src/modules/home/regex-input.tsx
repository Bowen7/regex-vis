import React from "react"
import { Spacer, Checkbox } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import Input from "@/components/input"
type Props = {
  regex: string
  flags: string[]
  literal: boolean
  onChange: (regex: string) => void
  onFlagsChange: (flags: string[]) => void
}
const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  literal,
  onChange,
  onFlagsChange,
}) => {
  const { t } = useTranslation()
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  const flagStr = flags.join("")
  return (
    <>
      <div className="regex-input">
        <div className="input">
          <Input
            data-testid="regex-input"
            value={regex === null ? "" : regex}
            width="100%"
            placeholder={t("Input a regular expression")}
            labelRight={literal ? "" : flagStr}
            onChange={onChange}
          />
        </div>
        {regex !== "" && (
          <>
            <Spacer inline />
            <Checkbox.Group
              value={flags}
              onChange={handleFlagsChange}
              scale={0.75}
            >
              <Checkbox value="g">{t("Global search")}</Checkbox>
              <Checkbox value="i">{t("Case-insensitive")}</Checkbox>
              <Checkbox value="m">{t("Multi-line")}</Checkbox>
            </Checkbox.Group>
          </>
        )}
      </div>
      <style jsx>{`
        .regex-input {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .input {
          flex: 1;
          max-width: 900px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )
}
export default RegexInput
