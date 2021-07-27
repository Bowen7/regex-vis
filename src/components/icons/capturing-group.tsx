import React from "react"
import { useTheme } from "@geist-ui/react"

const CapturingGroup = () => {
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
        <rect x="1" y="1" width="35" height="15" rx="5" stroke-width="2" />
        <path d="M16.2129 10.5977H14.9004L14.4551 13H13.4707L13.916 10.5977H12.5625V9.67188H14.0918L14.4316 7.83789H13.0078V6.90625H14.6074L15.0645 4.46875H16.043L15.5859 6.90625H16.9043L17.3613 4.46875H18.3398L17.8828 6.90625H19.1016V7.83789H17.707L17.3672 9.67188H18.6621V10.5977H17.1914L16.7461 13H15.7676L16.2129 10.5977ZM15.0762 9.67188H16.3887L16.7285 7.83789H15.416L15.0762 9.67188ZM23.8184 13H22.4004V6.15039L20.3086 6.86523V5.66406L23.6367 4.43945H23.8184V13Z" />
      </svg>

      <style jsx>{`
        rect {
          stroke: ${palette.accents_4};
        }
        path {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default CapturingGroup
