import React from "react"
import { Spacer, Checkbox, Code } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import Input from "@/components/input"
import { CheckboxEvent } from "@geist-ui/core/esm/checkbox"
type Props = {
  regex: string
  flags: string[]
  literal: boolean
  escapeBackslash: boolean
  onChange: (regex: string) => void
  onFlagsChange: (flags: string[]) => void
  onEscapeBackslashChange: (escapeBackslash: boolean) => void
}
const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  literal,
  escapeBackslash,
  onChange,
  onFlagsChange,
  onEscapeBackslashChange,
}) => {
  const { t } = useTranslation()
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  const handleEscapeBackslashChange = (e: CheckboxEvent) =>
    onEscapeBackslashChange(e.target.checked)
  const flagStr = flags.join("")
  return (
    <>
      <div className="wrapper">
        <div className="content">
          <Input
            data-testid="regex-input"
            value={regex === null ? "" : regex}
            width="100%"
            placeholder={t("Input a regular expression")}
            labelRight={literal ? "" : flagStr}
            onChange={onChange}
          />
          {regex !== "" && (
            <>
              <Spacer h={1} />
              <div className="flags-settings">
                <label>{t("Flags: ")}</label>
                <Spacer w={0.5} />
                <Checkbox.Group
                  value={flags}
                  onChange={handleFlagsChange}
                  scale={0.75}
                >
                  <Checkbox value="g">{t("Global search")}</Checkbox>
                  <Checkbox value="i">{t("Case-insensitive")}</Checkbox>
                  <Checkbox value="m">{t("Multi-line")}</Checkbox>
                  <Checkbox value="s">
                    {t("Allows . to match newline")}
                  </Checkbox>
                </Checkbox.Group>
                {!literal && (
                  <>
                    <Spacer w={1} />
                    <label>{t("Settings: ")}</label>
                    <Spacer w={0.5} />
                    <div>
                      <Checkbox
                        checked={escapeBackslash}
                        onChange={handleEscapeBackslashChange}
                      >
                        {t("include escape ")}
                        <Code>\</Code>
                      </Checkbox>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .content {
          flex: 1;
          max-width: 900px;
        }
        .flags-settings {
          display: flex;
        }
      `}</style>
    </>
  )
}
export default RegexInput
