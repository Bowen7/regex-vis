import * as AST from "./ast"
export type Path = { node: AST.Node; nodeList: AST.Node[] }[]
export function visit(
  ast: AST.Regex | AST.Node[],
  id: string,
  callback: (node: AST.Node, nodeList: AST.Node[], path: Path) => void,
  path: Path = []
): true | void {
  const nodes = Array.isArray(ast) ? ast : ast.body
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

export function visitTree(ast: AST.Regex, callback: (node: AST.Node) => void) {
  let stack = ast.body.slice()
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
  ast: AST.Regex,
  id: string
): { node: AST.Node; nodeList: AST.Node[]; index: number } {
  const { body } = ast
  let stack = body.map((node, index) => ({ node, nodeList: body, index }))
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

export function getNodesByIds(ast: AST.Regex, ids: string[]): AST.Node[] {
  if (ids.length === 0) {
    return []
  }
  const headId = ids[0]
  let cur!: AST.Node
  let stack = ast.body.slice()
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
