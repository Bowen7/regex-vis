copy from https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification

### AST nodes specification

Below are the AST node types for different regular expressions patterns:

- [Char](#char)
  - [Simple char](#simple-char)
  - [Escaped char](#escaped-char)
  - [Meta char](#meta-char)
  - [Control char](#control-char)
  - [Hex char-code](#hex-char-code)
  - [Decimal char-code](#decimal-char-code)
  - [Octal char-code](#octal-char-code)
  - [Unicode](#unicode)
- [Character class](#character-class)
  - [Positive character class](#positive-character-class)
  - [Negative character class](#negative-character-class)
  - [Character class ranges](#character-class-ranges)
- [Unicode properties](#unicode-properties)
- [Alternative](#alternative)
- [Disjunction](#disjunction)
- [Groups](#groups)
  - [Capturing group](#capturing-group)
  - [Named capturing group](#named-capturing-group)
  - [Non-capturing group](#non-capturing-group)
  - [Backreferences](#backreferences)
- [Quantifiers](#quantifiers)
  - [? zero-or-one](#-zero-or-one)
  - [* zero-or-more](#-zero-or-more)
  - [+ one-or-more](#-one-or-more)
  - [Range-based quantifiers](#range-based-quantifiers)
    - [Exact number of matches](#exact-number-of-matches)
    - [Open range](#open-range)
    - [Closed range](#closed-range)
  - [Non-greedy](#non-greedy)
- [Assertions](#assertions)
  - [^ begin marker](#-begin-marker)
  - [$ end marker](#-end-marker)
  - [Boundary assertions](#boundary-assertions)
  - [Lookahead assertions](#lookahead-assertions)
    - [Positive lookahead assertion](#positive-lookahead-assertion)
    - [Negative lookahead assertion](#negative-lookahead-assertion)
  - [Lookbehind assertions](#lookbehind-assertions)
    - [Positive lookbehind assertion](#positive-lookbehind-assertion)
    - [Negative lookbehind assertion](#negative-lookbehind-assertion)

#### Char

A basic building block, single character. Can be _escaped_, and be of different _kinds_.

##### Simple char

Basic _non-escaped_ char in a regexp:

```
z
```

Node:

```js
{
  type: 'Char',
  value: 'z',
  symbol: 'z',
  kind: 'simple',
  codePoint: 122
}
```

> NOTE: to test this from CLI, the char should be in an actual regexp -- `/z/`.

##### Escaped char

```
\z
```

The same value, `escaped` flag is added:

```js
{
  type: 'Char',
  value: 'z',
  symbol: 'z',
  kind: 'simple',
  codePoint: 122,
  escaped: true
}
```

Escaping is mostly used with meta symbols:

```
// Syntax error
*
```

```
\*
```

OK, node:

```js
{
  type: 'Char',
  value: '*',
  symbol: '*',
  kind: 'simple',
  codePoint: 42,
  escaped: true
}
```

##### Meta char

A _meta character_ should not be confused with an [escaped char](#escaped-char).

Example:

```
\n
```

Node:

```js
{
  type: 'Char',
  value: '\\n',
  symbol: '\n',
  kind: 'meta',
  codePoint: 10
}
```

Among other meta character are: `.`, `\f`, `\r`, `\n`, `\t`, `\v`, `\0`, `[\b]` (backspace char), `\s`, `\S`, `\w`, `\W`, `\d`, `\D`.

> NOTE: Meta characters representing ranges (like `.`, `\s`, etc.) have `undefined` value for `symbol` and `NaN` for `codePoint`.

> NOTE: `\b` and `\B` are parsed as `Assertion` node type, not `Char`.

##### Control char

A char preceded with `\c`, e.g. `\cx`, which stands for `CTRL+x`:

```
\cx
```

Node:

```js
{
  type: 'Char',
  value: '\\cx',
  symbol: undefined,
  kind: 'control',
  codePoint: NaN
}
```

##### HEX char-code

A char preceded with `\x`, followed by a HEX-code, e.g. `\x3B` (symbol `;`):

```
\x3B
```

Node:

```js
{
  type: 'Char',
  value: '\\x3B',
  symbol: ';',
  kind: 'hex',
  codePoint: 59
}
```

##### Decimal char-code

Char-code:

```
\42
```

Node:

```js
{
  type: 'Char',
  value: '\\42',
  symbol: '*',
  kind: 'decimal',
  codePoint: 42
}
```

##### Octal char-code

Char-code started with `\0`, followed by an octal number:

```
\073
```

Node:

```js
{
  type: 'Char',
  value: '\\073',
  symbol: ';',
  kind: 'oct',
  codePoint: 59
}
```

##### Unicode

Unicode char started with `\u`, followed by a hex number:

```
\u003B
```

Node:

```js
{
  type: 'Char',
  value: '\\u003B',
  symbol: ';',
  kind: 'unicode',
  codePoint: 59
}
```

When using the `u` flag, unicode chars can also be represented using `\u` followed by a hex number between curly braces:

```
\u{1F680}
```

Node:

```js
{
  type: 'Char',
  value: '\\u{1F680}',
  symbol: '🚀',
  kind: 'unicode',
  codePoint: 128640
}
```

When using the `u` flag, unicode chars can also be represented using a surrogate pair:

```
\ud83d\ude80
```

Node:

```js
{
  type: 'Char',
  value: '\\ud83d\\ude80',
  symbol: '🚀',
  kind: 'unicode',
  codePoint: 128640,
  isSurrogatePair: true
}
```

#### Character class

Character classes define a _set_ of characters. A set may include as simple characters, as well as _character ranges_. A class can be _positive_ (any from the characters in the class match), or _negative_ (any _but_ the characters from the class match).

##### Positive character class

A positive character class is defined between `[` and `]` brackets:

```
[a*]
```

A node:

```js
{
  type: 'CharacterClass',
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Char',
      value: '*',
      symbol: '*',
      kind: 'simple',
      codePoint: 42
    }
  ]
}
```

> NOTE: some meta symbols are treated as normal characters in a character class. E.g. `*` is not a repetition quantifier, but a simple char.

##### Negative character class

A negative character class is defined between `[^` and `]` brackets:

```
[^ab]
```

An AST node is the same, just `negative` property is added:

```js
{
  type: 'CharacterClass',
  negative: true,
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Char',
      value: 'b',
      symbol: 'b',
      kind: 'simple',
      codePoint: 98
    }
  ]
}
```

##### Character class ranges

As mentioned, a character class may also contain _ranges_ of symbols:

```
[a-z]
```

A node:

```js
{
  type: 'CharacterClass',
  expressions: [
    {
      type: 'ClassRange',
      from: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 97
      },
      to: {
        type: 'Char',
        value: 'z',
        symbol: 'z',
        kind: 'simple',
        codePoint: 122
      }
    }
  ]
}
```

> NOTE: it is a _syntax error_ if `to` value is less than `from` value: `/[z-a]/`.

The range value can be the same for `from` and `to`, and the special range `-` character is treated as a simple character when it stands in a char position:

```
// from: 'a', to: 'a'
[a-a]

// from: '-', to: '-'
[---]

// simple '-' char:
[-]

// 3 ranges:
[a-zA-Z0-9]+
```

#### Unicode properties

Unicode property escapes are a new type of escape sequence available in regular expressions that have the `u` flag set. With this feature it is possible to write Unicode expressions as:

```js
const greekSymbolRe = /\p{Script=Greek}/u;

greekSymbolRe.test('π'); // true
```

The AST node for this expression is:

```js
{
  type: 'UnicodeProperty',
  name: 'Script',
  value: 'Greek',
  negative: false,
  shorthand: false,
  binary: false,
  canonicalName: 'Script',
  canonicalValue: 'Greek'
}
```

All possible property names, values, and their aliases can be found at the [specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-unicodematchproperty-p).

For `General_Category` it is possible to use a shorthand:

```js
/\p{Letter}/u;   // Shorthand

/\p{General_Category=Letter}/u; // Full notation
```

Binary names use the single value as well:

```js
/\p{ASCII_Hex_Digit}/u; // Same as: /[0-9A-Fa-f]/
```

The capitalized `P` defines the negation of the expression:

```js
/\P{ASCII_Hex_Digit}/u; // NOT a ASCII Hex digit
```

#### Alternative

An _alternative_ (or _concatenation_) defines a chain of patterns followed one after another:

```
abc
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Char',
      value: 'b',
      symbol: 'b',
      kind: 'simple',
      codePoint: 98
    },
    {
      type: 'Char',
      value: 'c',
      symbol: 'c',
      kind: 'simple',
      codePoint: 99
    }
  ]
}
```

Another examples:

```
// 'a' with a quantifier, followed by 'b'
a?b

// A group followed by a class:
(ab)[a-z]
```

#### Disjunction

The _disjunction_ defines "OR" operation for regexp patterns. It's a _binary_ operation, having `left`, and `right` nodes.

Matches `a` or `b`:

```
a|b
```

A node:

```js
{
  type: 'Disjunction',
  left: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  right: {
    type: 'Char',
    value: 'b',
    symbol: 'b',
    kind: 'simple',
    codePoint: 98
  }
}
```

#### Groups

The groups play two roles: they define _grouping precedence_, and allow to _capture_ needed sub-expressions in case of a capturing group.

##### Capturing group

_"Capturing"_ means the matched string can be referred later by a user, including in the pattern itself -- by using [backreferences](#backreferences).

Char `a`, and `b` are grouped, followed by the `c` char:

```
(ab)c
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Group',
      capturing: true,
      number: 1,
      expression: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            symbol: 'a',
            kind: 'simple',
            codePoint: 97
          },
          {
            type: 'Char',
            value: 'b',
            symbol: 'b',
            kind: 'simple',
            codePoint: 98
          }
        ]
      }
    },
    {
      type: 'Char',
      value: 'c',
      symbol: 'c',
      kind: 'simple',
      codePoint: 99
    }
  ]
}
```

As we can see, it also tracks the number of the group.

Another example:

```
// A grouped disjunction of a symbol, and a character class:
(5|[a-z])
```

##### Named capturing group

> NOTE: _Named capturing groups_ are not yet supported by JavaScript RegExp. It is an ECMAScript [proposal](https://tc39.github.io/proposal-regexp-named-groups/) which is at stage 3 at the moment.

A capturing group can be given a name using the `(?<name>...)` syntax, for any identifier `name`.

For example, a regular expressions for a date:

```js
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u
```

For the group:

```js
(?<foo>x)
```

We have the following node (the `name` property with value `foo` is added):

```js
{
  type: 'Group',
  capturing: true,
  name: 'foo',
  nameRaw: 'foo',
  number: 1,
  expression: {
    type: 'Char',
    value: 'x',
    symbol: 'x',
    kind: 'simple',
    codePoint: 120
  }
}
```

Note: The `nameRaw` property represents the name *as parsed from the original source*, including escape sequences. The `name` property represents the canonical decoded form of the name.

For example, given the `/u` flag and the following group:

```regexp
(?<\u{03C0}>x)
```

We would have the following node:

```js
{
  type: 'Group',
  capturing: true,
  name: 'π',
  nameRaw: '\\u{03C0}',
  number: 1,
  expression: {
    type: 'Char',
    value: 'x',
    symbol: 'x',
    kind: 'simple',
    codePoint: 120
  }
}
```

##### Non-capturing group

Sometimes we don't need to actually capture the matched string from a group. In this case we can use a _non-capturing_ group:

Char `a`, and `b` are grouped, _but not captured_, followed by the `c` char:

```
(?:ab)c
```

The same node, the `capturing` flag is `false`:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Group',
      capturing: false,
      expression: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            symbol: 'a',
            kind: 'simple',
            codePoint: 97
          },
          {
            type: 'Char',
            value: 'b',
            symbol: 'b',
            kind: 'simple',
            codePoint: 98
          }
        ]
      }
    },
    {
      type: 'Char',
      value: 'c',
      symbol: 'c',
      kind: 'simple',
      codePoint: 99
    }
  ]
}
```

##### Backreferences

A [capturing group](#capturing-group) can be referenced in the pattern using notation of an escaped group number.

Matches `abab` string:

```
(ab)\1
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Group',
      capturing: true,
      number: 1,
      expression: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            symbol: 'a',
            kind: 'simple',
            codePoint: 97
          },
          {
            type: 'Char',
            value: 'b',
            symbol: 'b',
            kind: 'simple',
            codePoint: 98
          }
        ]
      }
    },
    {
      type: 'Backreference',
      kind: 'number',
      number: 1,
      reference: 1,
    }
  ]
}
```

A [named capturing group](#named-capturing-group) can be accessed using `\k<name>` pattern, and also using a numbered reference.

Matches `www`:

```js
(?<foo>w)\k<foo>\1
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Group',
      capturing: true,
      name: 'foo',
      nameRaw: 'foo',
      number: 1,
      expression: {
        type: 'Char',
        value: 'w',
        symbol: 'w',
        kind: 'simple',
        codePoint: 119
      }
    },
    {
      type: 'Backreference',
      kind: 'name',
      number: 1,
      reference: 'foo',
      referenceRaw: 'foo'
    },
    {
      type: 'Backreference',
      kind: 'number',
      number: 1,
      reference: 1
    }
  ]
}
```

Note: The `referenceRaw` property represents the reference *as parsed from the original source*, including escape sequences. The `reference` property represents the canonical decoded form of the reference.

For example, given the `/u` flag and the following pattern (matches `www`):

```regexp
(?<π>w)\k<\u{03C0}>\1
```

We would have the following node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Group',
      capturing: true,
      name: 'π',
      nameRaw: 'π',
      number: 1,
      expression: {
        type: 'Char',
        value: 'w',
        symbol: 'w',
        kind: 'simple',
        codePoint: 119
      }
    },
    {
      type: 'Backreference',
      kind: 'name',
      number: 1,
      reference: 'π',
      referenceRaw: '\\u{03C0}'
    },
    {
      type: 'Backreference',
      kind: 'number',
      number: 1,
      reference: 1
    }
  ]
}
```


#### Quantifiers

Quantifiers specify _repetition_ of a regular expression (or of its part). Below are the quantifiers which _wrap_ a parsed expression into a `Repetition` node. The quantifier itself can be of different _kinds_, and has `Quantifier` node type.

##### ? zero-or-one

The `?` quantifier is short for `{0,1}`.

```
a?
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: '?',
    greedy: true
  }
}
```

##### * zero-or-more

The `*` quantifier is short for `{0,}`.

```
a*
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: '*',
    greedy: true
  }
}
```

##### + one-or-more

The `+` quantifier is short for `{1,}`.

```
// Same as `aa*`, or `a{1,}`
a+
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: '+',
    greedy: true
  }
}
```

##### Range-based quantifiers

Explicit _range-based_ quantifiers are parsed as follows:

###### Exact number of matches

```
a{3}
```

The type of the quantifier is `Range`, and `from`, and `to` properties have the same value:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: 'Range',
    from: 3,
    to: 3,
    greedy: true
  }
}
```

###### Open range

An open range doesn't have max value (assuming semantic "more", or Infinity value):

```
a{3,}
```

An AST node for such range doesn't contain `to` property:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: 'Range',
    from: 3,
    greedy: true
  }
}
```

###### Closed range

A closed range has explicit max value: (which syntactically can be the same as min value):

```
a{3,5}

// Same as a{3}
a{3,3}
```

An AST node for a closed range:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: 'Range',
    from: 3,
    to: 5,
    greedy: true
  }
}
```

> NOTE: it is a _syntax error_ if the max value is less than min value: `/a{3,2}/`

##### Non-greedy

If any quantifier is followed by the `?`, the quantifier becomes _non-greedy_.

Example:

```
a+?
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    symbol: 'a',
    kind: 'simple',
    codePoint: 97
  },
  quantifier: {
    type: 'Quantifier',
    kind: '+',
    greedy: false
  }
}
```

Other examples:

```
a??
a*?
a{1}?
a{1,}?
a{1,3}?
```

#### Assertions

Assertions appear as separate AST nodes, however instread of manipulating on the characters themselves, they _assert_ certain conditions of a matching string. Examples: `^` -- beginning of a string (or a line in multiline mode), `$` -- end of a string, etc.

##### ^ begin marker

The `^` assertion checks whether a scanner is at the beginning of a string (or a line in multiline mode).

In the example below `^` is not a property of the `a` symbol, but a separate AST node for the assertion. The parsed node is actually an `Alternative` with two nodes:

```
^a
```

The node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Assertion',
      kind: '^'
    },
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    }
  ]
}
```

Since assertion is a separate node, it may appear anywhere in the matching string. The following regexp is completely valid, and asserts beginning of the string; it'll match an empty string:

```
^^^^^
```

##### $ end marker

The `$` assertion is similar to `^`, but asserts the end of a string (or a line in a multiline mode):

```
a$
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Assertion',
      kind: '$'
    }
  ]
}
```

And again, this is a completely valid regexp, and matches an empty string:

```
^^^^$$$$$

// valid too:
$^
```

##### Boundary assertions

The `\b` assertion check for _word boundary_, i.e. the position between a word and a space.

Matches `x` in `x y`, but not in `xy`:

```
x\b
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'x',
      symbol: 'x',
      kind: 'simple',
      codePoint: 120
    },
    {
      type: 'Assertion',
      kind: '\\b'
    }
  ]
}
```

The `\B` is vice-versa checks for _non-word_ boundary. The following example matches `x` in `xy`, but not in `x y`:

```
x\B
```

A node is the same:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'x',
      symbol: 'x',
      kind: 'simple',
      codePoint: 120
    },
    {
      type: 'Assertion',
      kind: '\\B'
    }
  ]
}
```

##### Lookahead assertions

These assertions check whether a pattern is _followed_ (or not followed for the negative assertion) by another pattern.

###### Positive lookahead assertion

Matches `a` only if it's followed by `b`:

```
a(?=b)
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Assertion',
      kind: 'Lookahead',
      assertion: {
        type: 'Char',
        value: 'b',
        symbol: 'b',
        kind: 'simple',
        codePoint: 98
      }
    }
  ]
}
```

###### Negative lookahead assertion

Matches `a` only if it's _not_ followed by `b`:

```
a(?!b)
```

A node is similar, just `negative` flag is added:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Char',
      value: 'a',
      symbol: 'a',
      kind: 'simple',
      codePoint: 97
    },
    {
      type: 'Assertion',
      kind: 'Lookahead',
      negative: true,
      assertion: {
        type: 'Char',
        value: 'b',
        symbol: 'b',
        kind: 'simple',
        codePoint: 98
      }
    }
  ]
}
```

##### Lookbehind assertions

> NOTE: _Lookbehind assertions_ are not yet supported by JavaScript RegExp. It is an ECMAScript [proposal](https://tc39.github.io/proposal-regexp-lookbehind/) which is at stage 3 at the moment.

These assertions check whether a pattern is _preceded_ (or not preceded for the negative assertion) by another pattern.

###### Positive lookbehind assertion

Matches `b` only if it's preceded by `a`:

```
(?<=a)b
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Assertion',
      kind: 'Lookbehind',
      assertion: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 97
      }
    },
    {
      type: 'Char',
      value: 'b',
      symbol: 'b',
      kind: 'simple',
      codePoint: 98
    },
  ]
}
```

###### Negative lookbehind assertion

Matches `b` only if it's _not_ preceded by `a`:

```
(?<!a)b
```

A node:

```js
{
  type: 'Alternative',
  expressions: [
    {
      type: 'Assertion',
      kind: 'Lookbehind',
      negative: true,
      assertion: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 97
      }
    },
    {
      type: 'Char',
      value: 'b',
      symbol: 'b',
      kind: 'simple',
      codePoint: 98
    },
  ]
}