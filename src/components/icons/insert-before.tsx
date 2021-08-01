import React from "react"
import { useTheme } from "@geist-ui/react"

const InsertBefore = () => {
  const { palette } = useTheme()
  return (
    <>
      <svg
        width="42"
        height="10"
        viewBox="0 0 42 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="5" r="4" strokeWidth="1.5" />
        <circle
          cx="30"
          cy="5"
          r="4"
          fill={palette.success}
          fillOpacity="0.6"
          strokeWidth="1.5"
        />
        <line y1="5" x2="8" y2="5" strokeWidth="2" />
        <line x1="34" y1="5" x2="42" y2="5" strokeWidth="2" />
        <line x1="16" y1="5" x2="26" y2="5" strokeWidth="2" />
      </svg>
      <style jsx>{`
        circle,
        line {
          stroke: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default InsertBefore
