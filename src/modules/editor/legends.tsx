import React from "react"
import MinimumGraph from "@/modules/graph/minimum-graph"

const legends = [
  {
    name: "Characters",
    infos: [
      {
        Icon: <MinimumGraph regex="abc" />,
        desc: "Direct match characters",
      },
    ],
  },
  {
    name: "Character classes",
    infos: [
      {
        Icon: <MinimumGraph regex={"\\d"} />,
        desc: "Distinguish different types of characters",
      },
    ],
  },
  {
    name: "Ranges",
    infos: [
      {
        Icon: <MinimumGraph regex="[a-z]" />,
        desc: "Matches any one of the enclosed characters",
      },
      {
        Icon: <MinimumGraph regex="[^a-z]" />,
        desc: "Matches anything that is not enclosed in the brackets",
      },
    ],
  },
  {
    name: "Choice",
    infos: [
      {
        Icon: <MinimumGraph regex="a|b" />,
        desc: `Matches either "x" or "y"`,
      },
    ],
  },
  {
    name: "Quantifier",
    infos: [
      {
        Icon: <MinimumGraph regex="a*" />,
        desc: "Indicate numbers of characters or expressions to match",
      },
    ],
  },
  {
    name: "Group",
    infos: [
      {
        Icon: <MinimumGraph regex="(x)" />,
        desc: "Matches x and remembers the match",
      },
      {
        Icon: <MinimumGraph regex="(?:x)" />,
        desc: `Matches "x" but does not remember the match`,
      },
      {
        Icon: <MinimumGraph regex="(?<Name>x)" />,
        desc: `Matches "x" and stores it on the groups property of the returned matches under the name specified by <Name>`,
      },
    ],
  },
  {
    name: "Back reference",
    infos: [
      {
        Icon: <MinimumGraph regex={"\\1"} />,
        desc: "A back reference to match group #1",
      },
      {
        Icon: <MinimumGraph regex={"\\k<name>"} />,
        desc: `A back reference to match group #Name`,
      },
    ],
  },
  {
    name: "Assertion",
    infos: [
      {
        Icon: <MinimumGraph regex="^" />,
        desc: "Matches the beginning of input",
      },
      {
        Icon: <MinimumGraph regex="x(?=y)" />,
        desc: `Matches "x" only if "x" is followed by "y"`,
      },
    ],
  },
]

export default legends
