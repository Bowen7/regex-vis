import Parser from "./parser"

const parse = (
  regex: string | RegExp,
  idGenerator?: (size?: number) => string
) => {
  if (typeof regex !== "string") {
    regex = String(regex)
  }
  const parser = new Parser(regex, idGenerator)
  return parser.parse()
}

export default parse
