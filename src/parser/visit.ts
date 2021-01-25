import { Node } from "@/types"

function visit(
  nodes: Node[],
  id: string,
  callback: (node: Node, path: Node[]) => void,
  path: Node[] = []
): true | void {
  nodes.forEach(node => {
    if (node.id === id) {
      callback(node, path)
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

export default visit
