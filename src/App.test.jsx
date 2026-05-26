import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

vi.mock('./firebase', () => ({ db: {}, auth: {} }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null) // simulate signed-out state
    return vi.fn()
  }),
  signOut: vi.fn(() => Promise.resolve()),
}))
vi.mock('./login', () => ({
  default: () => <div data-testid="loginscreen">Login Screen</div>,
}))
vi.mock('./journal', () => ({
  default: ({ entryC }) => <div data-testid="journal">Journal #{entryC}</div>,
}))
vi.mock('./project', () => ({
  default: () => <div data-testid="project">Project</div>,
}))

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('home screen', () => {
    it('renders the Sudophus heading', () => {
      render(<App />)
      expect(screen.getByText('Sudophus')).toBeInTheDocument()
    })

    it('renders Journal and Projects cards', () => {
      render(<App />)
      expect(screen.getByText('Journal')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
    })

    it('renders a Login button when not authenticated', () => {
      render(<App />)
      expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it('renders a Sign In card when not authenticated', () => {
      render(<App />)
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('displays a quote in italics on load', () => {
      render(<App />)
      const quoteEl = document.querySelector('i')
      expect(quoteEl).toBeTruthy()
      expect(quoteEl.textContent.trim().length).toBeGreaterThan(0)
    })

    it('renders a Refresh quote button', () => {
      render(<App />)
      expect(screen.getByText('Refresh quote')).toBeInTheDocument()
    })

    it('updates the quote when Refresh quote is clicked', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.5)
      render(<App />)
      const before = document.querySelector('i').textContent
      fireEvent.click(screen.getByText('Refresh quote'))
      const after = document.querySelector('i').textContent
      expect(after).not.toBe(before)
    })

    it('does not show a count badge before Journal is visited', () => {
      render(<App />)
      expect(screen.queryByTestId('journal-count')).not.toBeInTheDocument()
    })
  })

  describe('Login navigation', () => {
    it('shows Loginscreen when Login nav button is clicked', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Login'))
      expect(screen.getByTestId('loginscreen')).toBeInTheDocument()
    })

    it('shows a Back button on the login screen', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Login'))
      expect(screen.getByText('← Back')).toBeInTheDocument()
    })

    it('returns to home screen via Back button', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Login'))
      fireEvent.click(screen.getByText('← Back'))
      expect(screen.getByText('Sudophus')).toBeInTheDocument()
    })
  })

  describe('Journal navigation (unauthenticated)', () => {
    it('shows Loginscreen instead of Journal when not signed in', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Journal'))
      expect(screen.getByTestId('loginscreen')).toBeInTheDocument()
      expect(screen.queryByTestId('journal')).not.toBeInTheDocument()
    })

    it('shows a count badge after visiting the journal', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Journal'))
      fireEvent.click(screen.getByText('← Back'))
      expect(screen.getByTestId('journal-count')).toHaveTextContent('1')
    })

    it('returns to home screen via Back button', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Journal'))
      fireEvent.click(screen.getByText('← Back'))
      expect(screen.getByText('Sudophus')).toBeInTheDocument()
    })
  })

  describe('Projects navigation (unauthenticated)', () => {
    it('shows Loginscreen instead of Project when not signed in', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Projects'))
      expect(screen.getByTestId('loginscreen')).toBeInTheDocument()
      expect(screen.queryByTestId('project')).not.toBeInTheDocument()
    })

    it('returns to home screen via Back button', () => {
      render(<App />)
      fireEvent.click(screen.getByText('Projects'))
      fireEvent.click(screen.getByText('← Back'))
      expect(screen.getByText('Sudophus')).toBeInTheDocument()
    })
  })
})
