import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Loginscreen from './login'

vi.mock('./firebase', () => ({ db: {}, auth: {} }))
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(() =>
    Promise.resolve({ user: { uid: 'test-uid-123' } })
  ),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve()),
}))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mock-doc-ref'),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

describe('Loginscreen', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('default view', () => {
    it('renders Create Account and Sign In buttons', () => {
      render(<Loginscreen />)
      expect(screen.getByText('Create Account')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('shows the Get Started heading', () => {
      render(<Loginscreen />)
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })

    it('does not show any form inputs initially', () => {
      render(<Loginscreen />)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('signup form', () => {
    it('shows the signup form after clicking Create Account', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      expect(screen.getByText('Create Account', { selector: 'h2' })).toBeInTheDocument()
    })

    it('renders username, email, and password fields', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Min. 6 characters')).toBeInTheDocument()
    })

    it('updates username as the user types', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      const input = screen.getByPlaceholderText('Choose a username')
      fireEvent.change(input, { target: { value: 'testuser' } })
      expect(input.value).toBe('testuser')
    })

    it('updates email as the user types', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      const input = screen.getByPlaceholderText('your@email.com')
      fireEvent.change(input, { target: { value: 'test@example.com' } })
      expect(input.value).toBe('test@example.com')
    })

    it('shows a validation error when fields are empty', async () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))
      await waitFor(() => {
        expect(screen.getByText('All fields are required.')).toBeInTheDocument()
      })
    })

    it('calls createUserWithEmailAndPassword with correct args on submit', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth')
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      fireEvent.change(screen.getByPlaceholderText('Choose a username'), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'pass123' } })
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))
      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'pass123'
        )
      })
    })

    it('saves user data to Firestore after signup', async () => {
      const { setDoc } = await import('firebase/firestore')
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      fireEvent.change(screen.getByPlaceholderText('Choose a username'), { target: { value: 'testuser' } })
      fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByPlaceholderText('Min. 6 characters'), { target: { value: 'pass123' } })
      fireEvent.click(screen.getByRole('button', { name: /create account/i }))
      await waitFor(() => {
        expect(setDoc).toHaveBeenCalledWith(
          'mock-doc-ref',
          expect.objectContaining({
            username: 'testuser',
            email: 'test@example.com',
          })
        )
      })
    })

    it('navigates to login view when "Sign in" link is clicked', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Create Account'))
      fireEvent.click(screen.getByText('Sign in'))
      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    })
  })

  describe('login form', () => {
    it('shows the Welcome Back heading', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Sign In'))
      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    })

    it('renders email and password fields', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Sign In'))
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
    })

    it('shows a validation error when fields are empty', async () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Sign In'))
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
      await waitFor(() => {
        expect(screen.getByText('Email and password are required.')).toBeInTheDocument()
      })
    })

    it('calls signInWithEmailAndPassword with correct args', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Sign In'))
      fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'user@example.com' } })
      fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'secret' } })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'user@example.com',
          'secret'
        )
      })
    })

    it('navigates back to signup view when "Create account" link is clicked', () => {
      render(<Loginscreen />)
      fireEvent.click(screen.getByText('Sign In'))
      fireEvent.click(screen.getByText('Create account'))
      expect(screen.getByText('Create Account', { selector: 'h2' })).toBeInTheDocument()
    })
  })
})
