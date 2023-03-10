import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import reportWebVitals from "./reportWebVitals"
import { sendToVercelAnalytics } from "./vitals"
import App from "./App"
import "./i18n"
import * as serviceWorker from "./serviceWorker"

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

const root = createRoot(document.getElementById("root")!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

reportWebVitals(sendToVercelAnalytics)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
