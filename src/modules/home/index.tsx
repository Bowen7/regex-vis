import React, { useCallback } from "react"
import Railroad from "@/modules/railroad"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+(a|b)/`

const HomeProvider: React.FC<{}> = () => {
  const handleChange = useCallback((regex: string) => console.log(regex), [])
  return <Railroad regex={DEFAULT_REGEX} onChange={handleChange} />
}

export default HomeProvider
