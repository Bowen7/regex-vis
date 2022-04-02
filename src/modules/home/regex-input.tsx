import React from "react"
import { Spacer, Checkbox } from "@geist-ui/react"
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
  const handleFlagsChange = (flags: string[]) => {
    onFlagsChange(flags)
  }
  return (
    <>
      <div className="regex-input">
        <div className="input">
          <Input
            label="Regex"
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
        }
      `}</style>
    </>
  )
}
export default RegexInput
