import type * as AST from './ast'

export const getQuantifier = (node: AST.Node) =>
  (node.type === 'character' || node.type === 'group' || node.type === 'backReference') ? node.quantifier : null

export const checkQuantifier = (node: AST.Node): node is (AST.CharacterNode | AST.GroupNode | AST.BackReferenceNode) =>
  (node.type === 'character' || node.type === 'group' || node.type === 'backReference')
