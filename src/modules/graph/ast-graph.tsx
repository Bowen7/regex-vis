import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom, useAtomValue } from 'jotai'
import clsx from 'clsx'
import RootNodes from './root-nodes'
import Nodes from './nodes'
import type {
  NodeSize,
} from './measure'
import {
  getBoxSize,
  largerWithMinSize,
  measureSimpleNode,
} from './measure'
import { isPrimaryGraphAtom, sizeMapAtom } from '@/atom'
import type { AST } from '@/parser'
import { lrd } from '@/parser'
import {
  GRAPH_CHOICE_PADDING_HORIZONTAL,
  GRAPH_CHOICE_PADDING_VERTICAL,
  GRAPH_GROUP_NODE_PADDING_VERTICAL,
  GRAPH_NODE_MARGIN_HORIZONTAL,
  GRAPH_NODE_MARGIN_VERTICAL,
  GRAPH_PADDING_HORIZONTAL,
  GRAPH_PADDING_VERTICAL,
  GRAPH_ROOT_RADIUS,
  GRAPH_WITHOUT_ROOT_PADDING_HORIZONTAL,
  GRAPH_WITHOUT_ROOT_PADDING_VERTICAL,
} from '@/constants'

type Props = {
  ast: AST.Regex
}

function measureNodes(nodes: AST.Node[], sizeMap: Map<AST.Node | AST.Node[], NodeSize>): [number, number] {
  let width = 0
  let height = 0
  for (const node of nodes) {
    const { box: boxSize } = sizeMap.get(node)!
    width += boxSize[0]
    height = Math.max(height, boxSize[1])
  }
  width += Math.max(nodes.length - 1, 0) * GRAPH_NODE_MARGIN_HORIZONTAL
  return largerWithMinSize([width, height])
}

function measureBranches(branches: AST.Node[][], currentSizeMap: Map<AST.Node | AST.Node[], NodeSize>, nextSizeMap: Map<AST.Node | AST.Node[], NodeSize>): [number, number] {
  let width = 0
  let height = 0
  for (const branch of branches) {
    const branchSize = currentSizeMap.has(branch)
      ? currentSizeMap.get(branch)!.box
      : measureNodes(branch, nextSizeMap)
    nextSizeMap.set(branch, { box: branchSize, content: branchSize })
    width = Math.max(width, branchSize[0])
    height += branchSize[1]
  }
  height
    += Math.max(branches.length - 1, 0) * GRAPH_NODE_MARGIN_VERTICAL
    + 2 * GRAPH_CHOICE_PADDING_VERTICAL
  width += 2 * GRAPH_CHOICE_PADDING_HORIZONTAL
  return largerWithMinSize([width, height])
}

const ASTGraph = React.memo(({ ast }: Props) => {
  const isPrimaryGraph = useAtomValue(isPrimaryGraphAtom)
  const [sizeMap, setSizeMap] = useAtom(sizeMapAtom)
  const [size, setSize] = useState<[number, number]>([0, 0])
  const [currentAST, setCurrentAST] = useState<AST.Regex | null>(null)
  const { i18n } = useTranslation()
  const { language } = i18n
  const languageRef = useRef(language)

  // sizeMapRef, isPrimaryGraphRef always points to the latest value
  const sizeMapRef = useRef(sizeMap)
  const isPrimaryGraphRef = useRef(isPrimaryGraph)
  sizeMapRef.current = sizeMap
  isPrimaryGraphRef.current = isPrimaryGraph

  const paddingH = isPrimaryGraph
    ? GRAPH_PADDING_HORIZONTAL
    : GRAPH_WITHOUT_ROOT_PADDING_HORIZONTAL
  const paddingV = isPrimaryGraph
    ? GRAPH_PADDING_VERTICAL
    : GRAPH_WITHOUT_ROOT_PADDING_VERTICAL

  useEffect(() => {
    const languageChanged = languageRef.current !== language
    // if language changed, we need to re-measure all nodes
    const currentSizeMap = languageChanged
      ? new Map<AST.Node | AST.Node[], NodeSize>()
      : sizeMapRef.current
    const nextSizeMap = new Map<AST.Node | AST.Node[], NodeSize>()

    lrd(ast, (node: AST.Node | AST.Regex) => {
      if (node.type !== 'regex' && currentSizeMap.has(node)) {
        nextSizeMap.set(node, currentSizeMap.get(node)!)
        if (node.type === 'choice') {
          const { branches } = node
          branches.forEach((branch) => {
            nextSizeMap.set(branch, currentSizeMap.get(branch)!)
          })
          return
        } else if (
          node.type === 'group'
          || node.type === 'lookAroundAssertion'
        ) {
          const { children } = node
          nextSizeMap.set(children, currentSizeMap.get(children)!)
          return
        }
        return
      }
      switch (node.type) {
        case 'regex': {
          const bodySize = measureNodes(node.body, nextSizeMap)
          nextSizeMap.set(node.body, { box: bodySize, content: bodySize })
          if (isPrimaryGraphRef.current) {
            const width
              = bodySize[0]
              + GRAPH_PADDING_HORIZONTAL * 2
              + GRAPH_ROOT_RADIUS * 4
              + GRAPH_NODE_MARGIN_HORIZONTAL * 2
            const height = bodySize[1] + GRAPH_PADDING_VERTICAL * 2
            setSize([width, height])
          } else {
            const width
              = bodySize[0] + GRAPH_WITHOUT_ROOT_PADDING_HORIZONTAL * 2
            const height = bodySize[1] + GRAPH_WITHOUT_ROOT_PADDING_VERTICAL * 2
            setSize([width, height])
          }
          break
        }
        case 'group':
        case 'lookAroundAssertion': {
          const { children } = node
          const childrenSize = currentSizeMap.has(children)
            ? currentSizeMap.get(children)!.box
            : measureNodes(children, nextSizeMap)
          nextSizeMap.set(children, {
            box: childrenSize,
            content: childrenSize,
          })
          const contentSize: [number, number] = [
            childrenSize[0] + GRAPH_NODE_MARGIN_HORIZONTAL * 2,
            childrenSize[1] + GRAPH_GROUP_NODE_PADDING_VERTICAL * 2,
          ]
          const boxSize = getBoxSize(node, contentSize)
          nextSizeMap.set(node, { box: boxSize, content: contentSize })
          break
        }
        case 'choice': {
          const branchesSize = measureBranches(
            node.branches,
            currentSizeMap,
            nextSizeMap,
          )
          nextSizeMap.set(node, { box: branchesSize, content: branchesSize })
          break
        }
        case 'character':
        case 'backReference':
        case 'boundaryAssertion': {
          const size = measureSimpleNode(node)
          nextSizeMap.set(node, size)
          break
        }
        default: {
          break
        }
      }
    })

    languageRef.current = language
    setSizeMap(nextSizeMap)
    setCurrentAST(ast)
  }, [ast, language, setSizeMap])

  const nodesX = isPrimaryGraph
    ? paddingH + GRAPH_NODE_MARGIN_HORIZONTAL + GRAPH_ROOT_RADIUS * 2
    : paddingH

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size[0]}
      height={size[1]}
      data-testid="graph"
      className={clsx('rounded-lg select-none [&_div]:pointer-events-none font-mono', { border: isPrimaryGraph })}
    >
      {currentAST && (
        <>
          {isPrimaryGraph && (
            <RootNodes
              x={paddingH}
              width={size[0] - 2 * paddingH}
              centerY={size[1] / 2}
            />
          )}
          <Nodes
            x={nodesX}
            y={paddingV}
            nodes={currentAST.body}
            id={ast.id}
            index={0}
          />
        </>
      )}
    </svg>
  )
})
ASTGraph.displayName = 'ASTGraph'

export default ASTGraph
