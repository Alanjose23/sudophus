import { describe, it, expect } from 'vitest'
import quotes from './quotes'

describe('quotes array', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(quotes)).toBe(true)
    expect(quotes.length).toBeGreaterThan(0)
  })

  it('contains only non-empty strings', () => {
    quotes.forEach((quote, index) => {
      expect(typeof quote, `quotes[${index}] should be a string`).toBe('string')
      expect(quote.trim().length, `quotes[${index}] should not be empty`).toBeGreaterThan(0)
    })
  })

  it('each quote includes an attribution separated by " - "', () => {
    quotes.forEach((quote, index) => {
      expect(quote, `quotes[${index}] should contain attribution`).toContain(' - ')
    })
  })

  it('has no duplicate entries', () => {
    const unique = new Set(quotes)
    expect(unique.size).toBe(quotes.length)
  })

  it('has exactly 98 entries', () => {
    expect(quotes.length).toBe(98)
  })
})
