import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import { AST } from "@/parser"
import { updateFlagsAtom } from "../flags"
import { astAtom } from "../atoms"

test("update flags", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: setUpdateFlagsAtom } = renderHook(() =>
    useSetAtom(updateFlagsAtom)
  )

  act(() => {
    astAtomRef.current[1]({
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
    })
  })

  act(() => {
    setUpdateFlagsAtom.current(["g", "i"])
  })

  const expected: AST.Regex = {
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
    flags: ["g", "i"],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
})
