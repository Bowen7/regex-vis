import type { AST } from '@/parser'
import { parse } from '@/parser'
import ASTGraph from '@/modules/graph/ast-graph'

const r = '[a-z]'
const ast = parse(r) as AST.Regex

const Playground = () => {
  return (
    <ASTGraph ast={ast} />
  )
}
export default Playground
