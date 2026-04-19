import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  WarningOctagon,
  Warning,
  Info,
  CheckCircle,
  Lightning,
  Lightbulb,
  ArrowRight,
  Eye
} from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import {
  analyzePerformance,
  PerformanceAnalysisResult,
  PerformanceIssue,
  getRiskLevelColor,
  getRiskLevelLabel,
  getSeverityColor,
  getSeverityLabel
} from '@/utils/performance-analyzer'
import type { AST } from '@/parser'

type Props = {
  ast: AST.Regex
  onNodeHighlight: (nodeId: string | null) => void
}

function PerformancePanel({ ast, onNodeHighlight }: Props) {
  const { t } = useTranslation()
  const [analysisResult, setAnalysisResult] = useState<PerformanceAnalysisResult | null>(null)
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const [hoveredIssue, setHoveredIssue] = useState<string | null>(null)

  const hasRegex = ast.body.length > 0

  useEffect(() => {
    if (hasRegex) {
      const result = analyzePerformance(ast)
      setAnalysisResult(result)
    } else {
      setAnalysisResult(null)
    }
  }, [ast, hasRegex])

  useEffect(() => {
    if (hoveredIssue && analysisResult) {
      const issue = analysisResult.issues.find(i => i.id === hoveredIssue)
      if (issue) {
        onNodeHighlight(issue.nodeId)
      }
    } else {
      onNodeHighlight(null)
    }
  }, [hoveredIssue, analysisResult, onNodeHighlight])

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => {
      const next = new Set(prev)
      if (next.has(issueId)) {
        next.delete(issueId)
      } else {
        next.add(issueId)
      }
      return next
    })
  }

  const getSeverityIcon = (severity: PerformanceIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <WarningOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'high':
        return <Warning className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      case 'medium':
        return <Warning className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      case 'low':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'info':
        return <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    }
  }

  const renderScoreBar = (score: number) => {
    const percentage = score
    let barColor = 'bg-green-500'
    if (score < 30) barColor = 'bg-red-500'
    else if (score < 50) barColor = 'bg-orange-500'
    else if (score < 70) barColor = 'bg-yellow-500'
    else if (score < 90) barColor = 'bg-green-400'

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  const renderSummary = (summary: PerformanceAnalysisResult['summary']) => {
    const items = [
      { key: 'critical', label: t('Critical'), count: summary.critical, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
      { key: 'high', label: t('High'), count: summary.high, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
      { key: 'medium', label: t('Medium'), count: summary.medium, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
      { key: 'low', label: t('Low'), count: summary.low, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      { key: 'info', label: t('Info'), count: summary.info, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
    ]

    return (
      <div className="flex flex-wrap gap-2">
        {items.filter(item => item.count > 0).map(item => (
          <div
            key={item.key}
            className={`flex items-center space-x-1 px-2 py-1 rounded ${item.bg}`}
          >
            <span className={`text-sm font-medium ${item.color}`}>{item.count}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
        {items.every(item => item.count === 0) && (
          <div className="text-sm text-muted-foreground">
            {t('No issues found')}
          </div>
        )}
      </div>
    )
  }

  if (!hasRegex) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        <Lightning className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>{t('Enter a regular expression to analyze its performance')}</p>
      </div>
    )
  }

  if (!analysisResult) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        <p>{t('Analyzing...')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{t('Performance Score')}</Label>
          <span className={`text-lg font-bold ${getRiskLevelColor(analysisResult.riskLevel)}`}>
            {analysisResult.overallScore}/100
          </span>
        </div>
        {renderScoreBar(analysisResult.overallScore)}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getRiskLevelColor(analysisResult.riskLevel)}`}>
            {getRiskLevelLabel(analysisResult.riskLevel, t)}
          </span>
          {analysisResult.riskLevel === 'safe' && (
            <span className="flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              {t('No performance issues detected')}
            </span>
          )}
        </div>
      </div>

      {analysisResult.issues.length > 0 && (
        <div className="space-y-2">
          <Label>{t('Issue Summary')}</Label>
          {renderSummary(analysisResult.summary)}
        </div>
      )}

      {analysisResult.issues.length > 0 && (
        <div className="space-y-2">
          <Label>{t('Performance Issues')}</Label>
          <ScrollArea className="h-80 border rounded-md">
            <div className="p-2 space-y-2">
              {analysisResult.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`border-l-4 rounded-r-md p-3 transition-colors cursor-pointer ${
                    getSeverityColor(issue.severity)
                  } ${
                    hoveredIssue === issue.id ? 'ring-2 ring-ring' : ''
                  }`}
                  onMouseEnter={() => setHoveredIssue(issue.id)}
                  onMouseLeave={() => setHoveredIssue(null)}
                  onClick={() => toggleIssue(issue.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getSeverityIcon(issue.severity)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {getSeverityLabel(issue.severity, t)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t('Node')}: {issue.nodeType}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{issue.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>

                  {expandedIssues.has(issue.id) && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{t('Suggestion')}:</p>
                          <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                        </div>
                      </div>

                      {issue.example && (
                        <div className="mt-2 p-2 bg-background rounded-md border">
                          <p className="text-xs font-medium mb-2">{t('Example')}:</p>
                          <div className="flex items-center space-x-2 text-sm font-mono">
                            <span className="text-red-600 dark:text-red-400">{issue.example.before}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-green-600 dark:text-green-400">{issue.example.after}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground">
                    {expandedIssues.has(issue.id) ? t('Click to collapse') : t('Click to expand for details')}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {analysisResult.riskLevel === 'safe' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('Great! Your regular expression looks efficient.')}
            </span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
            {t('No potential performance issues were detected. The regex should run efficiently on most inputs.')}
          </p>
        </div>
      )}

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          <strong>{t('Tip:')}</strong> {t('Hover over issues to highlight the corresponding nodes in the graph. Click to see details and suggestions.')}
        </p>
      </div>
    </div>
  )
}

export default PerformancePanel
