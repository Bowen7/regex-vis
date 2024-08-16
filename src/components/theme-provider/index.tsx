import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// credit: pacocoursey/next-themes
// https://github.com/pacocoursey/next-themes/blob/bf0c5a45eaf6fb2b336a6b93840e4ec572bc08c8/next-themes/src/index.tsx#L218-L236
const disableTransition = () => {
  const css = document.createElement('style')
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  )
  document.head.appendChild(css)

  return () => {
    // Force restyle
    ;(() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }
}

export function ThemeProvider({
  children,
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light',
  )

  useLayoutEffect(() => {
    const root = window.document.documentElement
    const enableTransition = disableTransition()
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    enableTransition()
  }, [theme])

  const value = useMemo(() => ({
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }), [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
