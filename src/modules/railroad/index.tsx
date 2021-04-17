import React, { useRef, useState, useEffect } from "react"
import { RenderVirtualNode, Node } from "@/types"
import Traverse from "./traverse"
import SvgContainer from "./svgContainer"
import { useMainReducer, MainActionTypes } from "@/redux"
import { useEffectOnce } from "@/utils/hooks"
import parser from "@/parser"
import { nanoid } from "nanoid"
type Props = {
  regex: string
  onMount?: (id: string, nodes: Node[]) => void
  onChange?: (regex: string) => void
}
const Railroad: React.FC<Props> = ({ regex: propRegex, onChange, onMount }) => {
  const [
    { nodes: propNodes, selectedIds: propSelectedIds, activeId: propActiveId },
    dispatch,
  ] = useMainReducer()

  const regex = useRef<string>(propRegex)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const traverse = useRef<Traverse>(new Traverse(canvasRef))

  const id = useRef<string>(nanoid())
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [rootRenderNode, setRootRenderNode] = useState<RenderVirtualNode>({
    type: "virtual",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    children: [],
  })

  useEffectOnce(() => {
    onMount && onMount(id.current, nodes)
  })

  useEffect(() => {
    if (propRegex !== regex.current) {
      regex.current = propRegex
      const nodes = parser.parse(propRegex)
      setNodes(nodes)
      if (propActiveId === id.current) {
        dispatch({
          type: MainActionTypes.SET_ACTIVE_CHART,
          payload: { id: id.current, nodes, selectedIds: [] },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propRegex, propActiveId])

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
    const rootRenderNode = traverse.current.render(nodes)
    regex.current = parser.gen(nodes)
    onChange && onChange(regex.current)
    setRootRenderNode(rootRenderNode)
  }, [onChange, nodes])

  return (
    <>
      {/* for measureText */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      />
      <SvgContainer rootRenderNode={rootRenderNode} selectedIds={selectedIds} />
    </>
  )
}

export default Railroad
