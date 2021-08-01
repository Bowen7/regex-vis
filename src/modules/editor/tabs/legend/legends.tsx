import React from "react"
import {
  CharactersSvg,
  ClassSvg,
  RangesSvg,
  NegateRangesSvg,
  ChoiceSvg,
  QuantifierSvg,
  CapturingGroupSvg,
  NonCapturingGroupSvg,
  NamedCapturingGroupSvg,
  BackReferenceSvg,
  NamedBackReferenceSvg,
  BeginningAssertionSvg,
  LookaheadAssertionSvg,
} from "@/assets"

const legends = [
  {
    name: "Characters",
    infos: [
      {
        Icon: <CharactersSvg />,
        desc: "Direct match characters",
      },
    ],
  },
  {
    name: "Character classes",
    infos: [
      {
        Icon: <ClassSvg />,
        desc: "Distinguish different types of characters",
      },
    ],
  },
  {
    name: "Ranges",
    infos: [
      {
        Icon: <RangesSvg />,
        desc: "Matches any one of the enclosed characters",
      },
      {
        Icon: <NegateRangesSvg />,
        desc: "Matches anything that is not enclosed in the brackets",
      },
    ],
  },
  {
    name: "Choice",
    infos: [
      {
        Icon: <ChoiceSvg />,
        desc: `Matches either "x" or "y"`,
      },
    ],
  },
  {
    name: "Quantifier",
    infos: [
      {
        Icon: <QuantifierSvg />,
        desc: "Indicate numbers of characters or expressions to match",
      },
    ],
  },
  {
    name: "Group",
    infos: [
      {
        Icon: <CapturingGroupSvg />,
        desc: "Matches x and remembers the match",
      },
      {
        Icon: <NonCapturingGroupSvg />,
        desc: `Matches "x" but does not remember the match`,
      },
      {
        Icon: <NamedCapturingGroupSvg />,
        desc: `Matches "x" and stores it on the groups property of the returned matches under the name specified by <Name>`,
      },
    ],
  },
  {
    name: "Back reference",
    infos: [
      {
        Icon: <BackReferenceSvg />,
        desc: "A back reference to match group #1",
      },
      {
        Icon: <NamedBackReferenceSvg />,
        desc: `A back reference to match group #Name`,
      },
    ],
  },
  {
    name: "Assertion",
    infos: [
      {
        Icon: <BeginningAssertionSvg />,
        desc: "Matches the beginning of input",
      },
      {
        Icon: <LookaheadAssertionSvg />,
        desc: `Matches "x" only if "x" is followed by "y"`,
      },
    ],
  },
]

export default legends
