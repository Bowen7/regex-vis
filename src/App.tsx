import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from "./modules/common/header"
import Footer from "./modules/common/footer"
import Playground from "@/modules/playground"

const Home = lazy(() => import("./modules/home"))

export default function App() {
  return (
    <Router>
      <>
        <Header />
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
        <Footer/>
      </>
    </Router>
  )
}
