import { memo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from '@/components/language-select'
import { ModeToggle } from '@/components/mode-toggle'
import { Logo } from '@/components/logo'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return clsx('transition-colors hover:text-foreground/80', isActive ? 'text-foreground' : 'text-foreground/60')
}

const Header = memo(() => {
  const { t } = useTranslation()
  return (
    <header className="h-[64px] flex items-center justify-between border-b">
      <Link to="/" className="ml-9">
        <div className="flex items-end">
          <Logo width={32} height={32} className="mr-4" />
          <span className="font-bold">Regex Vis</span>
        </div>
      </Link>
      <div className="flex space-x-8 items-center text-sm mr-9">
        <NavLink
          to="/"
          className={navLinkClassName}
        >
          {t('Home')}
        </NavLink>
        <NavLink
          to="/samples"
          className={navLinkClassName}
        >
          {t('Samples')}
        </NavLink>
        <a
          href="https://github.com/Bowen7/regex-vis"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/60"
        >
          Github
        </a>
        <LanguageSelect />
        <ModeToggle />
      </div>
    </header>
  )
})

export default Header
