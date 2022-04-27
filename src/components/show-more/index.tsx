import React from "react"
import { useTheme } from "@geist-ui/core"
import { useLocalStorage } from "react-use"
import ChevronDown from "@geist-ui/icons/chevronDown"
type Props = {
  id: string
}
const ShowMore: React.FC<Props> = ({ id, children }) => {
  const { palette, expressiveness } = useTheme()
  const [expanded, setExpanded] = useLocalStorage(id, false)
  const handleClick = () => setExpanded(!expanded)
  return (
    <>
      {expanded && children}
      <div className="wrapper">
        <span className="btn" onClick={handleClick}>
          {expanded ? "show less" : "show more"}
          <ChevronDown size={12} className={expanded ? "expand" : ""} />
        </span>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn {
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: ${expressiveness.shadowSmall};
          color: ${palette.accents_5};
          font-size: 12px;
          cursor: pointer;
          user-select: none;
        }
        .btn:hover {
          color: ${palette.foreground};
          box-shadow: ${expressiveness.shadowMedium};
        }
        .btn :global(svg) {
          vertical-align: middle;
          margin-left: 2px;
          transition: transform 0.5s ease-out;
        }
        .btn :global(.expand) {
          transform: rotate(180deg);
        }
        .line {
          flex: 1;
          background: ${palette.accents_2};
          height: 1px;
        }
      `}</style>
    </>
  )
}

export default ShowMore
