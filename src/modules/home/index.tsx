import React from "react"
import Vis from "@/modules/vis"

const HomeProvider: React.FC<{}> = () => {
  return (
    <Vis
      defaultRegex={`/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+(a|b)/`}
    />
  )
}

export default HomeProvider
