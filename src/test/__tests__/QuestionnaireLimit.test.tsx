import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Questionnaire from '@/routes/Questionnaire'
import { useAuthStore } from '@/store/auth'

describe('Questionnaire Global Selection Limit (Max 2)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      profile: {
        uid: 'test-user',
        email: 'test@example.com',
        educationLevel: '12th',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })
  })

  it('strictly limits selections to a maximum of 2 globally across questions', async () => {
    render(
      <BrowserRouter>
        <Questionnaire />
      </BrowserRouter>
    )

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText('WHAT SPARKS YOUR CURIOSITY?')).toBeInTheDocument()
    })

    // Find checkboxes
    const checkboxes = await screen.findAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThanOrEqual(3)

    // 1. Select first option
    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()
    expect(screen.getByText(/SELECT UP TO 2 OPTIONS \(1\/2\)/)).toBeInTheDocument()

    // 2. Select second option (in another question/option)
    fireEvent.click(checkboxes[1])
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(screen.getByText(/SELECT UP TO 2 OPTIONS \(2\/2\)/)).toBeInTheDocument()

    // 3. Attempt to select a third option -> MUST BE BLOCKED
    fireEvent.click(checkboxes[2])
    expect(checkboxes[2]).not.toBeChecked()
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(screen.getByText(/SELECT UP TO 2 OPTIONS \(2\/2\)/)).toBeInTheDocument()

    // 4. Deselect one of the selected options -> count goes down to 1
    fireEvent.click(checkboxes[1])
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[0]).toBeChecked()
    expect(screen.getByText(/SELECT UP TO 2 OPTIONS \(1\/2\)/)).toBeInTheDocument()

    // 5. Now select the 3rd checkbox as the replacement -> WORKS
    fireEvent.click(checkboxes[2])
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).toBeChecked()
    expect(screen.getByText(/SELECT UP TO 2 OPTIONS \(2\/2\)/)).toBeInTheDocument()
  })
})
