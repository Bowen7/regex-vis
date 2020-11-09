import React, { useEffect, useState } from "react"
import { Radio, Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, SingleNode, RootNode, NodeMap } from "@types"
import EditPanel from "../editPanel"
import { remove } from "../flowchart/handler"
import Flowchart from "../flowchart"
import parser from "@parser"
import gen from "../../parser/gen"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
// const DEFAULT_REGEX = `/([.]{1,33333})(aa)/`
// const DEFAULT_REGEX = `/a|\\b/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [value, setValue] = useState<string>("")
  const [nodeMap, setNodeMap] = useState<NodeMap>(parser.parse(DEFAULT_REGEX))

  useEffect(() => {
    let cur: number | null = 0
    let nodes: number[] = []
    while (cur !== null) {
      nodes.push(cur)
      const node = nodeMap.get(cur) as Node
      cur = node.next
    }
    setValue(gen(nodeMap, nodes))
    console.log(nodeMap)
  }, [nodeMap])
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
        <Flowchart nodeMap={nodeMap} root={0} onRemove={onRemove} />
      </div>

      <EditPanel />
      <div>{value}</div>
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
