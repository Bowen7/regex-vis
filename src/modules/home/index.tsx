import React, { useEffect, useState } from "react"
import { Radio, Input } from "@geist-ui/react"
import { Node, DragEvent, BasicNode, RootNode } from "@types"
import RegexFlow from "../flowchart"
import parser from "@parser"
function noop() {
  console.log(parser)
}
// const _id_seed_ = 0
// const defaultNodeMap = new Map<number, Node>()

// defaultNodeMap.set(0, {
//   id: 0,
//   type: "root",
//   prev: null,
//   next: 1,
//   text: "start",
// })
// defaultNodeMap.set(-1, {
//   id: -1,
//   type: "root",
//   prev: 7,
//   next: null,
//   text: "end",
// })
// defaultNodeMap.set(1, {
//   type: "basic",
//   id: 1,
//   body: {
//     type: "simple",
//     value: "111",
//     text: "111",
//   },
//   prev: 0,
//   next: 6,
// })
// defaultNodeMap.set(2, {
//   type: "basic",
//   id: 2,
//   body: {
//     type: "simple",
//     value: "222",
//     text: "222",
//   },
//   prev: 6,
//   next: 7,
// })
// defaultNodeMap.set(3, {
//   type: "basic",
//   id: 3,
//   body: {
//     type: "simple",
//     value: "333",
//     text: "333",
//   },
//   prev: 6,
//   next: 6,
// })
// defaultNodeMap.set(4, {
//   type: "basic",
//   id: 4,
//   body: {
//     type: "simple",
//     value: "444",
//     text: "444",
//   },
//   prev: 7,
//   next: 7,
// })
// defaultNodeMap.set(5, {
//   type: "basic",
//   id: 5,
//   body: {
//     type: "simple",
//     value: "555",
//     text: "55555",
//   },
//   prev: 7,
//   next: 7,
// })
// defaultNodeMap.set(6, {
//   type: "choice",
//   id: 6,
//   prev: 1,
//   next: -1,
//   branches: [2, 3],
// })
// defaultNodeMap.set(7, {
//   type: "choice",
//   id: 7,
//   prev: 2,
//   next: 6,
//   branches: [4, 5],
// })
const Home: React.FC<{}> = () => {
  useEffect(() => {
    // const regexFlow = new RegexFlow(startRoot, defaultNodeMap, {
    //   origin: {
    //     x: 0,
    //     y: 20,
    //   },
    //   width: 500,
    //   height: 500,
    // })
    // regexFlow.render()
    const nodeMap = parser.parse("/(aa|a)|cc/")
    console.log(nodeMap)
    const regexFlow = new RegexFlow("#svg", 0, nodeMap)
    regexFlow.render()
  }, [])

  return (
    <>
      <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
      <Radio.Group value="1" useRow size="small">
        <Radio value="1">字符串</Radio>
        <Radio value="2">字符范围</Radio>
      </Radio.Group>
      <Input placeholder="一个基础示例" />
    </>
  )
}

export default Home
