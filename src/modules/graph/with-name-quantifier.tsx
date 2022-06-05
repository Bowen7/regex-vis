import React, { useEffect, useState, useCallback } from "react"
import { useUnmount } from "react-use"
import { AST } from "@/parser"
import QuantifierNode from "./quantifier-new"
import { NameNode } from "./name-new"
import MidConnect from "./mid-connect"
import { getQuantifier, getName } from "./utils-new"
import { GRAPH_NAME_HEIGHT } from "@/constants"

//    name
//  --------
// |        |  -> content
//  --------
//  quantifier
export const withNameQuantifier = <
  T extends {
    index: number
    x: number
    y: number
    node: AST.Node
    onLayout: (index: number, layout: [number, number]) => void
    children: React.ReactNode
  }
>(
  Component: React.FC<T>
) => {
  const WithNameQuantifier = (props: Omit<T, "children">) => {
    const { index, x, y, node, onLayout, ...restProps } = props
    const [contentLayout, setContentLayout] = useState<[number, number]>([0, 0])
    const [quantifierLayout, setQuantifierLayout] = useState<[number, number]>([
      0, 0,
    ])
    const [nameLayout, setNameLayout] = useState<[number, number]>([0, 0])

    const width = Math.max(contentLayout[0], quantifierLayout[0], nameLayout[0])
    const height =
      contentLayout[1] + 2 * Math.max(quantifierLayout[1], nameLayout[1])

    useEffect(() => {
      onLayout(index, [width, height])
    }, [width, height, index, onLayout])

    useUnmount(() => onLayout(index, [-1, -1]))

    const quantifier = getQuantifier(node)
    const name = getName(node)

    const contentX = x + (width - contentLayout[0]) / 2
    const contentY = y + (height - contentLayout[1]) / 2
    const centerX = x + width / 2
    const centerY = y + height / 2

    const handleContentLayout = useCallback(
      (index: number, layout: [number, number]) => setContentLayout(layout),
      [setContentLayout]
    )

    return (
      <Component
        {...(restProps as T)}
        index={index}
        x={contentX}
        y={contentY}
        node={node}
        onLayout={handleContentLayout}
      >
        {contentX !== x && (
          <MidConnect start={[x, centerY]} end={[contentX, centerY]} />
        )}
        {name && (
          <NameNode
            centerX={centerX}
            y={contentY - GRAPH_NAME_HEIGHT}
            name={name}
            onLayout={setNameLayout}
          />
        )}
        {quantifier && (
          <QuantifierNode
            x={centerX - quantifierLayout[0] / 2}
            y={contentY + contentLayout[1]}
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
  WithNameQuantifier.displayName = "WithNameQuantifier"
  return WithNameQuantifier
}
