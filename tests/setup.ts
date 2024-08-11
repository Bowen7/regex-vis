import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import 'vitest-canvas-mock'

afterEach(() => {
  cleanup()
})
