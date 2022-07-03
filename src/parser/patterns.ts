export const flag = /[gimsuy]/
export const cX = /^([A-Za-z])/
export const xhh = /^([0-9A-Fa-f]{2})/
export const uhhhh = /^([0-9A-Fa-f]{4})/
export const digit = /^(\d+)/
export const comma = /^,/
export const lookAround = /^(\?=|\?!|\?<=|\?<!)/
export const nonCapturing = /^\?:/
export const namedCapturing = /^\?<(\w+)>/
export const quantifier = /^\{(\d+)(,|,(\d+))?\}/
export const normalCharacterInLiteral = /[/()[|\\.^$?+*]|\{(\d+)(,|,(\d+))?\}/
export const normalCharacter = /[()[|\\.^$?+*]|\{(\d+)(,|,(\d+))?\}/
export const characterClass =
  /^\\(?:[dDwWsStrnvf0]|c[A-Za-z]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})/
export const allowEscapedBackslashCharacterClass =
  /^\\{1,2}(?:[dDwWsStrnvf0]|c[A-Za-z]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})/
export const backReference = /^\\(\d+|k<(\w+)>)/
export const withEscapedBackslashWordBoundary = /^\\\\[bB]/
export const wordBoundary = /^\\[bB]/
