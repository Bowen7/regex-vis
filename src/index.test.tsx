import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders title", () => {
  render(<App />, { legacyRoot: true })
  const linkElement = screen.getByText(/Regex-Vis/i)
  expect(linkElement).toBeInTheDocument()
})
