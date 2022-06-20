import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import { selectedIdsAtom } from "../atoms"
import { clearSelectedAtom } from "../select"
jest.mock("nanoid")

test("clear selected", async () => {
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setClearSelectedRef } = renderHook(() =>
    useSetAtom(clearSelectedAtom)
  )

  act(() => {
    selectedIdsAtomRef.current[1](["1"])
  })

  act(() => {
    setClearSelectedRef.current()
  })

  expect(selectedIdsAtomRef.current[0]).toEqual([])
})
