import { fireEvent, getByText, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '@testing-library/dom'
import App from '../src/App'

describe('app', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders graph after inputting', async () => {
    render(<App />)
    expect(screen.getAllByTestId('graph').length).toBe(13)

    await act(async () => {
      const input = screen.getAllByTestId('regex-input')[0]
      fireEvent.change(input, { target: { value: 'abc' } })
      vi.advanceTimersByTime(500)
    })

    expect(screen.getAllByTestId('graph').length).toBe(14)
  })

  it('updates graph after editing', async () => {
    render(<App />)

    await act(async () => {
      const input = screen.getByTestId('regex-input')
      fireEvent.change(input, { target: { value: 'abc' } })
      vi.advanceTimersByTime(500)

      fireEvent.click(getByText(screen.getAllByTestId('graph')[0], 'abc'), {
        bubbles: true,
      })
    })

    await act(async () => {
      const input = screen
        .getByTestId('edit-tab')
        .querySelector('input[type=\'text\']')
      fireEvent.change(input!, { target: { value: 'abcd' } })
      vi.advanceTimersByTime(500)
    })

    expect((screen.getByTestId('regex-input') as HTMLInputElement).value).toBe(
      'abcd',
    )
    expect(
      getByText(screen.getAllByTestId('graph')[0], 'abcd'),
    ).toBeInTheDocument()
  })
})
