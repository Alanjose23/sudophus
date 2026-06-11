import { describe, it, expect } from "vitest"
import {
  normalizeLinkedInUrl, buildProjectPost, buildMilestonePost, buildWeeklyDigestPost,
} from "./linkedin"

describe("normalizeLinkedInUrl", () => {
  it("accepts bare profile paths and adds https + www", () => {
    expect(normalizeLinkedInUrl("linkedin.com/in/jane")).toBe("https://www.linkedin.com/in/jane")
  })

  it("accepts full URLs and strips trailing slashes", () => {
    expect(normalizeLinkedInUrl("https://www.linkedin.com/in/jane-doe/")).toBe(
      "https://www.linkedin.com/in/jane-doe"
    )
  })

  it("accepts company pages", () => {
    expect(normalizeLinkedInUrl("linkedin.com/company/acme")).toBe(
      "https://www.linkedin.com/company/acme"
    )
  })

  it("rejects non-LinkedIn hosts", () => {
    expect(normalizeLinkedInUrl("https://example.com/in/jane")).toBeNull()
    expect(normalizeLinkedInUrl("https://evil-linkedin.com/in/jane")).toBeNull()
  })

  it("rejects non-profile paths and garbage", () => {
    expect(normalizeLinkedInUrl("linkedin.com/feed")).toBeNull()
    expect(normalizeLinkedInUrl("not a url at all :::")).toBeNull()
    expect(normalizeLinkedInUrl("")).toBeNull()
    expect(normalizeLinkedInUrl(null)).toBeNull()
  })
})

describe("buildProjectPost", () => {
  const project = {
    title: "Sudophus",
    description: "A journal for the climb.",
    target: 20,
    tags: ["React", "Fire base"],
  }

  it("announces new projects without progress stats", () => {
    const post = buildProjectPost(project, { isNew: true })
    expect(post).toContain("Just kicked off a new project: Sudophus")
    expect(post).toContain("A journal for the climb.")
    expect(post).not.toContain("work sessions logged")
  })

  it("includes progress, percentage, and streak for updates", () => {
    const post = buildProjectPost(project, { sessionsDone: 5, streak: 3 })
    expect(post).toContain("Progress update on Sudophus")
    expect(post).toContain("5 of 20 work sessions logged (25%)")
    expect(post).toContain("3-day streak")
  })

  it("builds sanitized hashtags from tags", () => {
    const post = buildProjectPost(project, { isNew: true })
    expect(post).toContain("#React")
    expect(post).toContain("#Firebase")
    expect(post).toContain("#buildinpublic")
  })
})

describe("buildMilestonePost", () => {
  it("names the group, pathway, topic count, and overall progress", () => {
    const post = buildMilestonePost("Frontend Developer", "CSS & Styling", {
      topicsInGroup: 5,
      overallPct: 42,
    })
    expect(post).toContain("Milestone unlocked: CSS & Styling")
    expect(post).toContain("Frontend Developer")
    expect(post).toContain("(5 topics)")
    expect(post).toContain("42%")
  })
})

describe("buildWeeklyDigestPost", () => {
  it("summarises the week", () => {
    const post = buildWeeklyDigestPost({ entries: 4, sessions: 2, activeDays: 5, streak: 3 })
    expect(post).toContain("4 journal entries")
    expect(post).toContain("2 project work sessions")
    expect(post).toContain("Active 5 of 7 days")
    expect(post).toContain("3-day streak")
  })

  it("uses singular forms and omits a 0/1-day streak", () => {
    const post = buildWeeklyDigestPost({ entries: 1, sessions: 1, activeDays: 1, streak: 1 })
    expect(post).toContain("1 journal entry")
    expect(post).toContain("1 project work session")
    expect(post).not.toContain("streak")
  })
})
