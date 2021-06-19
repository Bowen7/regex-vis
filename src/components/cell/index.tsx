import React from "react"
import { useTheme } from "@geist-ui/react"

type ItemProps = {
  label: string
  space?: boolean
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
}
const Cell: React.FC<Props> & { Item: typeof CellItem } = ({
  label,
  children,
}) => {
  console.log(useTheme())
  return (
    <>
      <div className="container">
        <h5>{label}</h5>
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .container {
          margin-bottom: 30px;
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
