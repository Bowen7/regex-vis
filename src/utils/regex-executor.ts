import type { AST } from '@/parser'

export type ExecutionState = {
  stepIndex: number
  currentNodeId: string | null
  currentStringIndex: number
  matchedString: string
  remainingString: string
  isBacktracking: boolean
  isSuccess: boolean
  isFailed: boolean
  capturedGroups: Record<number, string>
  namedGroups: Record<string, string>
  message: string
}

export type ExecutionStep = {
  index: number
  nodeId: string | null
  nodeType: string | null
  nodeDescription: string
  stringIndex: number
  action: 'match' | 'backtrack' | 'fail' | 'success' | 'advance' | 'group-start' | 'group-end'
  description: string
  matchedChar?: string
  isBacktrack: boolean
}

export type ExecutionResult = {
  steps: ExecutionStep[]
  isSuccess: boolean
  finalMatchedString: string
  capturedGroups: Record<number, string>
  namedGroups: Record<string, string>
}

function getNodeDescription(node: AST.Node | null): string {
  if (!node) return 'Start'
  
  switch (node.type) {
    case 'character':
      if (node.kind === 'string') return `字符 '${node.value}'`
      if (node.kind === 'class') return `字符类 ${node.value}`
      if (node.kind === 'ranges') {
        const ranges = node.ranges.map(r => `${r.from}-${r.to}`).join(', ')
        return node.negate ? `非字符类 [^${ranges}]` : `字符类 [${ranges}]`
      }
      return '字符'
    case 'group':
      if (node.kind === 'namedCapturing') return `命名捕获组 (?<${node.name}>)`
      if (node.kind === 'capturing') return `捕获组 (${node.index})`
      return '非捕获组'
    case 'choice':
      return '分支选择'
    case 'backReference':
      return `反向引用 \\${node.ref}`
    case 'boundaryAssertion':
      if (node.kind === 'beginning') return '行首断言 ^'
      if (node.kind === 'end') return '行尾断言 $'
      if (node.kind === 'word') return node.negate ? '非单词边界' : '单词边界'
      return '边界断言'
    case 'lookAroundAssertion':
      const lookType = node.negate ? '否定' : '肯定'
      const direction = node.kind === 'lookahead' ? '前瞻' : '后顾'
      return `${lookType}${direction}断言`
    default:
      return node.type
  }
}

function getNodeType(node: AST.Node | null): string | null {
  if (!node) return null
  return node.type
}

function getQuantifierInfo(quantifier: AST.Quantifier | null): { min: number; max: number; greedy: boolean } | null {
  if (!quantifier) return null
  return {
    min: quantifier.min,
    max: quantifier.max === Infinity ? -1 : quantifier.max,
    greedy: quantifier.greedy
  }
}

function matchesCharacter(char: string, node: AST.CharacterNode, caseInsensitive: boolean): boolean {
  const targetChar = caseInsensitive ? char.toLowerCase() : char
  
  if (node.kind === 'string') {
    const nodeValue = caseInsensitive ? node.value.toLowerCase() : node.value
    return targetChar === nodeValue
  }
  
  if (node.kind === 'class') {
    const charCode = char.charCodeAt(0)
    const isDigit = charCode >= 48 && charCode <= 57
    const isWordChar = (charCode >= 48 && charCode <= 57) || 
                       (charCode >= 65 && charCode <= 90) || 
                       (charCode >= 97 && charCode <= 122) || 
                       charCode === 95
    const isWhitespace = char === ' ' || char === '\t' || char === '\n' || char === '\r'
    
    switch (node.value) {
      case '\\d': return isDigit
      case '\\D': return !isDigit
      case '\\w': return isWordChar
      case '\\W': return !isWordChar
      case '\\s': return isWhitespace
      case '\\S': return !isWhitespace
      case '.': return char !== '\n'
      default: return false
    }
  }
  
  if (node.kind === 'ranges') {
    const charCode = char.charCodeAt(0)
    let inRange = false
    
    for (const range of node.ranges) {
      const fromCode = range.from.charCodeAt(0)
      const toCode = range.to.charCodeAt(0)
      if (charCode >= fromCode && charCode <= toCode) {
        inRange = true
        break
      }
    }
    
    return node.negate ? !inRange : inRange
  }
  
  return false
}

export class RegexExecutor {
  private ast: AST.Regex
  private input: string
  private steps: ExecutionStep[] = []
  private stepIndex: number = 0
  private caseInsensitive: boolean
  private global: boolean

  constructor(ast: AST.Regex, input: string) {
    this.ast = ast
    this.input = input
    this.caseInsensitive = ast.flags.includes('i')
    this.global = ast.flags.includes('g')
  }

  execute(): ExecutionResult {
    this.steps = []
    this.stepIndex = 0
    
    this.addStep(null, 'advance', '开始执行正则表达式', 0)
    
    const result = this.executeNodes(this.ast.body, 0, {})
    
    if (result.success) {
      this.addStep(null, 'success', `匹配成功！已匹配 "${result.matched}"`, result.stringIndex)
    } else {
      this.addStep(null, 'fail', '匹配失败，无法继续', result.stringIndex)
    }
    
    return {
      steps: this.steps,
      isSuccess: result.success,
      finalMatchedString: result.matched,
      capturedGroups: result.groups,
      namedGroups: result.namedGroups || {}
    }
  }

  private addStep(
    node: AST.Node | null,
    action: ExecutionStep['action'],
    description: string,
    stringIndex: number,
    matchedChar?: string,
    isBacktrack: boolean = false
  ): void {
    this.steps.push({
      index: this.stepIndex++,
      nodeId: node?.id || null,
      nodeType: getNodeType(node),
      nodeDescription: getNodeDescription(node),
      stringIndex,
      action,
      description,
      matchedChar,
      isBacktrack
    })
  }

  private executeNodes(
    nodes: AST.Node[],
    startIndex: number,
    groups: Record<number, string>,
    namedGroups?: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    let currentIndex = startIndex
    let totalMatched = ''
    let currentGroups = { ...groups }
    let currentNamedGroups = { ...(namedGroups || {}) }

    for (const node of nodes) {
      const result = this.executeNode(node, currentIndex, currentGroups, currentNamedGroups)
      
      if (!result.success) {
        return { success: false, stringIndex: currentIndex, matched: totalMatched, groups: currentGroups, namedGroups: currentNamedGroups }
      }
      
      currentIndex = result.stringIndex
      totalMatched += result.matched
      currentGroups = result.groups
      currentNamedGroups = result.namedGroups
    }

    return { success: true, stringIndex: currentIndex, matched: totalMatched, groups: currentGroups, namedGroups: currentNamedGroups }
  }

  private executeNode(
    node: AST.Node,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    const quantifier = 'quantifier' in node ? node.quantifier : null
    const quantifierInfo = getQuantifierInfo(quantifier)

    if (quantifierInfo) {
      return this.executeWithQuantifier(node, startIndex, groups, namedGroups, quantifierInfo)
    }

    return this.executeSingleNode(node, startIndex, groups, namedGroups)
  }

  private executeSingleNode(
    node: AST.Node,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    switch (node.type) {
      case 'character':
        return this.executeCharacterNode(node, startIndex, groups, namedGroups)
      
      case 'group':
        return this.executeGroupNode(node, startIndex, groups, namedGroups)
      
      case 'choice':
        return this.executeChoiceNode(node, startIndex, groups, namedGroups)
      
      case 'boundaryAssertion':
        return this.executeBoundaryAssertion(node, startIndex, groups, namedGroups)
      
      case 'lookAroundAssertion':
        return this.executeLookAroundAssertion(node, startIndex, groups, namedGroups)
      
      case 'backReference':
        return this.executeBackReference(node, startIndex, groups, namedGroups)
      
      default:
        this.addStep(node, 'advance', `跳过未知节点类型: ${node.type}`, startIndex)
        return { success: true, stringIndex: startIndex, matched: '', groups, namedGroups }
    }
  }

  private executeCharacterNode(
    node: AST.CharacterNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    if (startIndex >= this.input.length) {
      this.addStep(node, 'fail', `无法匹配 ${getNodeDescription(node)}：已到达字符串末尾`, startIndex)
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }

    const char = this.input[startIndex]
    
    if (matchesCharacter(char, node, this.caseInsensitive)) {
      this.addStep(node, 'match', `匹配 ${getNodeDescription(node)}：'${char}'`, startIndex, char)
      return { success: true, stringIndex: startIndex + 1, matched: char, groups, namedGroups }
    } else {
      this.addStep(node, 'fail', `匹配失败：期望 ${getNodeDescription(node)}，实际遇到 '${char}'`, startIndex)
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }
  }

  private executeGroupNode(
    node: AST.GroupNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    const isCapturing = node.kind === 'capturing' || node.kind === 'namedCapturing'
    const groupIndex = 'index' in node ? node.index : -1
    const groupName = 'name' in node ? node.name : undefined

    this.addStep(node, 'group-start', `进入 ${getNodeDescription(node)}`, startIndex)

    const result = this.executeNodes(node.children, startIndex, groups, namedGroups)

    if (result.success && isCapturing) {
      const newGroups = { ...result.groups }
      const newNamedGroups = { ...result.namedGroups }
      
      if (groupIndex >= 0) {
        newGroups[groupIndex] = result.matched
      }
      if (groupName) {
        newNamedGroups[groupName] = result.matched
      }
      
      this.addStep(node, 'group-end', `${getNodeDescription(node)} 完成，捕获: "${result.matched}"`, result.stringIndex)
      return { ...result, groups: newGroups, namedGroups: newNamedGroups }
    }

    if (result.success) {
      this.addStep(node, 'group-end', `${getNodeDescription(node)} 完成`, result.stringIndex)
    } else {
      this.addStep(node, 'backtrack', `${getNodeDescription(node)} 匹配失败，回溯`, startIndex, undefined, true)
    }

    return result
  }

  private executeChoiceNode(
    node: AST.ChoiceNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    this.addStep(node, 'advance', `进入分支选择，共有 ${node.branches.length} 个分支`, startIndex)

    for (let i = 0; i < node.branches.length; i++) {
      const branch = node.branches[i]
      this.addStep(null, 'advance', `尝试分支 ${i + 1}`, startIndex)
      
      const result = this.executeNodes(branch, startIndex, groups, namedGroups)
      
      if (result.success) {
        this.addStep(node, 'match', `分支 ${i + 1} 匹配成功`, result.stringIndex)
        return result
      } else {
        this.addStep(null, 'backtrack', `分支 ${i + 1} 匹配失败，尝试下一个分支`, startIndex, undefined, true)
      }
    }

    this.addStep(node, 'fail', '所有分支都匹配失败', startIndex)
    return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
  }

  private executeBoundaryAssertion(
    node: AST.AssertionNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    let success = false

    if (node.type !== 'boundaryAssertion') {
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }

    switch (node.kind) {
      case 'beginning':
        success = startIndex === 0
        this.addStep(node, success ? 'match' : 'fail', success ? '行首断言匹配成功' : '行首断言失败：不在行首', startIndex)
        break
      
      case 'end':
        success = startIndex === this.input.length
        this.addStep(node, success ? 'match' : 'fail', success ? '行尾断言匹配成功' : '行尾断言失败：不在行尾', startIndex)
        break
      
      case 'word':
        const isWordChar = (idx: number): boolean => {
          if (idx < 0 || idx >= this.input.length) return false
          const c = this.input[idx]
          return /[a-zA-Z0-9_]/.test(c)
        }
        const prevIsWord = isWordChar(startIndex - 1)
        const currIsWord = isWordChar(startIndex)
        const isBoundary = prevIsWord !== currIsWord
        success = node.negate ? !isBoundary : isBoundary
        const boundaryType = node.negate ? '非单词边界' : '单词边界'
        this.addStep(node, success ? 'match' : 'fail', success ? `${boundaryType}断言匹配成功` : `${boundaryType}断言失败`, startIndex)
        break
    }

    return { success, stringIndex: startIndex, matched: '', groups, namedGroups }
  }

  private executeLookAroundAssertion(
    node: AST.LookAroundAssertionNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    const lookType = node.negate ? '否定' : '肯定'
    const direction = node.kind === 'lookahead' ? '前瞻' : '后顾'
    
    this.addStep(node, 'advance', `执行${lookType}${direction}断言`, startIndex)

    if (node.kind === 'lookbehind') {
      this.addStep(node, 'advance', '后顾断言暂不支持完整模拟', startIndex)
      return { success: true, stringIndex: startIndex, matched: '', groups, namedGroups }
    }

    const result = this.executeNodes(node.children, startIndex, groups, namedGroups)
    const success = node.negate ? !result.success : result.success

    if (success) {
      this.addStep(node, 'match', `${lookType}${direction}断言匹配成功`, startIndex)
    } else {
      this.addStep(node, 'fail', `${lookType}${direction}断言匹配失败`, startIndex)
    }

    return { success, stringIndex: startIndex, matched: '', groups, namedGroups }
  }

  private executeBackReference(
    node: AST.BackReferenceNode,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    const refValue = groups[parseInt(node.ref)] || namedGroups[node.ref]
    
    if (!refValue) {
      this.addStep(node, 'fail', `反向引用 \\${node.ref} 未找到对应的捕获组`, startIndex)
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }

    const expected = this.caseInsensitive ? refValue.toLowerCase() : refValue
    const actual = this.input.substring(startIndex, startIndex + refValue.length)
    const actualLower = this.caseInsensitive ? actual.toLowerCase() : actual

    if (actualLower === expected) {
      this.addStep(node, 'match', `反向引用 \\${node.ref} 匹配成功: "${actual}"`, startIndex)
      return { success: true, stringIndex: startIndex + actual.length, matched: actual, groups, namedGroups }
    } else {
      this.addStep(node, 'fail', `反向引用 \\${node.ref} 匹配失败：期望 "${refValue}"，实际 "${actual}"`, startIndex)
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }
  }

  private executeWithQuantifier(
    node: AST.Node,
    startIndex: number,
    groups: Record<number, string>,
    namedGroups: Record<string, string>,
    quantifier: { min: number; max: number; greedy: boolean }
  ): { success: boolean; stringIndex: number; matched: string; groups: Record<number, string>; namedGroups: Record<string, string> } {
    const { min, max, greedy } = quantifier
    const maxAttempts = max === -1 ? this.input.length - startIndex : max
    
    const quantifierDesc = this.getQuantifierDescription(min, max, greedy)
    this.addStep(node, 'advance', `执行 ${getNodeDescription(node)} ${quantifierDesc}，最少 ${min} 次，最多 ${max === -1 ? '无限' : max} 次`, startIndex)

    let currentIndex = startIndex
    let totalMatched = ''
    let currentGroups = { ...groups }
    let currentNamedGroups = { ...namedGroups }
    let matchCount = 0
    const matchResults: { index: number; matched: string }[] = []

    if (greedy) {
      while (matchCount < maxAttempts) {
        const result = this.executeSingleNode(node, currentIndex, currentGroups, currentNamedGroups)
        
        if (!result.success) {
          break
        }
        
        matchCount++
        matchResults.push({ index: currentIndex, matched: result.matched })
        currentIndex = result.stringIndex
        totalMatched += result.matched
        currentGroups = result.groups
        currentNamedGroups = result.namedGroups
        
        this.addStep(node, 'match', `贪婪模式：第 ${matchCount} 次匹配成功: "${result.matched}"`, currentIndex)
      }
    } else {
      while (matchCount < maxAttempts) {
        const result = this.executeSingleNode(node, currentIndex, currentGroups, currentNamedGroups)
        
        if (!result.success) {
          break
        }
        
        matchCount++
        matchResults.push({ index: currentIndex, matched: result.matched })
        currentIndex = result.stringIndex
        totalMatched += result.matched
        currentGroups = result.groups
        currentNamedGroups = result.namedGroups
        
        this.addStep(node, 'match', `非贪婪模式：第 ${matchCount} 次匹配成功: "${result.matched}"`, currentIndex)
        
        if (matchCount >= min) {
          break
        }
      }
    }

    if (matchCount >= min) {
      this.addStep(node, 'advance', `${quantifierDesc} 完成，共匹配 ${matchCount} 次，满足最少 ${min} 次要求`, currentIndex)
      return { success: true, stringIndex: currentIndex, matched: totalMatched, groups: currentGroups, namedGroups: currentNamedGroups }
    } else {
      this.addStep(node, 'fail', `${quantifierDesc} 匹配失败：仅匹配 ${matchCount} 次，需要至少 ${min} 次`, startIndex, undefined, true)
      return { success: false, stringIndex: startIndex, matched: '', groups, namedGroups }
    }
  }

  private getQuantifierDescription(min: number, max: number, greedy: boolean): string {
    let desc = ''
    if (min === 0 && max === 1) desc = '?'
    else if (min === 0 && max === -1) desc = '*'
    else if (min === 1 && max === -1) desc = '+'
    else if (max === -1) desc = `{${min},}`
    else if (min === max) desc = `{${min}}`
    else desc = `{${min},${max}}`
    
    return greedy ? desc : desc + '?'
  }
}

export function createExecutionState(step: ExecutionStep, input: string): ExecutionState {
  const matchedString = input.substring(0, step.stringIndex)
  const remainingString = input.substring(step.stringIndex)
  
  return {
    stepIndex: step.index,
    currentNodeId: step.nodeId,
    currentStringIndex: step.stringIndex,
    matchedString,
    remainingString,
    isBacktracking: step.isBacktrack,
    isSuccess: step.action === 'success',
    isFailed: step.action === 'fail',
    capturedGroups: {},
    namedGroups: {},
    message: step.description
  }
}
