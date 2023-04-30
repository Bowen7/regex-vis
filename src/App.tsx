import React, { Suspense } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { GeistProvider, CssBaseline, useTheme } from "@geist-ui/core"
import Header from "@/components/header"
import { useLocalStorage } from "react-use"
// webpack 4 don't support package exports, so we need to import the file directly
// @ts-ignore
import { Analytics } from "@vercel/analytics/dist/react"
import Routes from "./routes"

export default function App() {
  const [theme, setTheme] = useLocalStorage<string>("them", "dark")
  const handleThemeChange = (themeType: string) => {
    setTheme(themeType)
    localStorage.setItem("theme", themeType)
  }
  const { palette } = useTheme()
  return (
    <>
      <Suspense fallback={null}>
        <GeistProvider themeType={theme}>
          <CssBaseline />
          <Router>
            <Header theme={theme!} onThemeChange={handleThemeChange} />
            <Routes />
          </Router>
        </GeistProvider>
        <Analytics />
      </Suspense>
      <style jsx global>{`
        ::selection {
          background: ${palette.successLight} !important;
          color: #fff !important;
        }
        body {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
            Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
          color-scheme: ${theme};
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
