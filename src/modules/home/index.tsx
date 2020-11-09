import React, { useEffect, useState } from "react"
import { Radio, Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, SingleNode, RootNode, NodeMap } from "@types"
import EditPanel from "../editPanel"
import { remove, insert } from "../flowchart/handler"
import Flowchart from "../flowchart"
import parser from "@parser"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
// const DEFAULT_REGEX = `/([.]{1,33333})(aa)/`
// const DEFAULT_REGEX = `/a|\\b/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [nodeMap, setNodeMap] = useState<NodeMap>(parser.parse(DEFAULT_REGEX))
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const nodeMap = parser.parse(regex)
    setNodeMap(nodeMap)
  }
  function onRemove(ids: number[]) {
    setNodeMap(remove(nodeMap, ids))
  }
  function onSelect(ids: number[]) {
    setSelectedIds(ids)
  }
  function onInsert(
    direction: "prev" | "next",
    type: "simple" | "choice" | "group"
  ) {
    setNodeMap(insert(nodeMap, selectedIds, direction, type))
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Flowchart
          nodeMap={nodeMap}
          root={0}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      </div>

      <EditPanel nodeMap={nodeMap} ids={selectedIds} onInsert={onInsert} />
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
