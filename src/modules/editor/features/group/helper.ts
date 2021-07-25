export const groupData = [
  {
    value: "nonGroup",
    label: "Cancel the Group",
  },
  {
    value: "capturing",
    label: "Capturing Group",
    tip: "(x): Matches x and remembers the match",
  },
  {
    value: "nonCapturing",
    label: "Non-capturing group",
    tip: `(?:x): Matches "x" but does not remember the match`,
  },
  {
    value: "namedCapturing",
    label: "Named capturing group",
    tip: `(?<Name>x): Matches "x" and stores it on the groups property of the returned matches under the name specified by <Name>`,
  },
]
