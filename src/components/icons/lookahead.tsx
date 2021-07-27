import React from "react"
import { useTheme } from "@geist-ui/react"

const Lookahead = () => {
  const { palette } = useTheme()
  return (
    <>
      <svg
        width="51"
        height="20"
        viewBox="0 0 51 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="13" cy="10" r="4" strokeWidth="1.5" />
        <circle
          cx="33"
          cy="10"
          r="4"
          fill={palette.success}
          fill-opacity="0.6"
          strokeWidth="1.5"
        />
        <line y1="10" x2="9" y2="10" strokeWidth="2" />
        <line x1="37" y1="10" x2="51" y2="10" strokeWidth="2" />
        <line x1="17" y1="10" x2="29" y2="10" strokeWidth="2" />
        <rect x="24" y="1" width="18" height="18" rx="5" strokeWidth="1.5" />
      </svg>

      <style jsx>{`
        circle,
        line,
        rect {
          stroke: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default Lookahead
