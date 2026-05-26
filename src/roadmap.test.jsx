import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Roadmap from './roadmap'
import { getDoc, setDoc } from 'firebase/firestore'

const mockUser = { uid: 'user-123', email: 'dev@example.com' }

vi.mock('./firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mock-doc-ref'),
  getDoc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => null),
}))

const noPathwaySnap = { data: () => null }
const frontendSnap = {
  data: () => ({
    activePathway: 'frontend',
    progress: { frontend: ['html', 'css'] },
  }),
}

describe('Roadmap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loading', () => {
    it('shows loading state before the Firestore document resolves', () => {
      getDoc.mockReturnValue(new Promise(() => {}))
      render(<Roadmap user={mockUser} />)
      expect(screen.getByTestId('roadmap-loading')).toBeInTheDocument()
    })
  })

  describe('pathway selector (no pathway set)', () => {
    beforeEach(() => {
      getDoc.mockResolvedValue(noPathwaySnap)
    })

    it('shows the "Choose your pathway" heading', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByText('Choose your pathway')).toBeInTheDocument()
      })
    })

    it('renders a card for every available pathway', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
        expect(screen.getByText('Backend Developer')).toBeInTheDocument()
        expect(screen.getByText('DevOps / SRE')).toBeInTheDocument()
        expect(screen.getByText('Full Stack Developer')).toBeInTheDocument()
        expect(screen.getByText('Data Science / ML')).toBeInTheDocument()
        expect(screen.getByText('Cybersecurity')).toBeInTheDocument()
      })
    })

    it('includes a roadmap.sh attribution link', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /roadmap\.sh/i })).toBeInTheDocument()
      })
    })

    it('calls setDoc and navigates to progress view when a pathway is selected', async () => {
      const onPathwaySet = vi.fn()
      render(<Roadmap user={mockUser} onPathwaySet={onPathwaySet} />)
      await waitFor(() => screen.getByText('Frontend Developer'))
      fireEvent.click(screen.getByText('Frontend Developer'))
      await waitFor(() => {
        expect(setDoc).toHaveBeenCalledOnce()
        expect(onPathwaySet).toHaveBeenCalledWith('frontend')
        expect(screen.getByText('Active Pathway')).toBeInTheDocument()
      })
    })
  })

  describe('progress tracker (pathway already set)', () => {
    beforeEach(() => {
      getDoc.mockResolvedValue(frontendSnap)
    })

    it('shows the "Active Pathway" label and the pathway title', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByText('Active Pathway')).toBeInTheDocument()
        expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument()
      })
    })

    it('displays the overall progress percentage', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByTestId('overall-pct')).toBeInTheDocument()
      })
    })

    it('renders topic checkboxes for every topic in the pathway', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes.length).toBeGreaterThan(0)
      })
    })

    it('pre-checks topics that are recorded as completed', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        const checked = screen.getAllByRole('checkbox', { checked: true })
        expect(checked.length).toBe(2)
      })
    })

    it('calls setDoc when a topic checkbox is toggled', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => screen.getAllByRole('checkbox'))
      const unchecked = screen.getAllByRole('checkbox').find(c => !c.checked)
      fireEvent.click(unchecked)
      await waitFor(() => {
        expect(setDoc).toHaveBeenCalled()
      })
    })

    it('shows a "Change path" button', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        expect(screen.getByText('Change path')).toBeInTheDocument()
      })
    })

    it('returns to the pathway selector when "Change path" is clicked', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => screen.getByText('Change path'))
      fireEvent.click(screen.getByText('Change path'))
      expect(screen.getByText('Choose your pathway')).toBeInTheDocument()
    })

    it('shows a link to the roadmap.sh page for the active pathway', async () => {
      render(<Roadmap user={mockUser} />)
      await waitFor(() => {
        const link = screen.getByRole('link', { name: /roadmap\.sh/i })
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('href', expect.stringContaining('roadmap.sh'))
      })
    })
  })
})
