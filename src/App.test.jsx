import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

vi.mock('./firebase', () => ({ db: {}, auth: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mock-doc-ref'),
  getDoc: vi.fn(() => Promise.resolve({ data: () => null })),
}))
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
vi.mock('./about', () => ({
  default: () => <div data-testid="about">About Page</div>,
}))
vi.mock('./roadmap', () => ({
  default: ({ onPathwaySet }) => (
    <div data-testid="roadmap" onClick={() => onPathwaySet?.('frontend')}>Roadmap</div>
  ),
}))
vi.mock('./roadmapData', () => ({
  ROADMAPS: {
    frontend: { id: 'frontend', title: 'Frontend Developer' },
  },
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

  describe('About navigation (hero image click)', () => {
    it('adds the clicking class to the image immediately on click', () => {
      vi.useFakeTimers()
      render(<App />)
      const img = screen.getByAltText('climb the mountain')
      fireEvent.click(img)
      expect(img.className).toContain('hero-img--clicking')
      vi.useRealTimers()
    })

    it('navigates to the About page after the animation delay', async () => {
      vi.useFakeTimers()
      render(<App />)
      fireEvent.click(screen.getByAltText('climb the mountain'))
      await act(async () => { vi.runAllTimers() })
      expect(screen.getByTestId('about')).toBeInTheDocument()
      vi.useRealTimers()
    })

    it('shows the Back button on the About page', async () => {
      vi.useFakeTimers()
      render(<App />)
      fireEvent.click(screen.getByAltText('climb the mountain'))
      await act(async () => { vi.runAllTimers() })
      expect(screen.getByText('← Back')).toBeInTheDocument()
      vi.useRealTimers()
    })

    it('returns to home screen from About via Back button', async () => {
      vi.useFakeTimers()
      render(<App />)
      fireEvent.click(screen.getByAltText('climb the mountain'))
      await act(async () => { vi.runAllTimers() })
      fireEvent.click(screen.getByText('← Back'))
      expect(screen.getByText('Sudophus')).toBeInTheDocument()
      vi.useRealTimers()
    })
  })
})
