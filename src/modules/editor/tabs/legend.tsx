import React from "react"
import LegendItem from "@/components/legend-item"

function Legend() {
  return (
    <>
      <div className="container">
        <LegendItem name="characters" desc="this is a desc" />
        <LegendItem name="selected" desc="this is a desc" />
      </div>
      <style jsx>{`
        .container {
          padding: 0 12px;
        }
      `}</style>
    </>
  )
}

export default Legend
