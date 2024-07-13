import React from 'react'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import type { MdnLinkKey } from '@/utils/links'
import mdnLinks from '@/utils/links'

interface ItemProps {
  label: string
  children: React.ReactNode
}
function CellItem({ label, children }: ItemProps) {
  // const { palette } = useTheme()
  return (
    <>
      <h6>{label}</h6>
      {children}
      {/* <style jsx>
        {`
        h6 {
          color: ${palette.secondary};
        }
      `}
      </style> */}
    </>
  )
}

interface Props {
  label: string
  mdnLinkKey?: MdnLinkKey
  rightLabel?: string
  children: React.ReactNode
  onRightLabelClick?: () => void
}
function Cell({
  label,
  mdnLinkKey,
  children,
  rightLabel,
  onRightLabelClick,
}: Props) {
  // const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <div className="title">
          <div className="left">
            <h5>{label}</h5>
            {mdnLinkKey && (
              <a href={mdnLinks[mdnLinkKey]} target="_blank" rel="noreferrer">
                <QuestionMarkCircledIcon width={16} height={16} />
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
      {/* <style jsx>
        {`
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
          text-align: right;
        }

        .content {
          font-size: 14px;
        }

        .content > :global(h6:not(:first-of-type)) {
          margin-top: calc(7.625pt - 0.5px);
        }
      `}
      </style> */}
    </>
  )
}

Cell.Item = CellItem
export default Cell
