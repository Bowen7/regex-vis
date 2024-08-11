import { expect, it } from 'vitest'
import { removeBackslash } from '../backslash'

it('remove backslash', () => {
  expect(removeBackslash('\\n')).toBe('\\n')
  expect(removeBackslash('\\\\n')).toBe('\\n')
  expect(removeBackslash('\\.')).toBe('.')
  expect(removeBackslash('\\\\.')).toBe('\\.')
  expect(() => removeBackslash('\\')).toThrow('Invalid escape sequence')
})
