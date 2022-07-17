import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import { AST } from "@/parser"
import { astAtom, redoStack, undoStack, selectedIdsAtom } from "../atoms"
import { redoAtom, undoAtom } from "../undo"
import { updateContentAtom } from "../content"

test("undo and redo", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: setUpdateContentAtom } = renderHook(() =>
    useSetAtom(updateContentAtom)
  )
  const { result: setSelectedIdsRef } = renderHook(() =>
    useSetAtom(selectedIdsAtom)
  )
  const { result: setUndoAtom } = renderHook(() => useSetAtom(undoAtom))
  const { result: setRedoAtom } = renderHook(() => useSetAtom(redoAtom))

  // reset redo stack and undo stack
  redoStack.length = 0
  undoStack.length = 0

  const ast1: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "2",
        type: "character",
        kind: "string",
        value: "foo",
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }

  const ast2: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "2",
        type: "character",
        kind: "string",
        value: "123",
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }

  act(() => {
    astAtomRef.current[1](ast1)
    setSelectedIdsRef.current(["2"])
  })

  act(() => {
    setUpdateContentAtom.current({ kind: "string", value: "123" })
  })

  expect(undoStack).toEqual([ast1])

  act(() => {
    setUndoAtom.current()
  })

  expect(astAtomRef.current[0]).toEqual(ast1)
  expect(undoStack).toEqual([])
  expect(redoStack).toEqual([ast2])

  act(() => {
    setRedoAtom.current()
  })

  expect(astAtomRef.current[0]).toEqual(ast2)
  expect(undoStack).toEqual([ast1])
  expect(redoStack).toEqual([])
})
