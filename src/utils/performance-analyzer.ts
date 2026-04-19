import type { AST } from '@/parser'

export type PerformanceIssueType =
  | 'catastrophic_backtrack'
  | 'nested_quantifier'
  | 'overlapping_alternatives'
  | 'unoptimized_character_class'
  | 'redundant_quantifier'
  | 'greedy_quantifier_issue'
  | 'lookaround_complexity'

export type PerformanceIssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type PerformanceIssue = {
  id: string
  type: PerformanceIssueType
  severity: PerformanceIssueSeverity
  nodeId: string
  nodeType: string
  description: string
  suggestion: string
  example?: {
    before: string
    after: string
  }
}

export type PerformanceAnalysisResult = {
  issues: PerformanceIssue[]
  overallScore: number
  riskLevel: 'safe' | 'low_risk' | 'medium_risk' | 'high_risk' | 'critical'
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    info: number
  }
}

function hasUnboundedQuantifier(quantifier: AST.Quantifier | null): boolean {
  if (!quantifier) return false
  return quantifier.max === Infinity
}

function hasMultipleMatchesQuantifier(quantifier: AST.Quantifier | null): boolean {
  if (!quantifier) return false
  return quantifier.max > 1 || quantifier.max === Infinity
}

function getNodeDescription(node: AST.Node): string {
  switch (node.type) {
    case 'character':
      if (node.kind === 'string') return `'${node.value}'`
      if (node.kind === 'class') return node.value
      if (node.kind === 'ranges') {
        const ranges = node.ranges.map(r => `${r.from}-${r.to}`).join(',')
        return node.negate ? `[^${ranges}]` : `[${ranges}]`
      }
      return 'character'
    case 'group':
      if (node.kind === 'namedCapturing') return `(?<${node.name}>...)`
      if (node.kind === 'capturing') return '(...)'
      return '(?:...)'
    case 'choice':
      return 'alternative'
    case 'lookAroundAssertion':
      return node.kind === 'lookahead' ? '(?=...)' : '(?<=...)'
    default:
      return node.type
  }
}

function getQuantifierString(quantifier: AST.Quantifier | null): string {
  if (!quantifier) return ''
  switch (quantifier.kind) {
    case '?': return quantifier.greedy ? '?' : '??'
    case '*': return quantifier.greedy ? '*' : '*?'
    case '+': return quantifier.greedy ? '+' : '+?'
    case 'custom':
      if (quantifier.min === quantifier.max) {
        return `{${quantifier.min}}`
      }
      if (quantifier.max === Infinity) {
        return quantifier.greedy ? `{${quantifier.min},}` : `{${quantifier.min},}?`
      }
      return quantifier.greedy ? `{${quantifier.min},${quantifier.max}}` : `{${quantifier.min},${quantifier.max}}?`
  }
}

export class PerformanceAnalyzer {
  private ast: AST.Regex
  private issues: PerformanceIssue[] = []
  private issueIdCounter: number = 0

  constructor(ast: AST.Regex) {
    this.ast = ast
  }

  analyze(): PerformanceAnalysisResult {
    this.issues = []
    this.issueIdCounter = 0

    this.analyzeNodes(this.ast.body)

    const summary = {
      critical: this.issues.filter(i => i.severity === 'critical').length,
      high: this.issues.filter(i => i.severity === 'high').length,
      medium: this.issues.filter(i => i.severity === 'medium').length,
      low: this.issues.filter(i => i.severity === 'low').length,
      info: this.issues.filter(i => i.severity === 'info').length,
    }

    const overallScore = this.calculateOverallScore(summary)
    const riskLevel = this.getRiskLevel(overallScore)

    return {
      issues: this.issues,
      overallScore,
      riskLevel,
      summary,
    }
  }

  private analyzeNodes(nodes: AST.Node[]): void {
    for (const node of nodes) {
      this.analyzeNode(node)
    }
  }

  private analyzeNode(node: AST.Node): void {
    switch (node.type) {
      case 'group':
      case 'lookAroundAssertion':
        this.checkForCatastrophicBacktrack(node)
        this.checkForNestedQuantifiers(node)
        this.analyzeNodes(node.children)
        break
      
      case 'choice':
        this.checkForOverlappingAlternatives(node)
        for (const branch of node.branches) {
          this.analyzeNodes(branch)
        }
        break
      
      case 'character':
        this.checkForRedundantQuantifier(node)
        this.checkForUnoptimizedCharacterClass(node)
        break
      
      case 'backReference':
        this.checkBackReferencePerformance(node)
        break
      
      case 'boundaryAssertion':
        break
    }
  }

  private checkForCatastrophicBacktrack(node: AST.GroupNode | AST.LookAroundAssertionNode): void {
    const hasUnbounded = 'quantifier' in node && hasUnboundedQuantifier(node.quantifier)
    const childrenHaveUnbounded = this.childrenHaveUnboundedQuantifier(node.children)

    if (hasUnbounded && childrenHaveUnbounded) {
      this.addIssue({
        type: 'catastrophic_backtrack',
        severity: 'critical',
        nodeId: node.id,
        nodeType: node.type,
        description: `检测到潜在的灾难性回溯模式。分组 ${getNodeDescription(node)} 具有无限量词，且其内部也包含无限匹配的子模式。这种组合可能导致指数级的回溯尝试。`,
        suggestion: '考虑重新设计正则表达式，避免嵌套的无限量词。可以使用 possessive 量词（如果支持）或原子组，或者重构匹配逻辑。',
        example: {
          before: '(a+)+',
          after: 'a+'
        }
      })
    }

    if (hasUnbounded && this.hasMultipleMatchingChildren(node.children)) {
      this.addIssue({
        type: 'catastrophic_backtrack',
        severity: 'high',
        nodeId: node.id,
        nodeType: node.type,
        description: `分组 ${getNodeDescription(node)} 具有无限量词，且包含多个可匹配的子节点。这可能导致大量回溯。`,
        suggestion: '优化正则表达式结构，减少可能的匹配组合。考虑使用更具体的模式或重新设计匹配逻辑。'
      })
    }
  }

  private childrenHaveUnboundedQuantifier(nodes: AST.Node[]): boolean {
    for (const node of nodes) {
      if ('quantifier' in node && hasUnboundedQuantifier(node.quantifier)) {
        return true
      }
      if (node.type === 'group' || node.type === 'lookAroundAssertion') {
        if (this.childrenHaveUnboundedQuantifier(node.children)) {
          return true
        }
      }
      if (node.type === 'choice') {
        for (const branch of node.branches) {
          if (this.childrenHaveUnboundedQuantifier(branch)) {
            return true
          }
        }
      }
    }
    return false
  }

  private hasMultipleMatchingChildren(nodes: AST.Node[]): boolean {
    let matchableCount = 0
    for (const node of nodes) {
      if (node.type === 'character' || node.type === 'group' || node.type === 'choice') {
        if ('quantifier' in node) {
          const q = node.quantifier
          if (!q || q.min > 0) {
            matchableCount++
          }
        } else {
          matchableCount++
        }
      }
    }
    return matchableCount > 1
  }

  private checkForNestedQuantifiers(node: AST.GroupNode | AST.LookAroundAssertionNode): void {
    const nodeQuantifier = 'quantifier' in node ? node.quantifier : null
    
    if (nodeQuantifier && hasMultipleMatchesQuantifier(nodeQuantifier)) {
      for (const child of node.children) {
        if ('quantifier' in child && hasMultipleMatchesQuantifier(child.quantifier)) {
          const nodeQStr = getQuantifierString(nodeQuantifier)
          const childQStr = getQuantifierString(child.quantifier)
          
          this.addIssue({
            type: 'nested_quantifier',
            severity: 'high',
            nodeId: node.id,
            nodeType: node.type,
            description: `检测到嵌套量词。分组 ${getNodeDescription(node)}${nodeQStr} 内部包含 ${getNodeDescription(child)}${childQStr}。嵌套量词会增加匹配复杂度。`,
            suggestion: '考虑展开内层量词或使用更具体的字符类来减少匹配组合。',
            example: {
              before: '(\\w+)*',
              after: '\\w*'
            }
          })
        }
      }
    }
  }

  private checkForOverlappingAlternatives(node: AST.ChoiceNode): void {
    if (node.branches.length < 2) return

    const branchDescriptions: string[] = []
    
    for (const branch of node.branches) {
      if (branch.length === 1 && branch[0].type === 'character' && branch[0].kind === 'string') {
        branchDescriptions.push(branch[0].value)
      }
    }

    if (branchDescriptions.length >= 2) {
      for (let i = 0; i < branchDescriptions.length; i++) {
        for (let j = i + 1; j < branchDescriptions.length; j++) {
          const a = branchDescriptions[i]
          const b = branchDescriptions[j]
          
          if (a.startsWith(b) || b.startsWith(a)) {
            this.addIssue({
              type: 'overlapping_alternatives',
              severity: 'medium',
              nodeId: node.id,
              nodeType: node.type,
              description: `检测到可能重叠的分支选项："${a}" 和 "${b}"。当一个选项是另一个的前缀时，可能导致不必要的回溯。`,
              suggestion: '将更长的选项放在前面，或者使用更具体的模式。例如，将 "color|colour" 改为 "colou?r"。',
              example: {
                before: 'cat|category',
                after: 'category|cat 或使用更精确的模式'
              }
            })
          }
        }
      }
    }

    for (const branch of node.branches) {
      if (branch.length === 0) {
        this.addIssue({
          type: 'overlapping_alternatives',
          severity: 'medium',
          nodeId: node.id,
          nodeType: node.type,
          description: '分支中包含空选项。空选项总是可以匹配，可能导致不必要的回溯或无限循环。',
          suggestion: '考虑使用可选量词 ? 代替空分支，或者重新设计正则表达式结构。'
        })
      }
    }
  }

  private checkForRedundantQuantifier(node: AST.CharacterNode): void {
    if (!node.quantifier) return

    if (node.kind === 'string') {
      const q = node.quantifier
      
      if (q.kind === 'custom' && q.min === q.max && q.min === 1) {
        this.addIssue({
          type: 'redundant_quantifier',
          severity: 'low',
          nodeId: node.id,
          nodeType: node.type,
          description: `量词 {1} 是冗余的，默认情况下每个模式匹配一次。`,
          suggestion: '移除冗余的 {1} 量词。',
          example: {
            before: 'a{1}',
            after: 'a'
          }
        })
      }

      if (node.value.length > 1 && (q.kind === '+' || q.kind === '*' || (q.kind === 'custom' && q.max !== q.min))) {
        this.addIssue({
          type: 'redundant_quantifier',
          severity: 'info',
          nodeId: node.id,
          nodeType: node.type,
          description: `多字符序列 "${node.value}" 上使用了量词 ${getQuantifierString(q)}。这可能不是预期行为，因为量词会重复整个序列。`,
          suggestion: '确认这是预期行为。如果想让量词只应用于最后一个字符，需要使用分组或调整模式。'
        })
      }
    }
  }

  private checkForUnoptimizedCharacterClass(node: AST.CharacterNode): void {
    if (node.kind !== 'ranges') return

    const ranges = node.ranges
    
    if (ranges.length === 1) {
      const range = ranges[0]
      if (range.from === range.to) {
        this.addIssue({
          type: 'unoptimized_character_class',
          severity: 'low',
          nodeId: node.id,
          nodeType: node.type,
          description: `字符类 [${range.from}-${range.to}] 中起始和结束字符相同，可以简化为单个字符。`,
          suggestion: `将 [${range.from}-${range.to}] 简化为 ${range.from}。`,
          example: {
            before: '[a-a]',
            after: 'a'
          }
        })
      }
    }

    if (ranges.length >= 2) {
      for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
          const r1 = ranges[i]
          const r2 = ranges[j]
          
          if (r1.from === r2.to || r1.to === r2.from || 
              (r1.from <= r2.from && r1.to >= r2.to) ||
              (r2.from <= r1.from && r2.to >= r1.to)) {
            this.addIssue({
              type: 'unoptimized_character_class',
              severity: 'info',
              nodeId: node.id,
              nodeType: node.type,
              description: `检测到可能重叠或相邻的范围：${r1.from}-${r1.to} 和 ${r2.from}-${r2.to}。可以合并为更简洁的形式。`,
              suggestion: '考虑合并相邻或重叠的字符范围以提高可读性。'
            })
          }
        }
      }
    }
  }

  private checkBackReferencePerformance(node: AST.BackReferenceNode): void {
    this.addIssue({
      type: 'greedy_quantifier_issue',
      severity: 'info',
      nodeId: node.id,
      nodeType: node.type,
      description: `使用了反向引用 \\${node.ref}。反向引用会增加匹配复杂度，因为需要查找之前的捕获内容。`,
      suggestion: '如果可能，考虑不使用反向引用，或者确保捕获组的内容不会太长。'
    })
  }

  private addIssue(issue: Omit<PerformanceIssue, 'id'>): void {
    this.issues.push({
      ...issue,
      id: `issue-${this.issueIdCounter++}`
    })
  }

  private calculateOverallScore(summary: PerformanceAnalysisResult['summary']): number {
    const weights = {
      critical: 100,
      high: 50,
      medium: 20,
      low: 5,
      info: 1
    }

    const totalPenalty = 
      summary.critical * weights.critical +
      summary.high * weights.high +
      summary.medium * weights.medium +
      summary.low * weights.low +
      summary.info * weights.info

    const maxPossibleScore = 100
    const score = Math.max(0, maxPossibleScore - totalPenalty)

    return score
  }

  private getRiskLevel(score: number): PerformanceAnalysisResult['riskLevel'] {
    if (score >= 90) return 'safe'
    if (score >= 70) return 'low_risk'
    if (score >= 50) return 'medium_risk'
    if (score >= 30) return 'high_risk'
    return 'critical'
  }
}

export function analyzePerformance(ast: AST.Regex): PerformanceAnalysisResult {
  const analyzer = new PerformanceAnalyzer(ast)
  return analyzer.analyze()
}

export function getRiskLevelColor(riskLevel: PerformanceAnalysisResult['riskLevel']): string {
  switch (riskLevel) {
    case 'safe': return 'text-green-600 dark:text-green-400'
    case 'low_risk': return 'text-green-500 dark:text-green-300'
    case 'medium_risk': return 'text-yellow-600 dark:text-yellow-400'
    case 'high_risk': return 'text-orange-600 dark:text-orange-400'
    case 'critical': return 'text-red-600 dark:text-red-400'
  }
}

export function getRiskLevelLabel(riskLevel: PerformanceAnalysisResult['riskLevel'], t: (key: string) => string): string {
  switch (riskLevel) {
    case 'safe': return t('Safe')
    case 'low_risk': return t('Low Risk')
    case 'medium_risk': return t('Medium Risk')
    case 'high_risk': return t('High Risk')
    case 'critical': return t('Critical')
  }
}

export function getSeverityColor(severity: PerformanceIssueSeverity): string {
  switch (severity) {
    case 'critical': return 'border-l-red-600 bg-red-50 dark:bg-red-900/20'
    case 'high': return 'border-l-orange-600 bg-orange-50 dark:bg-orange-900/20'
    case 'medium': return 'border-l-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    case 'low': return 'border-l-blue-600 bg-blue-50 dark:bg-blue-900/20'
    case 'info': return 'border-l-gray-400 bg-gray-50 dark:bg-gray-800/50'
  }
}

export function getSeverityLabel(severity: PerformanceIssueSeverity, t: (key: string) => string): string {
  switch (severity) {
    case 'critical': return t('Critical')
    case 'high': return t('High')
    case 'medium': return t('Medium')
    case 'low': return t('Low')
    case 'info': return t('Info')
  }
}
