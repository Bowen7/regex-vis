import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  CaretLeft,
  CaretRight,
  ArrowClockwise,
  Info,
  Warning,
  CheckCircle,
  XCircle
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RegexExecutor, ExecutionStep, ExecutionResult, createExecutionState } from '@/utils/regex-executor'
import type { AST } from '@/parser'

type Props = {
  ast: AST.Regex
  onNodeHighlight: (nodeId: string | null) => void
  onStringPosition: (position: number) => void
}

function ExecutorPanel({ ast, onNodeHighlight, onStringPosition }: Props) {
  const { t } = useTranslation()
  const [testString, setTestString] = useState('')
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(500)
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  const hasRegex = ast.body.length > 0

  const currentStep = useMemo(() => {
    if (!executionResult || currentStepIndex < 0 || currentStepIndex >= executionResult.steps.length) {
      return null
    }
    return executionResult.steps[currentStepIndex]
  }, [executionResult, currentStepIndex])

  useEffect(() => {
    if (currentStep) {
      onNodeHighlight(currentStep.nodeId)
      onStringPosition(currentStep.stringIndex)
    } else {
      onNodeHighlight(null)
      onStringPosition(0)
    }
  }, [currentStep, onNodeHighlight, onStringPosition])

  useEffect(() => {
    if (currentStep && stepsRef.current) {
      const stepElement = stepsRef.current.querySelector(`[data-step-index="${currentStepIndex}"]`)
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentStepIndex])

  const handleExecute = () => {
    if (!testString || !hasRegex) return
    
    const executor = new RegexExecutor(ast, testString)
    const result = executor.execute()
    setExecutionResult(result)
    setCurrentStepIndex(-1)
    setIsPlaying(false)
  }

  const handleStepForward = () => {
    if (!executionResult) return
    
    if (currentStepIndex < executionResult.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handleStepBackward = () => {
    if (!executionResult) return
    
    if (currentStepIndex > -1) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleJumpToStart = () => {
    setCurrentStepIndex(-1)
    setIsPlaying(false)
  }

  const handleJumpToEnd = () => {
    if (executionResult) {
      setCurrentStepIndex(executionResult.steps.length - 1)
      setIsPlaying(false)
    }
  }

  const handlePlayPause = () => {
    if (!executionResult) return
    
    if (isPlaying) {
      setIsPlaying(false)
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
    } else {
      if (currentStepIndex >= executionResult.steps.length - 1) {
        setCurrentStepIndex(-1)
      }
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (isPlaying && executionResult) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
      
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= executionResult.steps.length - 1) {
            setIsPlaying(false)
            if (playIntervalRef.current) {
              clearInterval(playIntervalRef.current)
              playIntervalRef.current = null
            }
            return prev
          }
          return prev + 1
        })
      }, playSpeed)
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
        playIntervalRef.current = null
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, playSpeed, executionResult])

  const getStepIcon = (step: ExecutionStep) => {
    switch (step.action) {
      case 'match':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'backtrack':
        return <Warning className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getStepActionLabel = (step: ExecutionStep): string => {
    switch (step.action) {
      case 'match': return t('Match')
      case 'fail': return t('Fail')
      case 'success': return t('Success')
      case 'backtrack': return t('Backtrack')
      case 'advance': return t('Advance')
      case 'group-start': return t('Group Start')
      case 'group-end': return t('Group End')
      default: return step.action
    }
  }

  const renderStringHighlight = () => {
    if (!testString || !currentStep) return null

    const pos = currentStep.stringIndex
    const before = testString.substring(0, pos)
    const current = testString[pos] || ''
    const after = testString.substring(pos + 1)

    return (
      <div className="font-mono text-sm bg-muted p-3 rounded-md break-all">
        <span className="text-muted-foreground">{before}</span>
        {current && (
          <span className="bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white px-1 rounded font-bold">
            {current === ' ' ? '␣' : current === '\n' ? '↵' : current}
          </span>
        )}
        <span className="text-muted-foreground">{after}</span>
        {pos >= testString.length && (
          <span className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-1 rounded font-bold ml-1">
            ∅
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="executor-test-string">{t('Test String for Step Execution')}</Label>
        <div className="flex space-x-2">
          <Input
            id="executor-test-string"
            value={testString}
            onChange={(value) => setTestString(value)}
            placeholder={t('Enter string to test step-by-step execution')}
            className="font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExecute()
              }
            }}
          />
          <Button
            onClick={handleExecute}
            disabled={!testString || !hasRegex}
            className="whitespace-nowrap"
          >
            {t('Execute')}
          </Button>
        </div>
      </div>

      {executionResult && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleJumpToStart}
                title={t('Jump to start')}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStepBackward}
                disabled={currentStepIndex <= -1}
                title={t('Step backward')}
              >
                <CaretLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                title={isPlaying ? t('Pause') : t('Play')}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStepForward}
                disabled={!executionResult || currentStepIndex >= executionResult.steps.length - 1}
                title={t('Step forward')}
              >
                <CaretRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleJumpToEnd}
                title={t('Jump to end')}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setExecutionResult(null)
                  setCurrentStepIndex(-1)
                  setIsPlaying(false)
                }}
                title={t('Reset')}
              >
                <ArrowClockwise className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-xs">{t('Speed:')}</Label>
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="text-xs border rounded px-2 py-1 bg-background"
              >
                <option value={1000}>{t('Slow')} (1s)</option>
                <option value={500}>{t('Normal')} (0.5s)</option>
                <option value={250}>{t('Fast')} (0.25s)</option>
                <option value={100}>{t('Very Fast')} (0.1s)</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {t('Step')} {currentStepIndex + 1} / {executionResult.steps.length}
            {' | '}
            {executionResult.isSuccess ? (
              <span className="text-green-600 dark:text-green-400">{t('Match Succeeded')}</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">{t('Match Failed')}</span>
            )}
            {executionResult.finalMatchedString && (
              <span>
                {' | '}
                {t('Matched:')} "{executionResult.finalMatchedString}"
              </span>
            )}
          </div>

          {currentStep && (
            <div className="space-y-2">
              <Label>{t('Current Position')}</Label>
              {renderStringHighlight()}
              <div className="text-sm">
                <strong>{getStepActionLabel(currentStep)}:</strong> {currentStep.description}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('Execution Steps')}</Label>
            <ScrollArea className="h-64 border rounded-md">
              <div ref={stepsRef} className="p-2 space-y-1">
                {executionResult.steps.map((step, index) => (
                  <div
                    key={index}
                    data-step-index={index}
                    className={`flex items-start space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                      index === currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    } ${step.isBacktrack ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                    onClick={() => {
                      setCurrentStepIndex(index)
                      setIsPlaying(false)
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-mono">
                          {t('Pos')}: {step.stringIndex}
                        </span>
                      </div>
                      <div className="text-sm font-medium truncate">
                        {step.nodeDescription || t('Start')}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {!executionResult && hasRegex && (
        <div className="text-sm text-muted-foreground text-center py-8">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{t('Enter a test string and click Execute to start step-by-step execution')}</p>
        </div>
      )}

      {!hasRegex && (
        <div className="text-sm text-muted-foreground text-center py-8">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{t('Enter a regular expression first to use the step executor')}</p>
        </div>
      )}
    </div>
  )
}

export default ExecutorPanel
