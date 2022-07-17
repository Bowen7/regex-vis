export const genPermalink = (
  escapeBackslash: boolean,
  tests: string[] = []
) => {
  const url = new URL(window.location.href)
  if (escapeBackslash) {
    url.searchParams.set("e", "1")
  } else {
    url.searchParams.set("e", "0")
  }
  if (tests.length > 0) {
    url.searchParams.set("t", JSON.stringify(tests))
  }
  return url.toString()
}
