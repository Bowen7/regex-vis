import * as AST from "./ast"

export function visit(
  node: AST.Regex | AST.Node,
  callback: (
    node: AST.Node,
    nodeList: AST.Node[],
    index: number,
    parent: AST.ParentNode
  ) => void | boolean
) {
  let found = false
  const _callback = (
    node: AST.Node,
    nodeList: AST.Node[],
    index: number,
    parent: AST.ParentNode
  ) => {
    if (found) {
      return true
    }
    return callback(node, nodeList, index, parent)
  }

  const _visit = (node: AST.Regex | AST.Node) => {
    switch (node.type) {
      case "regex":
      case "group":
      case "lookAroundAssertion":
        const children = node.type === "regex" ? node.body : node.children
        for (let index = 0; index < children.length; index++) {
          const child = children[index]
          if (_callback(child, children, index, node)) {
            found = true
            return
          }
          _visit(child)
        }
        break
      case "choice":
        const { branches } = node
        for (const branch of branches) {
          for (let index = 0; index < branch.length; index++) {
            const child = branch[index]
            if (_callback(child, branch, index, node)) {
              found = true
              return
            }
            _visit(child)
          }
        }
        break
      default:
        break
    }
  }

  _visit(node)
}

export const visitNodes = (
  node: AST.Regex | AST.Node,
  callback: (id: string, index: number, nodes: AST.Node[]) => void | boolean
) => {
  let found = false
  const _callback = (id: string, index: number, nodes: AST.Node[]) => {
    if (found) {
      return true
    }
    return callback(id, index, nodes)
  }

  const _visitNodes = (node: AST.Regex | AST.Node) => {
    switch (node.type) {
      case "regex":
      case "group":
      case "lookAroundAssertion":
        const children = node.type === "regex" ? node.body : node.children
        if (_callback(node.id, 0, children)) {
          found = true
          return
        }
        for (const child of children) {
          _visitNodes(child)
        }
        break
      case "choice":
        const { branches } = node
        for (let index = 0; index < branches.length; index++) {
          const branch = branches[index]
          if (_callback(node.id, index, branch)) {
            found = true
            return
          }
          for (const child of branch) {
            _visitNodes(child)
          }
        }
        break
      default:
        break
    }
  }

  _visitNodes(node)
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
  let ret: {
    node: AST.Node
    parent: AST.ParentNode
    nodeList: AST.Node[]
    index: number
  } | null = null
  visit(ast, (node, nodeList, index, parent) => {
    if (node.id === id) {
      ret = {
        node,
        parent,
        nodeList,
        index,
      }
      return true
    }
  })
  if (ret === null) {
    throw new Error(`Node with id "${id}" not found.`)
  }
  return ret!
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

export function lrd(
  node: AST.Regex | AST.Node,
  callback: (node: AST.Regex | AST.Node) => void
) {
  switch (node.type) {
    case "regex":
      node.body.forEach((child) => lrd(child, callback))
      break
    case "group":
    case "lookAroundAssertion":
      node.children.forEach((child) => lrd(child, callback))
      break
    case "choice":
      node.branches.forEach((branch) => {
        branch.forEach((child) => lrd(child, callback))
      })
      break
    default:
      break
  }
  callback(node)
}
