import React from "react"
type Props = {
  label: string
}

const Cell: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <div className="container">
        <h6 className="label">{label}</h6>
        <div>{children}</div>
      </div>
      <style jsx>{`
        .container {
          margin-bottom: 30px;
        }
      `}</style>
    </>
  )
}

export default Cell
