import {
  GroupNode,
  SingleNode,
  Node,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
  RootNode,
} from "@types"

type Quantifier = GroupNode | SingleNode
export function hasQuantifier(node: Node): node is Quantifier {
  return !!(node as Quantifier).quantifier
}

type TextNode = RootNode | SingleNode | BoundaryAssertionNode
export function hasText(node: Node): node is TextNode {
  return !!(node as TextNode).text
}

type NameNode = SingleNode | GroupNode | LookaroundAssertionNode
export function hasName(node: Node): node is NameNode {
  return !!(node as NameNode).name
}
