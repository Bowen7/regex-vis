import React, { memo, useCallback, useState } from "react"
import { useUpdateEffect } from "react-use"
import { useCurrentState } from "@geist-ui/core"
import { nanoid } from "nanoid"
import { AST } from "@/parser"
import SVGContainer from "./container"
type Props = {
  ast: AST.Regex
  selectedIds?: string[]
}
type AstBuffer = {
  id: string
  ast: AST.Regex
}
const currentStyle = {}
const wipStyle: React.CSSProperties = {
  visibility: "hidden",
  pointerEvents: "none",
}

const DoubleBufferingGraph = memo(({ ast, selectedIds = [] }: Props) => {
  const [buffers, setBuffers, buffersRef] = useCurrentState<AstBuffer[]>(() => [
    { id: nanoid(), ast },
  ])
  const [currentId, setCurrentId] = useState("")

  useUpdateEffect(() => {
    const nextBuffers = [buffersRef.current[0], { id: nanoid(), ast }]
    setBuffers(nextBuffers)
  }, [ast])

  const handleLayout = useCallback((id: string) => {
    const lastBuffer = buffersRef.current[buffersRef.current.length - 1]
    if (id === lastBuffer.id) {
      setCurrentId(id)
      setBuffers([lastBuffer])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      {buffers.map(({ id, ast }) => (
        <SVGContainer
          key={id}
          ast={ast}
          selectedIds={selectedIds}
          style={id === currentId ? currentStyle : wipStyle}
          onLayout={handleLayout}
        />
      ))}
    </>
  )
})

DoubleBufferingGraph.displayName = "DoubleBufferingGraph"
export default DoubleBufferingGraph
