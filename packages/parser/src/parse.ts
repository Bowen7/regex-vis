import { Parser, Options } from "./parser"

const parse = (regex: string, options: Options = {}) => {
  const parser = new Parser(regex, options)
  return parser.parse()
}

export default parse
