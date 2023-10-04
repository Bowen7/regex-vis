import { atom } from "jotai"
import { visitNodes, AST } from "@/parser"
import { selectedIdsAtom, nodesBoxMap, astAtom } from "./atoms"

export const clearSelectedAtom = atom(null, (get, set) => {
  set(selectedIdsAtom, [])
})

export const selectNodeAtom = atom(null, (get, set, id: string) => {
  const selectedIds = get(selectedIdsAtom)
  if (selectedIds.length === 1 && selectedIds[0] === id) {
    set(selectedIdsAtom, [])
  } else {
    set(selectedIdsAtom, [id])
  }
})

export const selectNodesAtom = atom(null, (get, set, ids: string[]) => {
  set(selectedIdsAtom, ids)
})

export const selectNodesByBoxAtom = atom(
  null,
  (get, set, box: { x1: number; y1: number; x2: number; y2: number }) => {
    const ast = get(astAtom)
    const ids: string[] = []
    visitNodes(ast, (id: string, index: number, nodes: AST.Node[]) => {
      const boxes = nodesBoxMap.get(`${id}-${index}`)!
      for (let i = 0; i < boxes.length; i++) {
        const nodeBox = boxes[i]
        if (
          box.x1 <= nodeBox.x1 &&
          box.x2 >= nodeBox.x2 &&
          box.y1 <= nodeBox.y1 &&
          box.y2 >= nodeBox.y2
        ) {
          ids.push(nodes[i].id)
        } else if (ids.length > 0) {
          break
        }
      }
      if (ids.length > 0) {
        return true
      }
      return false
    })
    set(selectNodesAtom, ids)
  }
)
