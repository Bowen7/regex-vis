import React, { useState } from "react"
import { AST } from "@/parser"
import QuantifierNode from "./quantifier-new"
import MidConnect from "./mid-connect"

//    name
//  --------
// |        |  -> content
//  --------
//  quantifier
export const withNameQuantifier = <
  T extends {
    x: number
    y: number
    node: AST.Node
    onLayout: (index: number, layout: [number, number]) => void
    children: React.ReactNode
  }
>(
  Component: React.ComponentType<T>
) => {
  return (props: Omit<T, "children">) => {
    const { x, y, node, onLayout, ...restProps } = props
    const [contentLayout, setContentLayout] = useState<[number, number]>([0, 0])
    const [quantifierLayout, setQuantifierLayout] = useState<[number, number]>([
      0, 0,
    ])
    const [nameLayout, setNameLayout] = useState<[number, number]>([0, 0])

    const width = Math.max(contentLayout[0], quantifierLayout[0], nameLayout[0])
    const height =
      contentLayout[1] + 2 * Math.max(quantifierLayout[1], nameLayout[1])

    const quantifier =
      node.type === "character" || node.type === "group"
        ? node.quantifier
        : null

    const contentX = x + (width - contentLayout[0]) / 2
    const contentY = y + (height - contentLayout[1]) / 2
    const centerY = y + height / 2

    return (
      <Component
        {...(restProps as T)}
        x={contentX}
        y={contentY}
        node={node}
        onLayout={setContentLayout}
      >
        {contentX !== x && (
          <MidConnect start={[x, centerY]} end={[contentX, centerY]} />
        )}
        {quantifier && (
          <QuantifierNode
            x={x + (width - quantifierLayout[0]) / 2}
            y={contentX + contentLayout[1]}
            quantifier={quantifier}
            onLayout={setQuantifierLayout}
          />
        )}
        {contentX !== x && (
          <MidConnect
            start={[contentX + contentLayout[0], centerY]}
            end={[x + width, centerY]}
          />
        )}
      </Component>
    )
  }
}
