import * as AST from "../ast"
import { visit, visitNodes, getNodeById, getNodesByIds, lrd } from "../visit"

const node9: AST.Node = {
  id: "9",
  type: "character",
  kind: "string",
  value: ".",
  quantifier: null,
}
const node10: AST.Node = {
  id: "10",
  type: "character",
  kind: "ranges",
  ranges: [{ from: "0", to: "9" }],
  negate: false,
  quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
}
const node11: AST.Node = { id: "11", type: "boundaryAssertion", kind: "end" }
const node8: AST.Node = {
  id: "8",
  type: "group",
  kind: "capturing",
  name: "2",
  index: 2,
  children: [node9, node10],
  quantifier: { kind: "?", min: 0, max: 1, greedy: true },
}
const node5: AST.Node = {
  id: "5",
  type: "character",
  kind: "ranges",
  ranges: [{ from: "1", to: "9" }],
  negate: false,
  quantifier: null,
}
const node6: AST.Node = {
  id: "6",
  type: "character",
  kind: "ranges",
  ranges: [{ from: "0", to: "9" }],
  negate: false,
  quantifier: {
    kind: "*",
    min: 0,
    max: Infinity,
    greedy: true,
  },
}
const node7: AST.Node = {
  id: "7",
  type: "character",
  kind: "string",
  value: "0",
  quantifier: null,
}
const node4: AST.Node = {
  id: "4",
  type: "choice",
  branches: [[node5, node6], [node7]],
}
const node3: AST.Node = {
  id: "3",
  type: "group",
  kind: "capturing",
  name: "1",
  index: 1,
  children: [node4],
  quantifier: null,
}
const node2: AST.Node = {
  id: "2",
  type: "character",
  kind: "string",
  value: "-",
  quantifier: { kind: "?", min: 0, max: 1, greedy: true },
}
const node1: AST.Node = {
  id: "1",
  type: "boundaryAssertion",
  kind: "beginning",
}

const ast: AST.Regex = {
  id: "0",
  type: "regex",
  body: [node1, node2, node3, node8, node11],
  flags: [],
  literal: true,
  escapeBackslash: false,
}

test("visit should be a preorder traversal", () => {
  const expected = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
  visit(ast, (node) => {
    expect(node.id).toBe(expected.shift())
  })
  expect(expected.length).toBe(0)
})

test("visit function can be broken out of the traversal", () => {
  const expected = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
  visit(ast, (node) => {
    expect(node.id).toBe(expected.shift())
    if (node.id === "5") {
      return true
    }
  })
  expect(expected.length).toBe(6)
})

test("visitNodes should be a preorder traversal", () => {
  const expectedIds = ["0", "3", "4", "4", "8"]
  const expectedIndices = [0, 0, 0, 1, 0]
  const expectedNodes = [
    ["1", "2", "3", "8", "11"],
    ["4"],
    ["5", "6"],
    ["7"],
    ["9", "10"],
  ]
  visitNodes(ast, (id: string, index: number, nodes: AST.Node[]) => {
    expect(id).toBe(expectedIds.shift())
    expect(index).toBe(expectedIndices.shift())
    expect(nodes.map((n) => n.id)).toEqual(expectedNodes.shift())
  })
  expect(expectedIds.length).toBe(0)
})

test("visitNodes function can be broken out of the traversal", () => {
  const expectedIds = ["0", "3", "4", "4", "8"]
  const expectedIndices = [0, 0, 0, 1, 0]
  const expectedNodes = [
    ["1", "2", "3", "8", "11"],
    ["4"],
    ["5", "6"],
    ["7"],
    ["9", "10"],
  ]
  visitNodes(ast, (id: string, index: number, nodes: AST.Node[]) => {
    expect(id).toBe(expectedIds.shift())
    expect(index).toBe(expectedIndices.shift())
    expect(nodes.map((n) => n.id)).toEqual(expectedNodes.shift())
    if (id === "4") {
      return true
    }
  })
  expect(expectedIds.length).toBe(2)
})

test("getNodeById should return the correct node", () => {
  expect(getNodeById(ast, "9")).toEqual({
    node: node9,
    parent: node8,
    nodeList: node8.children,
    index: 0,
  })

  expect(getNodeById(ast, "6")).toEqual({
    node: node6,
    parent: node4,
    nodeList: [node5, node6],
    index: 1,
  })
})

test("getNodesByIds should return the correct nodes", () => {
  expect(getNodesByIds(ast, ["5", "6"])).toEqual({
    nodes: [node5, node6],
    parent: node4,
    nodeList: [node5, node6],
    index: 0,
  })

  expect(getNodesByIds(ast, ["3"])).toEqual({
    nodes: [node3],
    parent: ast,
    nodeList: ast.body,
    index: 2,
  })
})

test("lrd should be a postorder traversal", () => {
  const expected = [
    "1",
    "2",
    "5",
    "6",
    "7",
    "4",
    "3",
    "9",
    "10",
    "8",
    "11",
    "0",
  ]
  lrd(ast, (node) => {
    expect(node.id).toBe(expected.shift())
  })
  expect(expected.length).toBe(0)
})
