import React from "react"
const Divide: React.FC<{}> = () => {
  return (
    <>
      <span className="divide"></span>
      <style jsx>{`
        .divide {
          border-left: 1px solid #8c8c8c;
          margin: 0 1rem;
        }
      `}</style>
    </>
  )
}
export default Divide
