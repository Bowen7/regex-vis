import React, { useRef, useState, useEffect } from "react"
import { useTheme } from "@geist-ui/react"
import { RenderVirtualNode, Node } from "@/types"
import Traverse from "./traverse"
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
const Railroad: React.FC<Props> = ({
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
  const traverse = useRef<Traverse>(new Traverse(minimum))

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
    setRootRenderNode(traverse.current.render(parser.parse(propRegex)))
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
      const rootRenderNode = traverse.current.render(nodes)
      regex.current = parser.gen(nodes)
      onChange && onChange(regex.current)
      setRootRenderNode(rootRenderNode)
    }
  }, [onChange, nodes])

  return (
    <>
      <div className="railroad">
        <SvgContainer
          rootRenderNode={rootRenderNode}
          selectedIds={selectedIds}
          minimum={minimum}
        />
      </div>
      <style jsx>{`
        .railroad {
          display: inline-block;
        }
        .railroad :global(svg) {
          border: 1px solid ${palette.accents_2};
          border-radius: 5px;
        }
        .railroad :global(.selected-stroke) {
          stroke: ${palette.success};
        }
        .railroad :global(.virtual-stroke) {
          stroke: rgba(50, 145, 255, 0.5);
        }
        .railroad :global(.none-stroke) {
          stroke: none;
        }
        .railroad :global(.stroke) {
          stroke: ${palette.foreground};
        }
        .railroad :global(.selected-text) {
          fill: ${palette.success};
        }
        .railroad :global(.text) {
          fill: ${palette.foreground};
        }
        .railroad :global(.fill) {
          fill: ${palette.background};
        }
        .railroad :global(.transparent-fill) {
          fill: transparent;
        }
      `}</style>
    </>
  )
}

export default Railroad
