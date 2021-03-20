import React, { lazy, Suspense, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { GeistProvider, CssBaseline, useTheme } from "@geist-ui/react"
import { colors } from "@/constants/style"
import Header from "./modules/common/header"
import Playground from "@/modules/playground"
import { MainProvider } from "@/redux"

const Home = lazy(() => import("./modules/home"))

export default function App() {
  const [themeType, setThemeType] = useState("light")
  console.log(useTheme())
  return (
    <>
      <GeistProvider themeType={themeType}>
        <Router>
          <CssBaseline />
          <MainProvider>
            <Header theme={themeType} onThemeChange={setThemeType} />
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/guide">
                  <p>Todo</p>
                </Route>
                <Route path="/samples">
                  <p>Todo</p>
                </Route>
                <Route path="/about">
                  <p>Todo</p>
                </Route>
                <Route path="/playground">
                  <Playground />
                </Route>
              </Switch>
            </Suspense>
          </MainProvider>
        </Router>
      </GeistProvider>

      <style jsx global>{`
        ::selection {
          selection: #3291ff;
          color: #fff !important;
        }
        body {
          color: ${colors.dark};
          box-sizing: border-box;
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
