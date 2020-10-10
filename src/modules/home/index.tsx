import React, { useState } from "react"
import produce from "immer"
import Line from "@modules/graph/line"
import Single from "@modules/graph/single"
import { Node, DragEvent, BasicNode } from "@types"
import { JSXElement } from "@babel/types"

const defaultNodeMap = new Map<number, Node>()
defaultNodeMap.set(0, {
  type: "basic",
  prev: [],
  body: {
    type: "simple",
    value: "a",
  },
  origin: { x: 100, y: 100 },
  width: 80,
  height: 40,
  next: [1],
  id: 0,
})
defaultNodeMap.set(1, {
  type: "basic",
  prev: [0],
  body: {
    type: "simple",
    value: "a",
  },
  origin: { x: 300, y: 100 },
  width: 80,
  height: 40,
  next: [2],
  id: 1,
})
defaultNodeMap.set(2, {
  type: "basic",
  prev: [1],
  body: {
    type: "simple",
    value: "a",
  },
  origin: { x: 500, y: 100 },
  width: 80,
  height: 40,
  next: [],
  id: 2,
})
let _id = 3
const Home: React.FC<{}> = () => {
  const [nodeMap, setNodeMap] = useState<Map<number, Node>>(defaultNodeMap)

  function onDrag(e: DragEvent) {
    const { id, deltaX, deltaY } = e
    const nextNodeMap = produce(nodeMap, draftNodeMap => {
      const node = draftNodeMap.get(id)
      if (node) {
        const origin = node.origin
        node.origin = {
          x: origin.x + deltaX,
          y: origin.y + deltaY,
        }
        draftNodeMap.set(id, node)
      }
    })
    setNodeMap(nextNodeMap)
  }

  function onAddNode(id: number, direction: "prev" | "next") {
    const nextNodeMap = produce(nodeMap, draftNodeMap => {
      const node: BasicNode = {
        type: "basic",
        prev: [],
        body: {
          type: "simple",
          value: "a",
        },
        origin: { x: 200, y: 200 },
        width: 80,
        height: 40,
        next: [],
        id: _id,
      }
      if (direction === "prev") {
        node.next.push(id)
      } else {
        const curNode = draftNodeMap.get(id)
        if (curNode) {
          curNode.next.push(_id)
          draftNodeMap.set(id, curNode)
        }
      }
      draftNodeMap.set(_id++, node)
    })
    setNodeMap(nextNodeMap)
  }
  function renderNodes(nodeMap: Map<number, Node>): JSX.Element[] {
    const nodes: JSX.Element[] = []
    nodeMap.forEach((node, id) => {
      if (node?.type === "basic") {
        nodes.push(
          <Single node={node} key={id} onDarg={onDrag} onAddNode={onAddNode} />
        )
      }
    })
    return nodes
  }
  function renderLines(nodeMap: Map<number, Node>): JSX.Element[] {
    const lines: JSX.Element[] = []
    nodeMap.forEach((node, id) => {
      if (node?.type === "basic" && node.next) {
        const { origin, width, height, next } = node
        const start = { x: origin.x + width, y: origin.y + height / 2 }
        next.forEach(nextId => {
          const nextNode = nodeMap.get(nextId)
          if (nextNode?.type === "basic") {
            const { origin: nextNodeOrigin, height: nextNodeHeight } = nextNode
            const end = {
              x: nextNodeOrigin.x,
              y: nextNodeOrigin.y + nextNodeHeight / 2,
            }
            lines.push(<Line start={start} end={end} key={`${id}-${nextId}`} />)
          }
        })
      }
    })
    return lines
  }
  return (
    <svg
      style={{ width: "900px", height: "500px" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="triangle"
          markerUnits="strokeWidth"
          markerWidth="7"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <path d="M 0 0 L 7 3.5 L 0 7 z" />
        </marker>

        <marker
          id="triangle-reverse"
          markerUnits="strokeWidth"
          markerWidth="7"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <path d="M 0 0 L 7 0 L 3.5 7 z" />
        </marker>
      </defs>
      {/* lines should be rendered before nodes */}
      {/* in svg, the rendering order is based on the document order, cant use z-index */}
      {renderLines(nodeMap)}
      {renderNodes(nodeMap)}
    </svg>
  )
}

export default Home
