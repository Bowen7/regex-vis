// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
// Support Escape sequences:
// \0 \n \r \t \b \f \v \uhhhh \xXX \u{X}…\u{XXXXXX}
import { escapeSequences as escapeSequencesPattern } from "./patterns"

export const removeBackslash = (str: string): string => {
  let result = ""
  let index = 0
  while (index < str.length) {
    if (str[index] === "\\") {
      const matches = str.slice(index).match(escapeSequencesPattern)
      if (matches) {
        result += matches[0]
        index += matches[0].length
      } else {
        if (index === str.length - 1) {
          throw new Error("Invalid escape sequence")
        }
        result += str[index + 1]
        index += 2
      }
      continue
    }
    result += str[index]
    index++
  }
  return result
}
