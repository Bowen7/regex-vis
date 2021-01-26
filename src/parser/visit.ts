import { Node } from '@/types'

function visit(
  nodes: Node[],
  id: string,
  callback: (node: Node, nodeList: Node[], path: Node[]) => void,
  path: Node[] = []
): true | void {
  nodes.forEach(node => {
    if (node.id === id) {
      callback(node, nodes, path)
      return true
    }

    if (node.children || node.branches) {
      path.push(node)
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
  })
}

export function visitTree(nodes: Node[], callback: (node: Node) => void) {
  const stack = [...nodes]
  while (stack.length !== 0) {
    const cur = stack.shift()
    callback(cur as Node)
    if (cur?.children) {
      stack.unshift(...cur.children.reverse())
    }
    if (cur?.branches) {
      const branches = cur.branches
      branches.reverse().forEach(branch => {
        stack.unshift(...branch.reverse())
      })
    }
  }
}
export default visit
