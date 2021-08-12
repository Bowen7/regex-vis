import * as AST from "./ast"

export function visit(
  ast: AST.Regex,
  callback: (
    node: AST.Node,
    nodeList: AST.Node[],
    index: number,
    parent: AST.ParentNode
  ) => void
) {
  let stack: {
    node: AST.Node
    nodeList: AST.Node[]
    index: number
    parent: AST.ParentNode
  }[] = ast.body.map((node, index) => ({
    node,
    nodeList: ast.body,
    index,
    parent: ast,
  }))
  while (stack.length !== 0) {
    const { node, nodeList, index, parent } = stack.shift()!
    callback(node, nodeList, index, parent)
    if (node.type === "group" || node.type === "lookAroundAssertion") {
      stack = stack.concat(
        node.children.map((child, index) => ({
          node: child,
          nodeList: node.children,
          index,
          parent: node,
        }))
      )
    }
    if (node.type === "choice") {
      const branches = node.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = stack.concat(
          branch.map((child, index) => ({
            node: child,
            nodeList: branch,
            index,
            parent: node,
          }))
        )
      }
    }
  }
}

export function getNodeById(
  ast: AST.Regex,
  id: string
): {
  node: AST.Node
  parent: AST.ParentNode
  nodeList: AST.Node[]
  index: number
} {
  const { body } = ast
  let stack: {
    node: AST.Node
    parent:
      | AST.GroupNode
      | AST.Regex
      | AST.LookAroundAssertionNode
      | AST.ChoiceNode
    nodeList: AST.Node[]
    index: number
  }[] = body.map((node, index) => ({
    node,
    parent: ast,
    nodeList: body,
    index,
  }))
  while (stack.length !== 0) {
    const item = stack.shift()!
    const { node } = item
    if (node.id === id) {
      return item
    }
    if (node.type === "group" || node.type === "lookAroundAssertion") {
      const { children } = node
      stack = stack.concat(
        children.map((cur, index) => ({
          node: cur,
          parent: node,
          nodeList: children,
          index,
        }))
      )
    }
    if (node.type === "choice") {
      const branches = node.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = stack.concat(
          branch.map((cur, index) => ({
            node: cur,
            parent: node,
            nodeList: branch,
            index,
          }))
        )
      }
    }
  }
  throw new Error("unreachable")
}

export function getNodesByIds(
  ast: AST.Regex,
  ids: string[]
): {
  nodes: AST.Node[]
  parent: AST.ParentNode
  nodeList: AST.Node[]
  index: number
} {
  const { parent, nodeList, index } = getNodeById(ast, ids[0])
  return {
    nodes: nodeList.slice(index, index + ids.length),
    parent,
    nodeList,
    index,
  }
}
