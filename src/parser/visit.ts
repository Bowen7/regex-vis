import { Node } from "@/types"
export type Path = { node: Node; nodeList: Node[] }[]
function visit(
  nodes: Node[],
  id: string,
  callback: (node: Node, nodeList: Node[], path: Path) => void,
  path: Path = []
): true | void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.id === id) {
      callback(node, nodes, path)
      return true
    }

    if (node.children || node.branches) {
      path.push({ nodeList: nodes, node })
      if (node.children) {
        if (visit(node.children, id, callback, path)) {
          return true
        }
      }
      if (node.branches) {
        const branches = node.branches
        for (let i = 0; i < branches.length; i++) {
          if (visit(branches[i], id, callback, path)) {
            return true
          }
        }
      }
      path.pop()
    }
  }
}

export function visitTree(nodes: Node[], callback: (node: Node) => void) {
  let stack = [...nodes]
  while (stack.length !== 0) {
    const cur = stack.shift()
    callback(cur as Node)
    if (cur?.children) {
      stack = cur.children.concat(stack)
    }
    if (cur?.branches) {
      const branches = cur.branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i]
        stack = branch.concat(stack)
      }
    }
  }
}
export default visit
