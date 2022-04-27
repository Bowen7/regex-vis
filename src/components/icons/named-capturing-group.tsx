import React from "react"
import { useTheme } from "@geist-ui/core"

const NamedCapturingGroup = () => {
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
        <rect x="1" y="1" width="35" height="15" rx="5" strokeWidth="1.5" />
        <path d="M15.2129 10.5977H13.9004L13.4551 13H12.4707L12.916 10.5977H11.5625V9.67188H13.0918L13.4316 7.83789H12.0078V6.90625H13.6074L14.0645 4.46875H15.043L14.5859 6.90625H15.9043L16.3613 4.46875H17.3398L16.8828 6.90625H18.1016V7.83789H16.707L16.3672 9.67188H17.6621V10.5977H16.1914L15.7461 13H14.7676L15.2129 10.5977ZM14.0762 9.67188H15.3887L15.7285 7.83789H14.416L14.0762 9.67188ZM23.9668 11.0137H20.6621L19.9707 13H18.4297L21.6523 4.46875H22.9824L26.2109 13H24.6641L23.9668 11.0137ZM21.0781 9.81836H23.5508L22.3145 6.2793L21.0781 9.81836Z" />
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

export default NamedCapturingGroup
