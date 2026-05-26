import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Project from './project'

const mockUser = { uid: 'user-123', email: 'dev@example.com' }

describe('Project', () => {
  it('renders the project title', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText('My First Project')).toBeInTheDocument()
  })

  it('renders the project description', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText(/coding journal tracker/i)).toBeInTheDocument()
  })

  it('displays the logged-in user email', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText('by dev@example.com')).toBeInTheDocument()
  })

  it('renders project tags', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Firebase')).toBeInTheDocument()
    expect(screen.getByText('Journal')).toBeInTheDocument()
  })

  it('shows an empty star by default', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText('☆')).toBeInTheDocument()
    expect(screen.queryByText('★')).not.toBeInTheDocument()
  })

  it('fills the star when clicked', () => {
    render(<Project user={mockUser} />)
    fireEvent.click(screen.getByText('☆'))
    expect(screen.getByText('★')).toBeInTheDocument()
    expect(screen.queryByText('☆')).not.toBeInTheDocument()
  })

  it('unfills the star when clicked a second time', () => {
    render(<Project user={mockUser} />)
    fireEvent.click(screen.getByText('☆'))
    fireEvent.click(screen.getByText('★'))
    expect(screen.getByText('☆')).toBeInTheDocument()
    expect(screen.queryByText('★')).not.toBeInTheDocument()
  })

  it('the star has pointer cursor styling', () => {
    render(<Project user={mockUser} />)
    expect(screen.getByText('☆')).toHaveStyle({ cursor: 'pointer' })
  })
})
