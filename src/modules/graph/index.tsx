import React, { useRef, useState, useEffect } from "react"
import { useTheme } from "@geist-ui/react"
import { RenderVirtualNode, Node } from "@/types"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { useMainReducer, MainActionTypes } from "@/redux"
import { useEffectOnce } from "@/utils/hooks"
import parser from "@/parser"
import { nanoid } from "nanoid"
type Props = {
  regex: string
  minimum?: boolean
  onMount?: (id: string, nodes: Node[]) => void
  onChange?: (regex: string) => void
}
const INITIAL_NODES: Node[] = []
const Graph: React.FC<Props> = ({
  regex: propRegex,
  minimum = false,
  onChange,
  onMount,
}) => {
  const { palette } = useTheme()
  const [
    { nodes: propNodes, selectedIds: propSelectedIds, activeId: propActiveId },
    dispatch,
  ] = useMainReducer()

  const regex = useRef<string>("")

  const id = useRef<string>(nanoid())
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [rootRenderNode, setRootRenderNode] = useState<RenderVirtualNode>({
    type: "virtual",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    children: [],
  })

  if (process.env.EXPORT && regex.current !== propRegex) {
    regex.current = propRegex
    setRootRenderNode(renderEngine.render(parser.parse(propRegex)))
  }

  useEffectOnce(() => {
    onMount && onMount(id.current, nodes)
  })

  useEffect(() => {
    if (propRegex !== regex.current) {
      regex.current = propRegex
      const nodes = parser.parse(propRegex)
      setNodes(nodes)
    }
  }, [propRegex, propActiveId])

  useEffect(() => {
    if (propActiveId === id.current) {
      dispatch({
        type: MainActionTypes.SET_ACTIVE_CHART,
        payload: { id: id.current, nodes, selectedIds: [] },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propActiveId])

  useEffect(() => {
    if (id.current !== propActiveId) {
      if (selectedIds.length > 0) {
        setSelectedIds([])
      }
      return
    }
    setNodes(propNodes)
    setSelectedIds(propSelectedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propNodes, propActiveId, propSelectedIds])

  useEffect(() => {
    if (nodes !== INITIAL_NODES) {
      const rootRenderNode = renderEngine.render(nodes)
      regex.current = parser.gen(nodes)
      onChange && onChange(regex.current)
      setRootRenderNode(rootRenderNode)
    }
  }, [onChange, nodes])

  return (
    <>
      <div className="graph">
        <SvgContainer
          rootRenderNode={rootRenderNode}
          selectedIds={selectedIds}
          minimum={minimum}
        />
      </div>
      <style jsx>{`
        .graph {
          display: inline-block;
        }
        .graph :global(svg) {
          border: 1px solid ${palette.accents_2};
          border-radius: 5px;
        }
        .graph :global(.box-fill) {
          fill: ${palette.success};
        }
        .graph :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.3;
        }
        .graph :global(.none-stroke) {
          stroke: none;
        }
        .graph :global(.stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 2px;
        }
        .graph :global(.thin-stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .graph :global(.second-stroke) {
          stroke: ${palette.accents_3};
          stroke-width: 2px;
        }
        .graph :global(.text) {
          fill: ${palette.foreground};
        }
        .graph :global(.fill) {
          fill: ${palette.background};
        }
        .graph :global(.transparent-fill) {
          fill: transparent;
        }
        .graph :global(.quote) {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default Graph
