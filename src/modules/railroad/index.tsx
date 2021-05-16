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
    <SvgContainer
      rootRenderNode={rootRenderNode}
      selectedIds={selectedIds}
      minimum={minimum}
    />
  )
}

export default Railroad
