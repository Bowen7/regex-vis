type Span = {
  start: number
  end: number
}
export enum TokenType {
  RegexBodyStart,
  RegexBodyEnd,
  NormalCharacter,
  GroupStart,
  GraphEnd,
  RangeStart,
  RangeEnd,
  Choice,
  CharacterClass,
  EscapedChar,
  Assertion,
  BackReference,
}
export type Token = {
  type: TokenType
  span: Span
}
