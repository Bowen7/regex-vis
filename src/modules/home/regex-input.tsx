import React from "react"
import { Spacer, Checkbox, Select, Code, useTheme } from "@geist-ui/core"
import Input from "@/components/input"
type Props = {
  regex: string
  flags: string[]
  isLiteral: boolean
  onChange: (regex: string) => void
  onIsLiteralChange: (isLiteral: boolean) => void
  onFlagsChange: (flags: string[]) => void
}
const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  isLiteral,
  onChange,
  onIsLiteralChange,
  onFlagsChange,
}) => {
  const { palette } = useTheme()
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  const dropdownStyle =
    regex === ""
      ? {}
      : {
          transform: "translate(0, -125px)",
          boxShadow: "0 -30px 60px rgb(0 0 0 / 12%)",
        }
  const handleSelectChange = (value: string | string[]) => {
    onIsLiteralChange((value as string) === "literal")
  }
  const flagStr = flags.join("")
  return (
    <>
      <div className="regex-input">
        <div className="input">
          <Select
            value={isLiteral ? "literal" : "regExp"}
            width="100px"
            disableMatchWidth={true}
            dropdownStyle={dropdownStyle}
            onChange={handleSelectChange}
          >
            <Select.Option value="regExp">
              RegExp
              <span className="hint">
                , as follows: <Code>ab+c</Code>
              </span>
            </Select.Option>
            <Select.Option value="literal">
              Literal
              <span className="hint">
                , as follows: <Code>/ab+c/</Code>
              </span>
            </Select.Option>
          </Select>
          <Input
            data-testid="regex-input"
            value={regex === null ? "" : regex}
            width="100%"
            placeholder="Input a regular expression"
            labelRight={isLiteral ? "" : flagStr}
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
              <Checkbox value="g">Global search</Checkbox>
              <Checkbox value="i">Case-insensitive</Checkbox>
              <Checkbox value="m">Multi-line</Checkbox>
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
        .input :global(.select) {
          border-right: none;
          border-radius: 5px 0 0 5px;
          min-width: 0;
        }
        .input :global(.select .value) {
          color: ${palette.accents_4};
        }
        .input :global(.select:hover) {
          border-color: ${palette.border};
        }
        .input :global(.select.active) {
          border-color: ${palette.border};
        }
        .input :global(.hint) {
          display: none;
        }
        .input :global(.input-wrapper) {
          border-radius: ${!isLiteral && flagStr ? "0" : "0 5px 5px 0"};
        }
      `}</style>
    </>
  )
}
export default RegexInput
