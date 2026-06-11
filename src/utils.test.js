import { describe, it, expect } from "vitest"
import {
  timeAgo, calcStreak, progressPct, progressColor, friendlyError, extractTags,
} from "./utils"

const daysAgo = n => new Date(Date.now() - n * 86400000)

describe("timeAgo", () => {
  it("returns 'just now' for very recent dates", () => {
    expect(timeAgo(new Date())).toBe("just now")
  })

  it("formats minutes and hours", () => {
    expect(timeAgo(new Date(Date.now() - 5 * 60000))).toBe("5m ago")
    expect(timeAgo(new Date(Date.now() - 3 * 3600000))).toBe("3h ago")
  })

  it("returns empty string for missing date", () => {
    expect(timeAgo(null)).toBe("")
  })
})

describe("calcStreak", () => {
  it("returns 0 for no entries", () => {
    expect(calcStreak([])).toBe(0)
  })

  it("counts consecutive days ending today", () => {
    const entries = [
      { createdAt: daysAgo(0) },
      { createdAt: daysAgo(1) },
      { createdAt: daysAgo(2) },
    ]
    expect(calcStreak(entries)).toBe(3)
  })

  it("still counts a streak that ended yesterday", () => {
    const entries = [{ createdAt: daysAgo(1) }, { createdAt: daysAgo(2) }]
    expect(calcStreak(entries)).toBe(2)
  })

  it("breaks on a gap", () => {
    const entries = [{ createdAt: daysAgo(0) }, { createdAt: daysAgo(2) }]
    expect(calcStreak(entries)).toBe(1)
  })

  it("returns 0 when the last entry is older than yesterday", () => {
    expect(calcStreak([{ createdAt: daysAgo(3) }])).toBe(0)
  })

  it("counts multiple entries on one day once", () => {
    const entries = [{ createdAt: daysAgo(0) }, { createdAt: daysAgo(0) }]
    expect(calcStreak(entries)).toBe(1)
  })
})

describe("progressPct", () => {
  it("computes a percentage", () => {
    expect(progressPct(5, 20)).toBe(25)
  })

  it("caps at 100", () => {
    expect(progressPct(50, 20)).toBe(100)
  })

  it("returns 0 without a target", () => {
    expect(progressPct(5, 0)).toBe(0)
  })
})

describe("progressColor", () => {
  it("maps thresholds to Halo signal colors", () => {
    expect(progressColor(100)).toBe("#2BE08C")
    expect(progressColor(60)).toBe("#7886FF")
    expect(progressColor(20)).toBe("#5B6BFF")
    expect(progressColor(0)).toBe("#3A3D4A")
  })
})

describe("friendlyError", () => {
  it("maps known auth codes", () => {
    expect(friendlyError("auth/wrong-password")).toBe("Incorrect email or password.")
    expect(friendlyError("auth/weak-password")).toMatch(/at least 6 characters/)
  })

  it("falls back for unknown codes", () => {
    expect(friendlyError("auth/unknown")).toMatch(/Something went wrong/)
  })
})

describe("extractTags", () => {
  it("extracts lowercase unique hashtags", () => {
    expect(extractTags("Worked on #React and #react and #type-script")).toEqual([
      "#react",
      "#type-script",
    ])
  })

  it("returns empty array for plain text or empty input", () => {
    expect(extractTags("no tags here")).toEqual([])
    expect(extractTags("")).toEqual([])
    expect(extractTags(null)).toEqual([])
  })
})
