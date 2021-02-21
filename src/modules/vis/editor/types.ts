export type StringCharacter = {
  type: "string"
  value: string
}
export type RangesCharacter = {
  type: "ranges"
}
export type SpecialCharacter = {
  type: "special"
}
export type Character = StringCharacter | RangesCharacter | SpecialCharacter
export type Group =
  | {
      type: "capturing" | "nonCapturing" | "nonGroup"
    }
  | { type: "namedCapturing"; name: string }

export type NodesInfo = {
  expression: string
  group: Group | null
  character: Character | null
}
