import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const onClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="inline-flex items-center justify-center rounded-md hover:bg-accent py-2 h-8 w-8 cursor-pointer" onClick={onClick}>
      {theme === 'dark' ? <MoonIcon className="absolute h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
    </div>
  )
}
