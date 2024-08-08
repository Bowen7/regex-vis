import { nanoid } from 'nanoid'
import type * as AST from '../ast'
import { getNodeById } from '../visit'
import { replaceFromLists } from './replace'

export const updateQuantifier = (
  ast: AST.Regex,
  selectedId: string,
  quantifier: AST.Quantifier | null,
) => {
  let nextSelectedId = selectedId
  const { node, nodeList } = getNodeById(ast, selectedId)
  if (
    node.type === 'character'
    && node.kind === 'string'
    && node.value.length > 1
  ) {
    const groupNode: AST.GroupNode = {
      id: nanoid(),
      type: 'group',
      kind: 'nonCapturing',
      children: [node],
      quantifier,
    }
    nextSelectedId = groupNode.id
    replaceFromLists(nodeList, [node], [groupNode])
  } else if (node.type === 'character' || node.type === 'group') {
    node.quantifier = quantifier
  }
  return nextSelectedId
}
