import React from "react"

function Legend() {
  return (
    <>
      <div className="container">
        <img src="/characters-dark.svg" alt="characters" />
      </div>
      <style jsx>{`
        .container {
          margin-top: 12px;
        }
      `}</style>
    </>
  )
}

export default Legend
