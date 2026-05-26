import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Journal from './journal'

const mockUser = { uid: 'user-123', email: 'dev@example.com' }

// Default: Firestore returns two existing entries
const makeSnapshot = (docs = []) => ({
  docs: docs.map(({ id, text, createdAt }) => ({
    id,
    data: () => ({
      text,
      uid: mockUser.uid,
      createdAt: createdAt ? { toDate: () => createdAt } : null,
    }),
  })),
})

vi.mock('./firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve(makeSnapshot())),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new-doc-id' })),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

describe('Journal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // ── Static render ────────────────────────────────────────────────
  it('renders the entry number heading immediately', () => {
    render(<Journal entryC={3} user={mockUser} />)
    expect(screen.getByText('Journal entry: #3')).toBeInTheDocument()
  })

  it('renders a textarea for writing entries', () => {
    render(<Journal entryC={1} user={mockUser} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders a Save Entry button', () => {
    render(<Journal entryC={1} user={mockUser} />)
    expect(screen.getByText('Save Entry')).toBeInTheDocument()
  })

  it('Save Entry button is disabled when textarea is empty', () => {
    render(<Journal entryC={1} user={mockUser} />)
    expect(screen.getByText('Save Entry')).toBeDisabled()
  })

  // ── Loading state ────────────────────────────────────────────────
  it('shows loading skeleton while entries are being fetched', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockReturnValueOnce(new Promise(() => {}))
    render(<Journal entryC={1} user={mockUser} />)
    expect(document.querySelector('.entries-skeleton')).toBeInTheDocument()
  })

  it('shows "Loading your entries…" in meta while fetching', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockReturnValueOnce(new Promise(() => {}))
    render(<Journal entryC={1} user={mockUser} />)
    expect(screen.getByText('Loading your entries…')).toBeInTheDocument()
  })

  // ── Settled: empty ───────────────────────────────────────────────
  it('shows "No entries yet" meta when Firestore returns nothing', async () => {
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText('No entries yet — start writing')).toBeInTheDocument()
    })
  })

  // ── Settled: with data ───────────────────────────────────────────
  it('renders entries loaded from Firestore', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockResolvedValueOnce(
      makeSnapshot([
        { id: 'e1', text: 'Learned about useEffect today.', createdAt: new Date('2024-03-01T09:00:00') },
        { id: 'e2', text: 'Fixed a nasty race condition.', createdAt: new Date('2024-03-02T10:00:00') },
      ])
    )
    render(<Journal entryC={2} user={mockUser} />)
    expect(await screen.findByText('Learned about useEffect today.')).toBeInTheDocument()
    expect(screen.getByText('Fixed a nasty race condition.')).toBeInTheDocument()
  })

  it('shows entry count in meta after loading', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockResolvedValueOnce(
      makeSnapshot([
        { id: 'e1', text: 'Entry one.', createdAt: new Date() },
        { id: 'e2', text: 'Entry two.', createdAt: new Date() },
        { id: 'e3', text: 'Entry three.', createdAt: new Date() },
      ])
    )
    render(<Journal entryC={3} user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText('3 entries total')).toBeInTheDocument()
    })
  })

  it('uses singular "entry" in meta when exactly one entry exists', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockResolvedValueOnce(
      makeSnapshot([{ id: 'e1', text: 'Only entry.', createdAt: new Date() }])
    )
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText('1 entry total')).toBeInTheDocument()
    })
  })

  it('queries Firestore filtered by the current user uid', async () => {
    const { getDocs, where } = await import('firebase/firestore')
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => expect(getDocs).toHaveBeenCalled())
    expect(where).toHaveBeenCalledWith('uid', '==', mockUser.uid)
  })

  it('shows an error message when Firestore fetch fails', async () => {
    const { getDocs } = vi.mocked(await import('firebase/firestore'))
    getDocs.mockRejectedValueOnce(new Error('Network error'))
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => {
      expect(screen.getByText(/Could not load entries/i)).toBeInTheDocument()
    })
  })

  // ── Writing & saving ─────────────────────────────────────────────
  it('Save Entry button becomes enabled when textarea has text', async () => {
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => expect(screen.getByText('No entries yet — start writing')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Today I learned hooks.' } })
    expect(screen.getByText('Save Entry')).not.toBeDisabled()
  })

  it('updates the textarea as the user types', () => {
    render(<Journal entryC={1} user={mockUser} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Today I learned about hooks.' } })
    expect(textarea.value).toBe('Today I learned about hooks.')
  })

  it('clears the textarea after saving an entry', async () => {
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => expect(screen.getByText('No entries yet — start writing')).toBeInTheDocument())
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'My progress today.' } })
    fireEvent.click(screen.getByText('Save Entry'))
    await waitFor(() => expect(textarea.value).toBe(''))
  })

  it('calls addDoc with the entry text and uid on save', async () => {
    const { addDoc } = await import('firebase/firestore')
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => expect(screen.getByText('No entries yet — start writing')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Finished the feature.' } })
    fireEvent.click(screen.getByText('Save Entry'))
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ text: 'Finished the feature.', uid: 'user-123' })
      )
    })
  })

  it('prepends a new entry to the list without a page reload', async () => {
    render(<Journal entryC={1} user={mockUser} />)
    await waitFor(() => expect(screen.getByText('No entries yet — start writing')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Brand new entry.' } })
    fireEvent.click(screen.getByText('Save Entry'))
    await waitFor(() => expect(screen.getByText('Brand new entry.')).toBeInTheDocument())
  })
})
