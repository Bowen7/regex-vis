import React from "react"
import { Spacer, Checkbox, Select, Code, useTheme } from "@geist-ui/react"
import Input from "@/components/input"
type Props = {
  regex: string | null
  flags: string[]
  onChange: (regex: string) => void
  onFlagsChange: (flags: string[]) => void
}
const RegexInput: React.FC<Props> = ({
  regex,
  flags,
  onChange,
  onFlagsChange,
}) => {
  const { palette } = useTheme()
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  return (
    <>
      <div className="regex-input">
        <div className="input">
          <Select value="RegExp" width="100px" disableMatchWidth={true}>
            <Select.Option value="RegExp">
              RegExp
              <span className="hint">
                , as follows: <Code>ab+c</Code>
              </span>
            </Select.Option>
            <Select.Option value="Literal">
              Literal
              <span className="hint">
                , as follows: <Code>/ab+c/</Code>
              </span>
            </Select.Option>
          </Select>
          <Input
            value={regex === null ? "" : regex}
            width="100%"
            placeholder="Input a regular expression"
            onChange={onChange}
          />
        </div>
        {regex !== "" && (
          <>
            <Spacer inline />
            <Checkbox.Group value={flags} onChange={handleFlagsChange}>
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
        .input :global(.hint) {
          display: none;
        }
        .input :global(.input-wrapper) {
          border-radius: 0 5px 5px 0;
        }
      `}</style>
    </>
  )
}
export default RegexInput
