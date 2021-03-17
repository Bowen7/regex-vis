import React, { useRef, useState, useEffect } from "react"
import { RenderVirtualNode, Node } from "@/types"
import Traverse from "./traverse"
import SvgContainer from "./svgContainer"
import { useMainReducer } from "@/redux"
import parser from "@/parser"
import { nanoid } from "nanoid"
type Props = {
  regex: string
  onChange?: (regex: string) => void
}
const emptyArr: string[] = []
const Railroad: React.FC<Props> = ({ regex: propRegex, onChange }) => {
  const [
    { nodes: propNodes, selectedIds: propSelectedIds, activeId: propActiveId },
  ] = useMainReducer()

  const regex = useRef<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const traverse = useRef<Traverse>(new Traverse(canvasRef))

  const activeId = useRef<string>(nanoid())
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [rootRenderNode, setRootRenderNode] = useState<RenderVirtualNode>({
    type: "virtual",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    children: [],
  })

  useEffect(() => {
    if (propRegex !== regex.current) {
      regex.current = propRegex
      const nodes = parser.parse(propRegex)
      setNodes(nodes)
    }
  }, [propRegex])

  useEffect(() => {
    if (activeId.current !== propActiveId) {
      setSelectedIds(emptyArr)
      return
    }
    setNodes(propNodes)
    setSelectedIds(propSelectedIds)
  }, [propNodes, propActiveId, propSelectedIds])

  useEffect(() => {
    console.log(nodes)
    const rootRenderNode = traverse.current.render(nodes)
    const { width, height } = rootRenderNode
    regex.current = parser.gen(nodes)
    onChange && onChange(regex.current)
    setWidth(width)
    setHeight(height)
    setRootRenderNode(rootRenderNode)
  }, [onChange, nodes])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      />
      <SvgContainer
        width={width}
        height={height}
        rootRenderNode={rootRenderNode}
        selectedIds={selectedIds}
      />
    </>
  )
}

export default Railroad
