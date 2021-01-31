import React from "react"
import { NavLink } from "react-router-dom"
const activeStyle = {
  color: "#0070F3",
}
function Header() {
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
        </div>
      </header>
      <style jsx>{`
        header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
        }
        .logo {
          font-weight: bold;
        }
        .nav :global(a:not(:last-child)) {
          margin-right: 15px;
        }
        .nav :global(a) {
          color: rgb(102, 102, 102);
        }
      `}</style>
    </>
  )
}

export default Header
