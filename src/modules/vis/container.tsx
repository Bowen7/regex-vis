import React, { useContext } from "react"
import { Input, Button } from "@geist-ui/react"
import { Node, GroupKind } from "@/types"
import VisContext from "./context"
import { ActionTypes } from "@/reducers/vis"
import Editor from "./editor"
import Railroad from "./railroad"
import parser from "@/parser"

const Container: React.FC<{}> = React.memo(() => {
  const {
    state: { nodes, selectedNodes, regex },
    dispatch,
  } = useContext(VisContext)

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: ActionTypes.SET_REGEX,
      payload: { regex: e.target.value },
    })
  }
  function handleRenderClick() {
    const nodes = parser.parse(regex)
    dispatch({ type: ActionTypes.SET_NODES, payload: { nodes } })
  }
  function onRemove() {
    dispatch({ type: ActionTypes.REMOVE })
  }
  function onSelect(selectedNodes: Node[]) {
    dispatch({ type: ActionTypes.SET_SELECTED, payload: { selectedNodes } })
  }
  function onInsert(direction: "prev" | "next" | "branch") {
    dispatch({ type: ActionTypes.INSERT, payload: { direction } })
  }
  function onGroup(type: string, name: string) {
    dispatch({
      type: ActionTypes.GROUP,
      payload: { groupType: type as GroupKind | "nonGroup" },
    })
  }
  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Railroad
          nodes={nodes}
          onSelect={onSelect}
          selectedNodes={selectedNodes}
        />
      </div>

      <Editor
        nodes={selectedNodes}
        onInsert={onInsert}
        onRemove={onRemove}
        onGroup={onGroup}
        onRedo={() => dispatch({ type: ActionTypes.REDO })}
        onUndo={() => dispatch({ type: ActionTypes.UNDO })}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
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
})

export default Container
