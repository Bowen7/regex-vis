import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from "./modules/common/header"
const Home = lazy(() => import("./modules/home"))
const Guide = lazy(() => import("./modules/guide"))

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/guide" component={Guide} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  )
}
