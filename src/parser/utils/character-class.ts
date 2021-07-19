const characterClassTextMap = {
  ".": "Any character",
  "\\d": "Any digit",
  "\\D": "Non-digit",
  "\\w": "Any alphanumeric",
  "\\W": "Non-alphanumeric",
  "\\s": "White space",
  "\\S": "Non-white space",
  "\\t": "Horizontal tab",
  "\\r": "Carriage return",
  "\\n": "Linefeed",
  "\\v": "Vertical tab",
  "\\f": "Form-feed",
  "[\\b]": "Backspace",
  "\\0": "NUL",
  "\\cH": "\\b Backspace",
  "\\cI": "\\t Horizontal Tab",
  "\\cJ": "\\n Line Feed",
  "\\cK": "\\v Vertical Tab",
  "\\cL": "\\f Form Feed",
  "\\cM": "\\r Carriage Return",
}
export type CharacterClassKey = keyof typeof characterClassTextMap
export { characterClassTextMap }
