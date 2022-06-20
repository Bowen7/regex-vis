import { render, screen, fireEvent, getByText } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import App from "../src/App"

jest.useFakeTimers()
test("renders graph after inputting", async () => {
  render(<App />)
  expect(screen.getAllByTestId("graph").length).toBe(13)

  await act(async () => {
    const input = screen.getAllByTestId("regex-input")[0]
    fireEvent.change(input, { target: { value: "abc" } })
    jest.advanceTimersByTime(500)
  })

  expect(screen.getAllByTestId("graph").length).toBe(14)
})

test("updates graph after editing", async () => {
  render(<App />)

  await act(async () => {
    const input = screen.getByTestId("regex-input")
    fireEvent.change(input, { target: { value: "abc" } })
    jest.advanceTimersByTime(500)

    fireEvent.click(getByText(screen.getAllByTestId("graph")[0], "abc"), {
      bubbles: true,
    })
  })

  await act(async () => {
    const input = screen
      .getByTestId("edit-tab")
      .querySelector("input[type='text']")
    fireEvent.change(input!, { target: { value: "abcd" } })
    jest.advanceTimersByTime(500)
  })

  expect((screen.getByTestId("regex-input") as HTMLInputElement).value).toBe(
    "abcd"
  )
  expect(
    getByText(screen.getAllByTestId("graph")[0], "abcd")
  ).toBeInTheDocument()
})
