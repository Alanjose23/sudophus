import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Project from './project'
import { calcStreak, progressPct, progressColor } from './projectHelpers'
import { getDocs, addDoc, updateDoc } from 'firebase/firestore'
import { uploadBytesResumable, deleteObject } from 'firebase/storage'

const mockUser = { uid: 'user-123', email: 'dev@example.com' }

vi.mock('./firebase', () => ({ db: {}, storage: {} }))
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => 'mock-storage-ref'),
  uploadBytesResumable: vi.fn(() => ({
    on: vi.fn((_, _progress, _error, onComplete) => { Promise.resolve().then(onComplete) }),
    snapshot: { ref: 'mock-storage-ref' },
  })),
  getDownloadURL: vi.fn(() => Promise.resolve('https://storage.example.com/shot.jpg')),
  deleteObject: vi.fn(() => Promise.resolve()),
}))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-doc-id' })),
  getDocs: vi.fn(),
  doc: vi.fn(() => 'mock-doc-ref'),
  updateDoc: vi.fn(() => Promise.resolve()),
  query: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => null),
}))

const makeSnap = items => ({
  docs: items.map((data, i) => ({ id: `doc-${i}`, data: () => data })),
})

const sampleProject = {
  title: 'Test App',
  description: 'A test project',
  target: 10,
  tags: ['React'],
  starred: false,
  uid: 'user-123',
  createdAt: { seconds: 1000, toDate: () => new Date('2026-01-01') },
}

const sampleEntry = {
  text: 'Worked on auth',
  uid: 'user-123',
  projectId: 'doc-0',
  createdAt: new Date('2026-05-26T12:00:00Z'),
}

describe('helpers', () => {
  describe('calcStreak', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-05-26T12:00:00Z'))
    })
    afterEach(() => vi.useRealTimers())

    it('returns 0 for empty entries', () => {
      expect(calcStreak([])).toBe(0)
    })

    it('returns 1 for a single entry today', () => {
      expect(calcStreak([{ createdAt: new Date('2026-05-26T09:00:00Z') }])).toBe(1)
    })

    it('returns 1 for a single entry yesterday', () => {
      expect(calcStreak([{ createdAt: new Date('2026-05-25T09:00:00Z') }])).toBe(1)
    })

    it('returns 0 for an entry older than yesterday', () => {
      expect(calcStreak([{ createdAt: new Date('2026-05-24T09:00:00Z') }])).toBe(0)
    })

    it('counts consecutive days from today', () => {
      const entries = [
        { createdAt: new Date('2026-05-26T09:00:00Z') },
        { createdAt: new Date('2026-05-25T09:00:00Z') },
        { createdAt: new Date('2026-05-24T09:00:00Z') },
      ]
      expect(calcStreak(entries)).toBe(3)
    })

    it('stops counting at a gap in the streak', () => {
      const entries = [
        { createdAt: new Date('2026-05-26T09:00:00Z') },
        { createdAt: new Date('2026-05-24T09:00:00Z') },
      ]
      expect(calcStreak(entries)).toBe(1)
    })

    it('counts multiple entries on the same day as one streak day', () => {
      const entries = [
        { createdAt: new Date('2026-05-26T09:00:00Z') },
        { createdAt: new Date('2026-05-26T15:00:00Z') },
        { createdAt: new Date('2026-05-25T09:00:00Z') },
      ]
      expect(calcStreak(entries)).toBe(2)
    })
  })

  describe('progressPct', () => {
    it('returns 0 for 0 entries', () => {
      expect(progressPct(0, 20)).toBe(0)
    })

    it('returns 50 for half of target', () => {
      expect(progressPct(10, 20)).toBe(50)
    })

    it('returns 100 for full target', () => {
      expect(progressPct(20, 20)).toBe(100)
    })

    it('caps at 100 when over target', () => {
      expect(progressPct(25, 20)).toBe(100)
    })

    it('returns 0 when target is 0', () => {
      expect(progressPct(5, 0)).toBe(0)
    })
  })

  describe('progressColor', () => {
    it('returns muted color for 0%', () => {
      expect(progressColor(0)).toBe('#475569')
    })

    it('returns indigo for 20%', () => {
      expect(progressColor(20)).toBe('#6366f1')
    })

    it('returns amber for 60%', () => {
      expect(progressColor(60)).toBe('#f59e0b')
    })

    it('returns green for 100%', () => {
      expect(progressColor(100)).toBe('#22c55e')
    })
  })
})

describe('Project component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getDocs.mockResolvedValue(makeSnap([]))
  })

  it('shows loading state before data arrives', () => {
    getDocs.mockImplementation(() => new Promise(() => {}))
    render(<Project user={mockUser} />)
    expect(screen.getByTestId('proj-loading')).toBeInTheDocument()
  })

  it('shows empty state when there are no projects', async () => {
    render(<Project user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  it('shows + New project button', async () => {
    render(<Project user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText('+ New project')).toBeInTheDocument()
    })
  })

  it('renders project cards when projects exist', async () => {
    getDocs
      .mockResolvedValueOnce(makeSnap([sampleProject]))
      .mockResolvedValueOnce(makeSnap([]))
    render(<Project user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByTestId('project-grid')).toBeInTheDocument()
      expect(screen.getByText('Test App')).toBeInTheDocument()
    })
  })

  it('shows sessions count on cards', async () => {
    getDocs
      .mockResolvedValueOnce(makeSnap([sampleProject]))
      .mockResolvedValueOnce(makeSnap([sampleEntry]))
    render(<Project user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText(/1 \/ 10 sessions/)).toBeInTheDocument()
    })
  })

  describe('create project form', () => {
    beforeEach(async () => {
      render(<Project user={mockUser} />)
      await waitFor(() => screen.getByText('+ New project'))
      fireEvent.click(screen.getByText('+ New project'))
    })

    it('shows the create form', () => {
      expect(screen.getByText('New Project')).toBeInTheDocument()
    })

    it('shows an error when title is empty on submit', async () => {
      fireEvent.click(screen.getByTestId('create-submit'))
      await waitFor(() => {
        expect(screen.getByTestId('form-error')).toBeInTheDocument()
      })
    })

    it('calls addDoc when form is submitted with a title', async () => {
      fireEvent.change(screen.getByPlaceholderText('Project name'), {
        target: { value: 'New App' },
      })
      fireEvent.click(screen.getByTestId('create-submit'))
      await waitFor(() => {
        expect(addDoc).toHaveBeenCalledOnce()
      })
    })

    it('returns to list after successful creation', async () => {
      fireEvent.change(screen.getByPlaceholderText('Project name'), {
        target: { value: 'New App' },
      })
      fireEvent.click(screen.getByTestId('create-submit'))
      await waitFor(() => {
        expect(screen.getByText('+ New project')).toBeInTheDocument()
      })
    })

    it('returns to list when Cancel is clicked', () => {
      fireEvent.click(screen.getByText('Cancel'))
      expect(screen.getByText('+ New project')).toBeInTheDocument()
    })
  })

  describe('detail view', () => {
    beforeEach(async () => {
      getDocs
        .mockResolvedValueOnce(makeSnap([sampleProject]))
        .mockResolvedValueOnce(makeSnap([sampleEntry]))
      render(<Project user={mockUser} />)
      await waitFor(() => screen.getByText('Test App'))
      fireEvent.click(screen.getByText('Test App'))
    })

    it('navigates to detail view on card click', () => {
      expect(screen.getByTestId('sessions-count')).toBeInTheDocument()
    })

    it('shows the project title', () => {
      expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    })

    it('shows the session count', () => {
      expect(screen.getByTestId('sessions-count')).toHaveTextContent('1')
    })

    it('shows progress percentage', () => {
      expect(screen.getByTestId('progress-pct')).toHaveTextContent('10%')
    })

    it('shows loaded entries', () => {
      expect(screen.getByTestId('entry-item')).toBeInTheDocument()
      expect(screen.getByText('Worked on auth')).toBeInTheDocument()
    })

    it('log button is disabled when textarea is empty', () => {
      expect(screen.getByTestId('log-btn')).toBeDisabled()
    })

    it('logs a session and updates the session count', async () => {
      fireEvent.change(screen.getByTestId('log-textarea'), {
        target: { value: 'Added new feature' },
      })
      fireEvent.click(screen.getByTestId('log-btn'))
      await waitFor(() => {
        expect(addDoc).toHaveBeenCalled()
        expect(screen.getByTestId('sessions-count')).toHaveTextContent('2')
      })
    })

    it('clears the textarea after logging a session', async () => {
      const textarea = screen.getByTestId('log-textarea')
      fireEvent.change(textarea, { target: { value: 'Added new feature' } })
      fireEvent.click(screen.getByTestId('log-btn'))
      await waitFor(() => expect(textarea.value).toBe(''))
    })

    it('back button returns to the project list', async () => {
      fireEvent.click(screen.getByText('← Projects'))
      await waitFor(() => {
        expect(screen.getByTestId('project-grid')).toBeInTheDocument()
      })
    })
  })

  describe('star toggle', () => {
    beforeEach(async () => {
      getDocs
        .mockResolvedValueOnce(makeSnap([sampleProject]))
        .mockResolvedValueOnce(makeSnap([]))
      render(<Project user={mockUser} />)
      await waitFor(() => screen.getByText('Test App'))
    })

    it('calls updateDoc when the star is clicked on a card', async () => {
      fireEvent.click(screen.getByTitle('Star'))
      await waitFor(() => {
        expect(updateDoc).toHaveBeenCalledOnce()
      })
    })

    it('toggles the star visually', async () => {
      fireEvent.click(screen.getByTitle('Star'))
      await waitFor(() => {
        expect(screen.getByTitle('Unstar')).toBeInTheDocument()
      })
    })
  })

  describe('screenshots', () => {
    const projectWithScreenshots = {
      ...sampleProject,
      screenshots: [{
        url: 'https://storage.example.com/existing.jpg',
        name: 'existing.jpg',
        storagePath: 'screenshots/user-123/doc-0/123_existing.jpg',
        uploadedAt: new Date('2026-05-01'),
      }],
    }

    const navigateToDetail = async (projectData = sampleProject) => {
      getDocs
        .mockResolvedValueOnce(makeSnap([projectData]))
        .mockResolvedValueOnce(makeSnap([]))
      render(<Project user={mockUser} />)
      await waitFor(() => screen.getByText('Test App'))
      fireEvent.click(screen.getByText('Test App'))
    }

    it('shows the Screenshots section heading', async () => {
      await navigateToDetail()
      expect(screen.getByText('Screenshots')).toBeInTheDocument()
    })

    it('shows empty state text when no screenshots exist', async () => {
      await navigateToDetail()
      expect(screen.getByText(/no screenshots yet/i)).toBeInTheDocument()
    })

    it('shows the add screenshot button', async () => {
      await navigateToDetail()
      expect(screen.getByText('+ Add screenshot')).toBeInTheDocument()
    })

    it('renders existing screenshots as thumbnails', async () => {
      await navigateToDetail(projectWithScreenshots)
      expect(screen.getByTestId('screenshots-grid')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'existing.jpg' })).toBeInTheDocument()
    })

    it('uploads a file and displays the new thumbnail', async () => {
      await navigateToDetail()
      const input = screen.getByTestId('screenshot-input')
      const file = new File(['data'], 'new-shot.png', { type: 'image/png' })
      fireEvent.change(input, { target: { files: [file] } })
      await waitFor(() => {
        expect(uploadBytesResumable).toHaveBeenCalled()
        expect(screen.getByRole('img', { name: 'new-shot.png' })).toBeInTheDocument()
      })
    })

    it('removes a screenshot and calls deleteObject', async () => {
      await navigateToDetail(projectWithScreenshots)
      fireEvent.click(screen.getByTestId('screenshot-delete'))
      await waitFor(() => {
        expect(deleteObject).toHaveBeenCalled()
        expect(screen.queryByRole('img', { name: 'existing.jpg' })).not.toBeInTheDocument()
      })
    })
  })
})
