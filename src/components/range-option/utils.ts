export enum RangeError {
  EMPTY_INPUT,
  INVALID_RANGE,
}

export const checkInputValid = (value: string): RangeError | null => {
  value = value.trim()
  if (value === "") {
    return RangeError.EMPTY_INPUT
  }
  // Todo: unicode
  if (value.length === 1) {
    return null
  }
  return RangeError.INVALID_RANGE
}
