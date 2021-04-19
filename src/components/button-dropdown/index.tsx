import React from "react"
import { useTheme } from "@geist-ui/react"
import { ChevronDown } from "@geist-ui/react-icons"
const ButtonDropdownItem: React.FC<Prop> = ({ children }) => {
  const { palette } = useTheme()
  return (
    <>
      <button>{children}</button>
      <style jsx>{`
        button {
          position: relative;
          -webkit-appearance: button;
          text-rendering: auto;
          display: inline-flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          box-sizing: border-box;
          margin: 0;
          border: none;
          background-color: ${palette.background};
          color: ${palette.accents_5};
          width: 100%;
        }
        button:hover {
          border-color: ${palette.accents_2};
          background-color: ${palette.accents_1};
        }
      `}</style>
    </>
  )
}

type Prop = {}
const ButtonDropdown: React.FC<Prop> & { Item: typeof ButtonDropdownItem } = ({
  children,
}) => {
  const { palette, layout, expressiveness } = useTheme()
  let mainItem!: JSX.Element
  const itemsWithoutMain = React.Children.map(children, (item) => {
    if (!React.isValidElement(item)) return item
    if (!mainItem && item.type === ButtonDropdownItem) {
      mainItem = item
      return null
    }
    return item
  })
  return (
    <>
      <div className="btn-dropdown">
        <div className="main-btn">{mainItem}</div>
        <details>
          <summary>
            <ChevronDown size={18} />
          </summary>
          <div className="content">{itemsWithoutMain}</div>
        </details>
      </div>
      <style jsx>{`
        .btn-dropdown {
          border: 1px solid ${palette.border};
          border-radius: ${layout.radius};
          display: inline-flex;
          position: relative;
        }

        .main-btn > :global(button) {
          width: 186px;
          height: calc(1.687 * 16pt);
          border-radius: ${layout.radius} 0 0 ${layout.radius};
        }

        details {
          border-radius: 0 ${layout.radius} ${layout.radius} 0;
        }

        summary {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          list-style: none;
          outline: none;
          color: ${palette.accents_5};
          background-color: ${palette.background};
          height: calc(1.687 * 16pt);
          border-left: 1px solid ${palette.accents_2};
          border-top-right-radius: ${layout.radius};
          border-bottom-right-radius: ${layout.radius};
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          width: auto;
          padding: 0 6px;
          transition: background 0.2s ease 0s, border-color 0.2s ease 0s;
        }

        summary:hover {
          border-color: ${palette.accents_2};
          background-color: ${palette.accents_1};
        }

        .content {
          position: absolute;
          right: 0;
          left: 0;
          z-index: 90;
          width: 100%;
          border-radius: ${layout.radius};
          box-shadow: ${expressiveness.shadowLarge};
          transform: translateY(${layout.gapHalf});
          background-color: ${palette.background};
        }
        .content > :global(button:first-of-type) {
          border-top-left-radius: ${layout.radius};
          border-top-right-radius: ${layout.radius};
        }
        .content > :global(button:last-of-type) {
          border-bottom-left-radius: ${layout.radius};
          border-bottom-right-radius: ${layout.radius};
        }
      `}</style>
    </>
  )
}

ButtonDropdown.Item = ButtonDropdownItem

export default ButtonDropdown
