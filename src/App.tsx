import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <Router>
        <div className="h-screen w-screen flex flex-col">
          <Header />
          <Routes />
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}
