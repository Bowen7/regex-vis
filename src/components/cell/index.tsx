import React from "react"
type Props = {
  label: string
}

const Cell: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <div className="container">
        <h6>{label}</h6>
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .container {
          margin-bottom: 30px;
        }
        .content {
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

export default Cell
