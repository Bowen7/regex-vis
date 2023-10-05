import SimpleGraph from "@/modules/graph/simple-graph"

const legends = [
  {
    name: "Characters",
    infos: [
      {
        Icon: <SimpleGraph regex="abc" />,
        desc: "Direct match characters",
      },
    ],
  },
  {
    name: "Character classes",
    infos: [
      {
        Icon: <SimpleGraph regex={"\\d"} />,
        desc: "Distinguish different types of characters",
      },
    ],
  },
  {
    name: "Ranges",
    infos: [
      {
        Icon: <SimpleGraph regex="[a-z]" />,
        desc: "Matches any one of the enclosed characters",
      },
      {
        Icon: <SimpleGraph regex="[^a-z]" />,
        desc: "Matches anything that is not enclosed in the brackets",
      },
    ],
  },
  {
    name: "Choice",
    infos: [
      {
        Icon: <SimpleGraph regex="a|b" />,
        desc: `Matches either "x" or "y"`,
      },
    ],
  },
  {
    name: "Quantifier",
    infos: [
      {
        Icon: <SimpleGraph regex="a*" />,
        desc: "Indicate numbers of characters or expressions to match",
      },
    ],
  },
  {
    name: "Group",
    infos: [
      {
        Icon: <SimpleGraph regex="(x)" />,
        desc: "Matches x and remembers the match",
      },
      {
        Icon: <SimpleGraph regex="(?:x)" />,
        desc: `Matches "x" but does not remember the match`,
      },
      {
        Icon: <SimpleGraph regex="(?<Name>x)" />,
        desc: `Matches "x" and stores it on the groups property of the returned matches under the name specified by <Name>`,
      },
    ],
  },
  {
    name: "Back reference",
    infos: [
      {
        Icon: <SimpleGraph regex={"\\1"} />,
        desc: "A back reference to match group #1",
      },
      {
        Icon: <SimpleGraph regex={"\\k<name>"} />,
        desc: `A back reference to match group #Name`,
      },
    ],
  },
  {
    name: "Assertion",
    infos: [
      {
        Icon: <SimpleGraph regex="^" />,
        desc: "Matches the beginning of input",
      },
      {
        Icon: <SimpleGraph regex="x(?=y)" />,
        desc: `Matches "x" only if "x" is followed by "y"`,
      },
    ],
  },
]

export default legends
