import React from "react"
type Props = {
  label: string
}

const Cell: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <div className="container">
        <h5 className="label">{label}</h5>
        <div>{children}</div>
      </div>
      <style jsx>{`
        .container {
          margin-bottom: 25px;
        }
      `}</style>
    </>
  )
}

export default Cell
