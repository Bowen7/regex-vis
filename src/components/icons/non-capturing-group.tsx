import React from "react"
import { useTheme } from "@geist-ui/core"

const NonCapturingGroup = () => {
  const { palette } = useTheme()
  return (
    <>
      <svg
        width="37"
        height="17"
        viewBox="0 0 37 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="35"
          height="15"
          rx="5"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      <style jsx>{`
        rect {
          stroke: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default NonCapturingGroup
