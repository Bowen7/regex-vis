import React from "react"
import { NavLink } from "react-router-dom"
import { Toggle, useTheme } from "@geist-ui/react"
import { ToggleEvent } from "@geist-ui/react/dist/toggle/toggle"
const activeStyle = {
  color: "#0070F3",
}
type Props = {
  theme: string
  onThemeChange: (theme: string) => void
}
const Header: React.FC<Props> = ({ onThemeChange, theme }) => {
  const handleThemeChange = (e: ToggleEvent) => {
    onThemeChange(e.target.checked ? "dark" : "light")
  }
  const { palette } = useTheme()
  return (
    <>
      <header>
        <span className="logo">Regex-Vis</span>
        <div className="nav">
          <NavLink to="/" exact activeStyle={activeStyle}>
            Home
          </NavLink>
          <NavLink to="/guide" activeStyle={activeStyle}>
            Guide
          </NavLink>
          <NavLink to="/samples" activeStyle={activeStyle}>
            Samples
          </NavLink>
          <NavLink to="/about" activeStyle={activeStyle}>
            About
          </NavLink>
          <a
            href="https://github.com/Bowen7/regex-vis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <Toggle checked={theme === "dark"} onChange={handleThemeChange} />
        </div>
      </header>
      <style jsx>{`
        header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 24px 36px;
          height: 72px;
          border-bottom: 1px solid ${palette.accents_2};
        }
        .logo {
          font-weight: bold;
        }
        .nav :global(a:not(:last-child)) {
          margin-right: 24px;
        }
        .nav :global(a) {
          color: rgb(102, 102, 102);
          font-size: 14px;
        }

        header :global(label) {
          vertical-align: middle;
        }

        header :global(.checked) {
          background-color: #000;
        }
      `}</style>
    </>
  )
}

export default Header
