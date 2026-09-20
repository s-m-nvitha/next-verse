import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Mock the store
vi.mock('@/store/ui', () => ({
  useUIStore: () => ({
    language: 'en',
    setLanguage: vi.fn(),
  }),
}))

describe('Language Switcher', () => {
  it('renders language switcher', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows current language', () => {
    render(<LanguageSwitcher />)
    // Should show globe icon
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<LanguageSwitcher />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should show language options
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('हिन्दी')).toBeInTheDocument()
    expect(screen.getByText('ಕನ್ನಡ')).toBeInTheDocument()
  })
})
