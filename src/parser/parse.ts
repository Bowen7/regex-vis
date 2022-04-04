import Parser from "./parser"

const parse = (
  regex: string,
  isLiteral = false,
  idGenerator?: (size?: number) => string
) => {
  const parser = new Parser(regex, isLiteral, idGenerator)
  return parser.parse()
}

export default parse
