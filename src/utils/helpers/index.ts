export function genPermalink(tests: string[] = []) {
  const url = new URL(window.location.href)
  if (tests.length > 0) {
    url.searchParams.set('t', JSON.stringify(tests))
  }
  return url.toString()
}
