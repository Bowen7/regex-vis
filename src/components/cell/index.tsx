import React from "react"
type Props = {
  label: string
}

const Cell: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <div className="container">
        <span className="label">{label}</span>
        <div>{children}</div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 15px;
        }
        .label {
          font-size: 12px;
          font-weight: 500;
          cursor: default;
          margin-right: 10px;
        }
      `}</style>
    </>
  )
}

export default Cell
