import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Login from '@/routes/Login'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  it('renders login form', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText('auth.signIn')).toBeInTheDocument()
  })

  it('has email and password fields', () => {
    renderWithRouter(<Login />)
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
  })

  it('has Google and Phone tabs', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
  })

  it('has offline mode toggle', () => {
    renderWithRouter(<Login />)
    expect(screen.getByText('auth.offlineMode')).toBeInTheDocument()
  })

  it('submits email form', async () => {
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText('auth.email')
    const passwordInput = screen.getByLabelText('auth.password')
    const submitButton = screen.getByRole('button', { name: /auth.signIn/ })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })
})
