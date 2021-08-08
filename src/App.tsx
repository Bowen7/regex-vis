import React, { useState } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { GeistProvider, CssBaseline, useTheme } from "@geist-ui/react"
import Header from "@/modules/common/header"
import Routes from "./routes"
const defaultTheme = localStorage.getItem("theme") || "dark"
export default function App() {
  const [themeType, setThemeType] = useState(defaultTheme)
  const handleThemeChange = (themeType: string) => {
    setThemeType(themeType)
    localStorage.setItem("theme", themeType)
  }
  const { palette } = useTheme()
  return (
    <>
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <Router>
          <Header theme={themeType} onThemeChange={handleThemeChange} />
          <Switch>
            <Routes />
          </Switch>
        </Router>
      </GeistProvider>

      <style jsx global>{`
        ::selection {
          background: ${palette.successLight} !important;
          color: #fff !important;
        }
        body {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
            Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        }
        svg {
          user-select: none;
        }
      `}</style>
    </>
  )
}
