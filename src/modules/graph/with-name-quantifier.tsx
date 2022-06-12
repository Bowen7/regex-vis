import React, { useEffect, useState, useCallback, useRef } from "react"
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
  Props extends {
    index: number
    x: number
    y: number
    node: AST.Node
    onLayout: (index: number, layout: [number, number]) => void
    children: React.ReactNode
  }
>(
  Component: React.FC<Props>
) => {
  const WithNameQuantifier = (props: Omit<Props, "children">) => {
    const { index, x, y, node, onLayout, ...restProps } = props
    const quantifier = getQuantifier(node)
    const name = getName(node)

    const layout = useRef<[number, number]>([0, 0])
    const layoutedCount = useRef(0)
    const contentLayout = useRef<[number, number]>([0, 0])
    const quantifierLayout = useRef<[number, number]>([0, 0])
    const nameLayout = useRef<[number, number]>([0, 0])

    const contentX = x + (layout.current[0] - contentLayout.current[0]) / 2
    const contentY = y + (layout.current[1] - contentLayout.current[1]) / 2
    const centerX = x + layout.current[0] / 2
    const centerY = y + layout.current[1] / 2

    const handleLayout = useCallback(() => {
      const shouldLayoutCount = 1 + (name ? 1 : 0) + (quantifier ? 1 : 0)
      if (layoutedCount.current === shouldLayoutCount) {
        const width = Math.max(
          contentLayout.current[0],
          quantifierLayout.current[0],
          nameLayout.current[0]
        )
        const height =
          contentLayout.current[1] +
          2 * Math.max(quantifierLayout.current[1], nameLayout.current[1])
        onLayout(index, [width, height])
        layout.current = [width, height]
      }
    }, [index, name, quantifier, onLayout])

    const handleContentLayout = useCallback(
      (index: number, layout: [number, number]) => {
        contentLayout.current = layout
        layoutedCount.current++
        handleLayout()
      },
      [handleLayout]
    )

    const handleNameLayout = useCallback(
      (layout: [number, number]) => {
        nameLayout.current = layout
        layoutedCount.current++
        handleLayout()
      },
      [handleLayout]
    )

    const handleQuantifierLayout = useCallback(
      (layout: [number, number]) => {
        quantifierLayout.current = layout
        layoutedCount.current++
        handleLayout()
      },
      [handleLayout]
    )

    return (
      <Component
        {...(restProps as Props)}
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
            onLayout={handleNameLayout}
          />
        )}
        {quantifier && (
          <QuantifierNode
            x={centerX - quantifierLayout.current[0] / 2}
            y={contentY + contentLayout.current[1]}
            quantifier={quantifier}
            onLayout={handleQuantifierLayout}
          />
        )}
        {contentX !== x && (
          <MidConnect
            start={[contentX + contentLayout.current[0], centerY]}
            end={[x + layout.current[0], centerY]}
          />
        )}
      </Component>
    )
  }
  WithNameQuantifier.displayName = "WithNameQuantifier"
  return WithNameQuantifier
}
