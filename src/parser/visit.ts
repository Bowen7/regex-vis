import * as AST from "./ast"
export type Path = { node: AST.Node; nodeList: AST.Node[] }[]
function visit(
  nodes: AST.Node[],
  id: string,
  callback: (node: AST.Node, nodeList: AST.Node[], path: Path) => void,
  path: Path = []
): true | void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.id === id) {
      callback(node, nodes, path)
      return true
    }

    if (
      node.type === "choice" ||
      node.type === "group" ||
      node.type === "lookAroundAssertion"
    ) {
      path.push({ nodeList: nodes, node })
      if (node.type === "choice") {
        const branches = node.branches
        for (let i = 0; i < branches.length; i++) {
          if (visit(branches[i], id, callback, path)) {
            return true
          }
        }
      } else {
        if (visit(node.children, id, callback, path)) {
          return true
        }
      }
      path.pop()
    }
  }
}

export function visitTree(
  nodes: AST.Node[],
  callback: (node: AST.Node) => void
) {
  let stack = nodes.slice()
  while (stack.length !== 0) {
    const cur = stack.shift() as AST.Node
    callback(cur)
    if (cur.type === "group" || cur.type === "lookAroundAssertion") {
      stack = cur.children.concat(stack)
    }
    if (cur.type === "choice") {
      const branches = cur.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = branch.concat(stack)
      }
    }
  }
}

export function getNodeById(
  nodes: AST.Node[],
  id: string
): { node: AST.Node; nodeList: AST.Node[]; index: number } {
  let stack = nodes.map((node, index) => ({ node, nodeList: nodes, index }))
  while (stack.length !== 0) {
    const item = stack.shift()!
    const { node } = item
    if (node.id === id) {
      return item
    }
    if (node.type === "group" || node.type === "lookAroundAssertion") {
      const { children } = node
      stack = stack.concat(
        children.map((node, index) => ({ node, nodeList: children, index }))
      )
    }
    if (node.type === "choice") {
      const branches = node.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = stack.concat(
          branch.map((node, index) => ({ node, nodeList: branch, index }))
        )
      }
    }
  }
  throw new Error("unreachable")
}

export function getNodesByIds(nodes: AST.Node[], ids: string[]): AST.Node[] {
  if (ids.length === 0) {
    return []
  }
  const headId = ids[0]
  let cur!: AST.Node
  let stack = nodes.slice()
  while (stack.length !== 0) {
    cur = stack.shift() as AST.Node
    if (cur!.id === headId) {
      break
    }
    if (cur.type === "group" || cur.type === "lookAroundAssertion") {
      stack = stack.concat(cur.children)
    }
    if (cur.type === "choice") {
      const branches = cur.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = stack.concat(branch)
      }
    }
  }
  return [cur, ...stack.slice(0, ids.length - 1)]
}
export default visit
