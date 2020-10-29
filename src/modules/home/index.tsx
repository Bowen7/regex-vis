import React, { useEffect, useState } from "react"
import { Radio, Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, DragEvent, BasicNode, RootNode, NodeMap } from "@types"
import RegexFlow from "../flowchart"
import parser from "@parser"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [nodeMap, setNodeMap] = useState<NodeMap>(parser.parse(DEFAULT_REGEX))
  const [regexFlow, setRegexFlow] = useState<RegexFlow>()
  useEffect(() => {
    regexFlow?.render(nodeMap)
  }, [nodeMap, regexFlow])

  useEffect(() => {
    setRegexFlow(new RegexFlow("#svg", 0))
  }, [])

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const nodeMap = parser.parse(regex)
    setNodeMap(nodeMap)
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Repeat transform="rotate(90)" />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="输入正则"
          width="500px"
          value={regex}
          onChange={handleRegexChange}
        />
        <Button
          auto
          style={{
            marginLeft: "20px",
          }}
          onClick={handleRenderClick}
        >
          Render
        </Button>
      </div>
    </>
  )
}

export default Home
