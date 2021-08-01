const svgs = [
  {
    name: "characters",
    regex: "/abc/",
  },
  {
    name: "class",
    regex: "/\\d/",
  },
  {
    name: "ranges",
    regex: "/[a-z]/",
  },
  {
    name: "negate-ranges",
    regex: "/[^a-z]/",
  },
  { name: "choice", regex: "/a|b/" },
  { name: "quantifier", regex: "/a*/" },
  {
    name: "capturing-group",
    regex: "/(x)/",
  },
  {
    name: "non-capturing-group",
    regex: "/(?:x)/",
  },
  {
    name: "named-capturing-group",
    regex: "/(?<Name>x)/",
  },
  {
    name: "back-reference",
    regex: "/\\1/",
  },
  {
    name: "named-back-reference",
    regex: "/\\k<name>/",
  },
  {
    name: "beginning-assertion",
    regex: "/^/",
  },
  { name: "lookahead-assertion", regex: "/x(?=y)/" },
  { name: "whole-numbers", regex: "/^\\d+$/", withRoot: true },
  { name: "decimal-numbers", regex: "/^\\d*\\.\\d+$/", withRoot: true },
  {
    name: "whole+decimal-numbers",
    regex: "/^\\d*(\\.\\d+)?$/",
    withRoot: true,
  },
  {
    name: "negative+positive-whole+decimal-numbers",
    regex: "/^-?\\d*(\\.\\d+)?$/",
    withRoot: true,
  },
  {
    name: "url",
    regex:
      "/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$/",
    withRoot: true,
  },
  {
    name: "date",
    regex: "/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))/",
    withRoot: true,
  },
]
module.exports = svgs
