import React from "react"
import { NavLink, Link } from "react-router-dom"
import { useTheme, Select } from "@geist-ui/core"
import Sun from "@geist-ui/icons/sun"
import Moon from "@geist-ui/icons/moon"
import { ReactComponent as LogoSvg } from "@/logo.svg"

type Props = {
  theme: string
  onThemeChange: (theme: string) => void
}
const Header: React.FC<Props> = ({ onThemeChange, theme }) => {
  const { palette } = useTheme()
  const activeStyle = {
    color: palette.success,
  }
  return (
    <>
      <header>
        <Link to="/">
          <div className="logo">
            <LogoSvg />
            <span>Regex-Vis</span>
          </div>
        </Link>
        <div className="nav">
          <NavLink to="/" exact activeStyle={activeStyle}>
            Home
          </NavLink>
          <NavLink to="/samples" activeStyle={activeStyle}>
            Samples
          </NavLink>
          {/* <NavLink to="/about" activeStyle={activeStyle}>
            About
          </NavLink> */}
          <a
            href="https://github.com/Bowen7/regex-vis"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          {/* <Select value="en" width="100px" disableMatchWidth scale={0.5}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="cn">简体中文</Select.Option>
          </Select> */}
          {theme === "dark" ? (
            <Moon
              size={18}
              onClick={() => onThemeChange("light")}
              color={palette.foreground}
            />
          ) : (
            <Sun
              size={18}
              onClick={() => onThemeChange("dark")}
              color={palette.foreground}
            />
          )}
        </div>
      </header>
      <style jsx>{`
        header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 24px 36px;
          height: 64px;
          border-bottom: 1px solid ${palette.accents_2};
        }
        .logo span {
          font-weight: bold;
          color: ${palette.foreground};
        }
        .logo :global(svg) {
          width: 32px;
          height: 32px;
          margin-right: 24px;
          vertical-align: bottom;
        }
        .logo :global(.fill-accents-8) {
          fill: ${palette.accents_8};
        }
        .logo :global(.stroke-accents-8) {
          stroke: ${palette.accents_8};
        }
        .logo :global(.fill-success) {
          fill: ${palette.success};
        }

        .nav :global(:not(:last-child)) {
          margin-right: 32px;
        }
        .nav :global(a) {
          color: ${palette.accents_4};
          font-size: 14px;
        }
        .nav :global(.select) {
          min-width: auto;
        }

        header :global(svg) {
          vertical-align: middle;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default Header
