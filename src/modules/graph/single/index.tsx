import React from "react"
import { BasicNode, DragEvent } from "@types"
import Nodeable from "@components/nodeable"
type SingleProps = {
  node: BasicNode
  onDarg?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
  onAddNode?: (id: number, direction: "prev" | "next") => void
}
const Single: React.FC<SingleProps> = props => {
  const node = props.node
  const { id } = node
  const origin = {
    x: 300,
    y: 300,
  }
  const width = 200
  const height = 300
  function onDrag(e: DragEvent) {
    props.onDarg && props.onDarg(e)
  }
  function onAddNode(direction: "prev" | "next") {
    props.onAddNode && props.onAddNode(id, direction)
  }
  function onDragEnd(e: DragEvent) {
    props.onDragEnd && props.onDragEnd(e)
  }
  function onDoubleClick() {
    console.log(123)
  }
  const xmlnsProps = {
    xmlns: "http://www.w3.org/1999/xhtml",
  }
  return (
    <Nodeable
      id={id}
      origin={origin}
      width={width}
      height={height}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onAddNode={onAddNode}
    >
      <g>
        <rect
          x={origin.x}
          y={origin.y}
          rx={5}
          ry={5}
          width={width}
          height={height}
          fill="#fff"
          stroke="#284059"
          strokeWidth="2"
          style={{ cursor: "move" }}
          onDoubleClick={onDoubleClick}
        ></rect>
        <foreignObject
          x={origin.x}
          y={origin.y}
          width={width}
          height={height}
          style={{ cursor: "move" }}
        >
          {React.createElement(
            "div",
            {
              ...xmlnsProps,
              style: {
                cursor: "move",
                userSelect: "none",
                width,
                height,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
            <div>123</div>
          )}
        </foreignObject>
      </g>
    </Nodeable>
  )
}

export default Single
