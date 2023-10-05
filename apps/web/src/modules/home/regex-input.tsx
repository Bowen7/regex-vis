import React from "react"
import { Spacer, Checkbox, Code, Button, Tooltip } from "@geist-ui/core"
import Link from "@geist-ui/icons/link"
import { useTranslation } from "react-i18next"
import Input from "@/components/input"
import { CheckboxEvent } from "@geist-ui/core/esm/checkbox"
import { REGEX_FONT_FAMILY } from "@/constants"
type Props = {
  regex: string
  flags: string[]
  literal: boolean
  escapeBackslash: boolean
  onChange: (regex: string) => void
  onFlagsChange: (flags: string[]) => void
  onEscapeBackslashChange: (escapeBackslash: boolean) => void
  onCopy: () => void
}
const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  literal,
  escapeBackslash,
  onChange,
  onFlagsChange,
  onEscapeBackslashChange,
  onCopy,
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
          <div className="input-wrapper">
            <Input
              data-testid="regex-input"
              value={regex === null ? "" : regex}
              width="100%"
              placeholder={t("Input a regular expression")}
              labelRight={literal ? "" : flagStr}
              onChange={onChange}
            />
            <Spacer w={0.5} />
            <Tooltip text={t("Copy permalink")}>
              <Button
                iconRight={<Link />}
                auto
                scale={2 / 3}
                px={0.6}
                onClick={onCopy}
              />
            </Tooltip>
          </div>
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
        .wrapper :global(input) {
          font-family: ${REGEX_FONT_FAMILY};
        }
        .content {
          flex: 1;
          max-width: 900px;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
        }
        .flags-settings {
          display: flex;
        }
        .flags-settings > :global(.group > .checkbox) {
          margin-right: calc(calc(0.875 * 8px) * 2);
        }
      `}</style>
    </>
  )
}
export default RegexInput
