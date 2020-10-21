import React, { useEffect, useState } from "react"
import produce from "immer"
import { Node, DragEvent, BasicNode, RootNode, startId, endId } from "@types"
import RegexFlow from "../regexFlow"
import Svgx from "../svgx"
import addSvg from "@assets/add.svg"

const _id_seed_ = 0
const defaultNodeMap = new Map<number, Node>()

defaultNodeMap.set(startId, {
  id: startId,
  type: "root",
  prev: null,
  next: 1,
  text: "start",
})
defaultNodeMap.set(endId, {
  id: endId,
  type: "root",
  prev: 7,
  next: null,
  text: "end",
})
defaultNodeMap.set(1, {
  type: "basic",
  id: 1,
  body: {
    type: "simple",
    value: "111",
    text: "111",
  },
  prev: startId,
  next: 6,
})
defaultNodeMap.set(2, {
  type: "basic",
  id: 2,
  body: {
    type: "simple",
    value: "222",
    text: "222",
  },
  prev: 6,
  next: 7,
})
defaultNodeMap.set(3, {
  type: "basic",
  id: 3,
  body: {
    type: "simple",
    value: "333",
    text: "333",
  },
  prev: 6,
  next: 6,
})
defaultNodeMap.set(4, {
  type: "basic",
  id: 4,
  body: {
    type: "simple",
    value: "444",
    text: "444",
  },
  prev: 7,
  next: 7,
})
defaultNodeMap.set(5, {
  type: "basic",
  id: 5,
  body: {
    type: "simple",
    value: "555",
    text: "55555",
  },
  prev: 7,
  next: 7,
})
defaultNodeMap.set(6, {
  type: "choice",
  id: 6,
  prev: 1,
  next: endId,
  branches: [2, 3],
})
defaultNodeMap.set(7, {
  type: "choice",
  id: 7,
  prev: 2,
  next: 6,
  branches: [4, 5],
})
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
    const regexFlow = new RegexFlow("#svg", startId, defaultNodeMap)
    regexFlow.render()
  }, [])

  return <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
}

export default Home
