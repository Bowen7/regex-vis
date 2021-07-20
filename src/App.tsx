import React, { useState } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { GeistProvider, CssBaseline, useTheme } from "@geist-ui/react"
import Header from "@/modules/common/header"
import { font } from "@/constants/style"
import Routes from "./routes"
import { MainProvider } from "@/redux"
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
        <MainProvider>
          <Router>
            <Header theme={themeType} onThemeChange={handleThemeChange} />
            <Switch>
              <Routes />
            </Switch>
          </Router>
        </MainProvider>
      </GeistProvider>

      <style jsx global>{`
        ::selection {
          background: ${palette.successLight} !important;
          color: #fff !important;
        }
        body {
          box-sizing: border-box;
          font-family: ${font.family};
        }

        svg {
          user-select: none;
        }

        .max-z-index {
          z-index: 1200 !important;
        }

        button {
          vertical-align: middle;
        }
      `}</style>
    </>
  )
}
