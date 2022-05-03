import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import App from "../src/App"

jest.useFakeTimers()
test("renders graph", async () => {
  await act(async () => {
    render(<App />)
  })
  const graphCount = screen.getAllByTestId("graph").length
  await act(async () => {
    const input = screen.getAllByTestId("regex-input")[0]
    fireEvent.change(input, { target: { value: "abc" } })
    jest.advanceTimersByTime(500)
  })
  expect(screen.getAllByTestId("graph").length).toBe(graphCount + 1)
})
