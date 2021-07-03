import React from "react"
import { Node } from "@/types"
import {
  NODE_PADDING_HORIZONTAL,
  NODE_MARGIN_VERTICAL,
  TEXT_PADDING_VERTICAL,
} from "@/constants/graph"
import { getTexts } from "./utils"
const FONT = 16
type TextProps = {
  node: Node
  x: number
  y: number
}

const NodeText: React.FC<TextProps> = React.memo(({ x, y, node }) => {
  let texts = getTexts(node)
  if (!texts) {
    return null
  }
  return (
    <>
      {texts.map((spans, index) => (
        <text
          x={x}
          y={y}
          fontSize={FONT}
          dy={
            FONT * (index + 1) +
            NODE_MARGIN_VERTICAL / 2 +
            index * TEXT_PADDING_VERTICAL
          }
          dx={NODE_PADDING_HORIZONTAL}
          className="text"
          key={index}
        >
          {spans.map((span, index) => {
            switch (span.type) {
              case "backtick":
                return (
                  <tspan className="quote" key={index}>
                    `
                  </tspan>
                )
              case "text":
                return <tspan key={index}>{span.text}</tspan>
              case "hyphen":
                return (
                  <tspan className="quote" key={index}>
                    {" - "}
                  </tspan>
                )

              default:
                return null
            }
          })}
        </text>
      ))}
    </>
  )
})

export default NodeText
