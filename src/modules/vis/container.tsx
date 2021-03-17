import React, { useContext } from "react"
import { Input, Button } from "@geist-ui/react"
import VisContext from "./context"
import { ActionTypes } from "@/redux/vis"
import Editor from "./editor"
// import Railroad from "./railroad"
import parser from "@/parser"

const Container: React.FC<{}> = React.memo(() => {
  const {
    state: { regex },
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

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  return (
    <>
      <div className="container">
        {/* <Railroad /> */}
        <Editor />
        <div>
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
      </div>
      <style jsx>
        {`
          .container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
})

export default Container
