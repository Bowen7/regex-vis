import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <Router>
          <div className="h-screen w-screen flex flex-col">
            <Header />
            <Routes />
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
      {/* <style jsx global>{`
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
      `}</style> */}
    </>
  )
}
