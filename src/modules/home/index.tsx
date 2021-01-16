import React, { useState } from "react"
import { Input, Button } from "@geist-ui/react"
import Repeat from "@geist-ui/react-icons/repeat"
import { Node, RootNode, Root, GroupKind } from "@types"
import Editor from "../editor"
import { remove, insert, group } from "../../parser/handler"
import Railroad from "../railroad"
import parser from "@parser"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+/`
// const DEFAULT_REGEX = `/([.]{1,33333})(aa)/`
// const DEFAULT_REGEX = `/a/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [root, _setRoot] = useState<Root>({ r: parser.parse(DEFAULT_REGEX) })
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])

  function setRoot(r: RootNode) {
    _setRoot({
      r,
    })
  }
  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const root = parser.parse(regex)
    setRoot(root)
  }
  function onRemove() {
    remove(root.r, selectedNodes)
    setRoot(root.r)
    onSelect([])
  }
  function onSelect(nodes: Node[]) {
    setSelectedNodes(nodes)
  }
  function onInsert(direction: "prev" | "next" | "parallel") {
    insert(root.r, selectedNodes, direction)
    setRoot(root.r)
  }
  function onGroup(type: string, name: string) {
    group(root.r, selectedNodes, type as GroupKind | "nonGroup", name)
    setRoot(root.r)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Railroad
          root={root}
          onSelect={onSelect}
          selectedNodes={selectedNodes}
        />
      </div>

      <Editor
        nodes={selectedNodes}
        onInsert={onInsert}
        onRemove={onRemove}
        onGroup={onGroup}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Repeat transform="rotate(90)" /> */}
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
          onKeyDown={onKeyDown}
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
