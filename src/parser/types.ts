export interface GraphTypeMap {
  line: LineType
  pattern: PatternType
}

interface GraphBasicType<T extends keyof GraphTypeMap> {
  type: T
}

interface Pos {
  x: number
  y: number
}

export interface LineType extends GraphBasicType<"line"> {
  start: Pos
  end: Pos
}

export interface PatternType extends GraphBasicType<"pattern"> {
  body?: string[]
  center: Pos
  radius: number
}
