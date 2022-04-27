import React from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { GeistProvider, CssBaseline, useTheme } from "@geist-ui/core"
import Header from "@/modules/common/header"
import { useLocalStorage } from "react-use"
import Routes from "./routes"
let gtagLoaded = false
export default function App() {
  const [theme, setTheme] = useLocalStorage<string>("them", "dark")
  const handleThemeChange = (themeType: string) => {
    setTheme(themeType)
    localStorage.setItem("theme", themeType)
  }
  const { palette } = useTheme()
  if (process.env.NODE_ENV === "production") {
    if (!gtagLoaded) {
      gtagLoaded = true
      gtag("js", new Date())
      gtag("config", "G-17KCES62HF")
    }
  }
  return (
    <>
      <GeistProvider themeType={theme}>
        <CssBaseline />
        <Router>
          <Header theme={theme!} onThemeChange={handleThemeChange} />
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
        .tooltip-content {
          width: max-content !important;
        }
      `}</style>
    </>
  )
}
