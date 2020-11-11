import React, { useEffect, useState } from "react"
import { Radio, Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, SingleNode, RootNode } from "@types"
import EditPanel from "../editPanel"
import { remove, insert } from "../flowchart/handler"
import Flowchart from "../flowchart"
import parser from "@parser"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
// const DEFAULT_REGEX = `/([.]{1,33333})(aa)/`
// const DEFAULT_REGEX = `/a|\\b/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [root, setRoot] = useState<RootNode>(parser.parse(DEFAULT_REGEX))
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const root = parser.parse(regex)
    setRoot(root)
  }
  function onRemove(nodes: Node[]) {
    // setRoot(remove(nodeMap, ids))
  }
  function onSelect(nodes: Node[]) {
    setSelectedNodes(nodes)
  }
  function onInsert(
    direction: "prev" | "next",
    type: "simple" | "choice" | "group"
  ) {
    // setNodeMap(insert(nodeMap, selectedIds, direction, type))
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Flowchart root={root} onRemove={onRemove} onSelect={onSelect} />
      </div>

      <EditPanel nodes={selectedNodes} onInsert={onInsert} />
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
