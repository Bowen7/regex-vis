翻译自 https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification , 并非完全根据字面翻译

### Ast 节点规范

以下是用于不同正则表达式模式的AST节点类型:

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

一个基本的构建块，单个字符。 可以被编码，并且可以是不同 kind 的。

##### Simple char
##### 基本字符

正则表达式中的基本非转义字符：

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

##### Escaped char
##### 转义字符

```
\z
```

跟 `simple char` 相同的值, 多了 `escaped` 的标志:

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

转义通常与特殊符号一起使用:

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
##### 特殊符号

特殊字符不应该与转义字符混淆

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

其他特殊字符包括: `.`, `\f`, `\r`, `\n`, `\t`, `\v`, `\0`, `[\b]` (退格字符), `\s`, `\S`, `\w`, `\W`, `\d`, `\D`.

> 表示范围的特殊字符（如`.`，`\s`等）的`symbol`值为`undefined`,`codePoint` 的值为 `NaN`。

> `\b` 和 `\B` 被解析为 Assertion 节点类型，而不是 Char

##### Control char
##### 控制符

一个以 `\c` 开头的字符，例如 `\cx`，代表 `CTRL + x`：

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
##### 十六进制字符

一个以 `\x` 开头的字符，后跟一个十六进制代码，例如 `x3B`（符号 `;`）：
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
##### 十进制字符

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
##### 八进制字符

字符代码以 `\0` 开头，后跟一个八进制数字：

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

Unicode 字符以 `\u` 开头, 后跟一个十六进制数字:

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

使用该 `u` 标志时，也可以使用 `\u{}` 大括号之间的十六进制数字表示 Unicode 字符：

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
使用 `u` 标志时，也可以使用 surrogate pair 来表示：
注：Surrogate Pair 是 UTF-16 中用于扩展字符而使用的编码方式，是一种采用四个字节(两个 UTF-16 编码)来表示一个字符

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
#### 字符集

字符集定义了一组字符。 一个集合可以包括简单的字符，也可以包括字符范围。 一个类可以是正向的（匹配方括号中的任意字符）或反向的（匹配任何没有包含在方括号中的字符）。

##### Positive character class
##### 正向字符集

正向字符集定义在 `[` 和 `]` 之间：

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

> 注意: 在字符集中，某些特殊符号被视为普通字符。例如 `*` ，不是重复量词，而是简单的字符

##### Negative character class
##### 反向字符集

反向字符集定义在 `[` 和 `^]` 之间：

```
[^ab]
```

ast节点和正向字符集相同，只是多了一个 `negative` 属性：

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
##### 字符集范围

如上所述, 字符类也可能包含符号范围:

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

> 注意: 如果 from 的值小于 `to`, 则是语法错误: `/[z-a]/`

`from` 和 `to` 的值可以相同, 并且特殊范围符号 `-` 在字符位置上将被视为简单字符：

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
#### Unicode 属性

Unicode 属性转义是一种新型的转义序列，可用于设置了 `u` 标志的正则表达式。使用此功能可以将Unicode表达式编写为：

```js
const greekSymbolRe = /\p{Script=Greek}/u;

greekSymbolRe.test('π'); // true
```

该表达式的 ast 节点:

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

所有可能的属性名、值和其别名可以在[规范](https://tc39.github.io/ecma262/#sec-runtime-semantics-unicodematchproperty-p)中找到

对于`General_Category` ，可以使用速记:

```js
/\p{Letter}/u;   // Shorthand

/\p{General_Category=Letter}/u; // Full notation
```

Binary names use the single value as well:

```js
/\p{ASCII_Hex_Digit}/u; // Same as: /[0-9A-Fa-f]/
```

大写字母 `P` 定义了表达式的取反:

```js
/\P{ASCII_Hex_Digit}/u; // NOT a ASCII Hex digit
```

#### Alternative

_alternative_ (or _concatenation_) 定义了一个模式链，一个接一个

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

_disjunction_ 定义了正则表达式的或操作. 这是一个二元操作, 有左节点和右节点.

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
#### 组

这些组有两个作用: 它们定义分组优先级, 并在捕获组的情况下允许捕获所需的子表达式.

##### Capturing group
##### 捕获组

捕获表示匹配的字符串可由用户稍后使用，包括它本身(使用 backreferences)

字符 `a` 和 `b` 一组，后跟 `c` 字符:

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

如我们所见，它还记录了组的序号

Another example:

```
// A grouped disjunction of a symbol, and a character class:
(5|[a-z])
```

##### Named capturing group
##### 命名捕获组

> 注意: JavaScript RegExp 尚不支持命名捕获组. 这是一个 ECMAScript [提案](https://tc39.github.io/proposal-regexp-named-groups/) 目前处于第三阶段.

可以使用 `(?<name>...)` 标识符为捕获组指定名称

例如，日前的正则表达式:

```js
/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u
```

对于组:

```js
(?<foo>x)
```

有以下节点 (foo为值的name属性被添加):

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

> 注意: `nameRaw` 属性表示从原始来源解析的名称，包括转义序列。该name属性表示名称的规范解码形式

例如, 给定 `\u` 标志和以下组:

```regexp
(?<\u{03C0}>x)
```

有以下节点:

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
##### 非捕获组

有时我们不需要从组中捕获匹配的字符串. 在这种情况下，我们可以使用非捕获组:

字符 `a` 和 `b` 分组, 但未捕获，后跟 `c` 字符:

```
(?:ab)c
```

节点相同, `capturing` 属性为 `false`:

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
##### 反向引用

捕获组可以被转义组号引用

匹配 `abab` 字符串:

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
命名捕获组可以使用 `\k<name>` 模式引用，也可以使用编号引用

匹配 `www`:

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

> 注意：该referenceRaw属性表示从原始源（包括转义序列）解析的引用。该reference属性表示参考的规范解码形式

例如, 给定 `/u` 标志和以下模式 (匹配 `www`):

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
#### 量词

量词指定正则表达式（或其一部分）但重复。以下是将已解析的表达式包裹在 `Repetition` 节点中的量词。量词本身可以是不同种类 `kind` 的，并且有 `Quantifier` 节点类型

##### ? zero-or-one
##### ? 0 或 1

`?` 是 `{0,1}` 的简写

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
##### * 0 或更多

`*` 是 `{0,}` 的简写

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
##### + 1 或更多

The `+` quantifier is short for `{1,}`.
`+` 是 `{1,}` 的简写

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
##### 基于范围的量词

基于范围的显式量词解析如下：

###### Exact number of matches
###### 确切的匹配次数

```
a{3}
```

`quantifier` 的类型是 `Range`, 并且 `from` 和 `to` 的属性值相同

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
###### 开范围

开范围没有最大值（假定语义为“更多”或“无穷大”）：

```
a{3,}
```

此范围的AST节点不包含 `to` 属性：

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
###### 闭范围

闭范围有明确的最大值（语法上可以与最小值相等）：

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

> 注意: 如果最大值小于最小值，则是语法错误: `/a{3,2}/`

##### Non-greedy
##### 非贪婪

如果量词后面跟着 `?`，那该量词变为非贪婪

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
#### 断言

断言显示为单独的 AST 节点, 而不是对字符本身对操作, 它们断言了匹配字符串的某些条件。例如: `^` -- 字符串(或多行模式下的一行)的开头 , `$` -- 字符串的结尾, 等等.

##### ^ begin marker
##### ^ 开始标记

`^` 断言检查是否在字符串（或在多行模式的一行）的开头

在下面的示例中，`^` 不是符号 `a` 的属性，而是用于断言的单独的 AST 节点。解析出的节点实际上是一个有两个节点的 `Alternative`:

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

由于断言是一个单独的节点，因此它可以出现在匹配字符串的任何位置。以下正则表达式完全有效，并且断言字符串的开头；它将匹配一个空字符串：

```
^^^^^
```

##### $ end marker
##### $ 结束标记

The `$` assertion is similar to `^`, but asserts the end of a string (or a line in a multiline mode):
`$` 断言类似 `^`，但它断言字符串（或多行模式的一行）的末尾

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

同样，这是一个完全有效的正则表达式，并且匹配一个空字符串：

```
^^^^$$$$$

// valid too:
$^
```

##### Boundary assertions
##### 边界断言

`\b` 断言检查单词边界，即单词与空格之间的位置

匹配 `x y` 的 `x`，而不是 `xy`:

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

`\B` 则是检查非单词边界.下面的例子匹配 `xy` 的 `x`, 而不是 `x y`:

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
##### 先行断言

匹配当前位置接下来的字符序列

###### Positive lookahead assertion
###### 正向先行断言

仅在 `a` 后面跟着 `b` 时匹配:

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
###### 负向先行断言

仅在 `a` 后面不跟随 `b` 时匹配 ：

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
##### 后行断言

> 注意: JavaScript RegExp 暂不支持后行断言. 这是一个 ECMAScript [提案](https://tc39.github.io/proposal-regexp-lookbehind/) 目前处于第3阶段.

匹配当前位置之前的字符序列

###### Positive lookbehind assertion
###### 正向后行断言

Matches `b` only if it's preceded by `a`:
只在 `a` 在 `b` 前时匹配

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
###### 负向后行断言

Matches `b` only if it's _not_ preceded by `a`:
只在 `a` 不在 `b` 前时匹配


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