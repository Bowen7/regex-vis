export enum RangeError {
  EMPTY_INPUT,
  INVALID_RANGE,
}
const unicodeRegex = /^(\\u[0-9a-fA-F]{4}|\\u{[0-9a-fA-F]{4}}|\\u{[0-9a-fA-F]{5}})$/
export const checkInputValid = (value: string): RangeError | null => {
  value = value.trim()
  if (value === "") {
    return RangeError.EMPTY_INPUT
  }
  if (value.length === 1 || unicodeRegex.test(value)) {
    return null
  }
  return RangeError.INVALID_RANGE
}
