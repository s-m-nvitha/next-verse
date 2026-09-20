import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Landing from '@/routes/Landing'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Landing Page', () => {
  it('renders the main heading', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText('NEXT VERSE')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText('app.tagline')).toBeInTheDocument()
  })

  it('renders student and parent options', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText('landing.student')).toBeInTheDocument()
    expect(screen.getByText('landing.parent')).toBeInTheDocument()
  })

  it('has navigation links', () => {
    renderWithRouter(<Landing />)
    const studentLink = screen.getByRole('link', { name: /landing.student/ })
    const parentLink = screen.getByRole('link', { name: /landing.parent/ })
    
    expect(studentLink).toHaveAttribute('href', '/login')
    expect(parentLink).toHaveAttribute('href', '/parent/login')
  })
})
