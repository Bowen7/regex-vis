import React, { useEffect, useState } from "react"
import { Radio, Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, BasicNode, RootNode, NodeMap } from "@types"
import { remove } from "../_flowchart/handler"
import Flowchart from "../_flowchart"
import parser from "@parser"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
// const DEFAULT_REGEX = `/a|b/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [nodeMap, setNodeMap] = useState<NodeMap>(parser.parse(DEFAULT_REGEX))

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const nodeMap = parser.parse(regex)
    setNodeMap(nodeMap)
  }
  function onRemove(ids: Set<number>) {
    setNodeMap(remove(nodeMap, Array.from(ids)))
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {/* <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg> */}
        <Flowchart nodeMap={nodeMap} root={0} onRemove={onRemove} />
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
