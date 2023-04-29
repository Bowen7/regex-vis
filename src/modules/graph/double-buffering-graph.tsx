import React, { memo, useCallback, useState } from "react"
import { useUpdateEffect } from "react-use"
import { useCurrentState } from "@/utils/hooks"
import { nanoid } from "nanoid"
import { AST } from "@/parser"
import SVGContainer from "./container"
type Props = {
  ast: AST.Regex
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

const DoubleBufferingGraph = memo(({ ast }: Props) => {
  const [initialBuffer] = useState<AstBuffer[]>(() => [{ id: nanoid(), ast }])
  const [buffers, setBuffers, buffersRef] =
    useCurrentState<AstBuffer[]>(initialBuffer)
  const [currentId, setCurrentId] = useState("")

  useUpdateEffect(() => {
    const nextBuffers = [buffersRef.current[0], { id: nanoid(), ast }]
    setBuffers(nextBuffers)
  }, [ast])

  const handleLayout = useCallback(
    (id: string) => {
      const lastBuffer = buffersRef.current[buffersRef.current.length - 1]
      if (id === lastBuffer.id) {
        setCurrentId(id)
        setBuffers([lastBuffer])
      }
    },
    [buffersRef, setBuffers]
  )

  return (
    <>
      {buffers.map(({ id, ast }) => (
        <SVGContainer key={id} ast={ast} />
      ))}
    </>
  )
})

DoubleBufferingGraph.displayName = "DoubleBufferingGraph"
export default DoubleBufferingGraph
