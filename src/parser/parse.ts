import type { Options } from './parser'
import { Parser } from './parser'

function parse(regex: string, options: Options = {}) {
  const parser = new Parser(regex, options)
  return parser.parse()
}

export default parse
