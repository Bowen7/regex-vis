import React from "react"
import { useTheme } from "@geist-ui/core"
import QuestionCircle from "@geist-ui/icons/questionCircle"
import mdnLinks, { MdnLinkKey } from "@/utils/links"

type ItemProps = {
  label: string
}
const CellItem: React.FC<ItemProps> = ({ label, children }) => {
  const { palette } = useTheme()
  return (
    <>
      <h6>{label}</h6>
      {children}
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
      `}</style>
    </>
  )
}

type Props = {
  label: string
  mdnLinkKey?: MdnLinkKey
  rightLabel?: string
  onRightLabelClick?: () => void
}
const Cell: React.FC<Props> & { Item: typeof CellItem } = ({
  label,
  mdnLinkKey,
  children,
  rightLabel,
  onRightLabelClick,
}) => {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <div className="title">
          <div className="left">
            <h5>{label}</h5>
            {mdnLinkKey && (
              <a href={mdnLinks[mdnLinkKey]} target="_blank" rel="noreferrer">
                <QuestionCircle size={16} />
              </a>
            )}
          </div>
          {rightLabel && (
            <span className="right" onClick={onRightLabelClick}>
              {rightLabel}
            </span>
          )}
        </div>
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .container:not(:last-of-type) {
          margin-bottom: 30px;
        }
        .title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 0.625rem;
        }
        h5 {
          margin: 0;
        }
        h5 + :global(a) {
          margin-left: 6px;
          cursor: pointer;
          color: ${palette.foreground};
          line-height: 0;
        }
        .left {
          display: flex;
          align-items: center;
        }
        .right {
          font-size: 0.75rem;
          color: ${palette.secondary};
          cursor: pointer;
        }

        .content {
          font-size: 14px;
        }

        .content > :global(h6:not(:first-of-type)) {
          margin-top: calc(7.625pt - 0.5px);
        }
      `}</style>
    </>
  )
}

Cell.Item = CellItem
export default Cell
