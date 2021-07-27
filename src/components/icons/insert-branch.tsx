import React from "react"
import { useTheme } from "@geist-ui/react"

const InsertBranch = () => {
  const { palette } = useTheme()
  return (
    <>
      <svg
        width="24"
        height="22"
        viewBox="0 0 24 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="5"
          r="4"
          fill={palette.success}
          fillOpacity="0.6"
          strokeWidth="1.5"
        />
        <line y1="5" x2="8" y2="5" strokeWidth="2" />
        <line x1="16" y1="5" x2="24" y2="5" strokeWidth="2" />
        <circle cx="12" cy="17" r="4" strokeWidth="1.5" />
        <line y1="17" x2="8" y2="17" strokeWidth="2" />
        <line x1="16" y1="17" x2="24" y2="17" strokeWidth="2" />
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

export default InsertBranch
