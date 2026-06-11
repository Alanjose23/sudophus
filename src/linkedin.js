// LinkedIn integration helpers.
//
// Posting uses LinkedIn's share intent (the feed composer prefilled with
// text). A full Posts-API integration needs an OAuth token exchange with a
// server-held client secret, which a static GitHub Pages app cannot keep,
// so the composer flow is the supported path here: the user reviews the
// generated text inside LinkedIn and publishes it themselves.

const SHARE_COMPOSER_URL = "https://www.linkedin.com/feed/?shareActive=true&text="

export function openLinkedInComposer(text) {
  window.open(
    SHARE_COMPOSER_URL + encodeURIComponent(text),
    "_blank",
    "noopener,noreferrer"
  )
}

/* Accepts "linkedin.com/in/jane", "www.linkedin.com/in/jane/", or a full
   https URL. Returns a canonical https profile URL, or null if invalid. */
export function normalizeLinkedInUrl(raw) {
  if (!raw) return null
  let value = raw.trim()
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  let url
  try {
    url = new URL(value)
  } catch {
    return null
  }
  const host = url.hostname.toLowerCase()
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return null
  const path = url.pathname.replace(/\/+$/, "")
  if (!/^\/(in|pub|company)\/[^/]+/.test(path)) return null
  return `https://www.linkedin.com${path}`
}

function hashtagsFor(project) {
  const fromTags = (project.tags ?? [])
    .map(t => "#" + t.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(t => t.length > 1)
  return [...new Set([...fromTags, "#buildinpublic", "#coding"])].join(" ")
}

/* Compose post text for a project — either a "just started" announcement
   or a progress update with sessions, percentage, and streak. */
export function buildProjectPost(project, { sessionsDone = 0, streak = 0, isNew = false } = {}) {
  const lines = []

  if (isNew) {
    lines.push(`🚀 Just kicked off a new project: ${project.title}`)
  } else {
    lines.push(`🛠️ Progress update on ${project.title}`)
  }

  if (project.description) lines.push("", project.description)

  const target = Number(project.target) || 0
  if (!isNew && target > 0) {
    const pct = Math.min(100, Math.round((sessionsDone / target) * 100))
    let progress = `📈 ${sessionsDone} of ${target} work sessions logged (${pct}%)`
    if (streak > 1) progress += ` — on a ${streak}-day streak 🔥`
    lines.push("", progress)
  }

  lines.push("", "Documenting my coding journey with Sudophus.")
  lines.push("", hashtagsFor(project))
  return lines.join("\n")
}

/* Compose post text for completing every topic in a roadmap group. */
export function buildMilestonePost(roadmapTitle, groupLabel, { topicsInGroup = 0, overallPct = 0 } = {}) {
  const lines = [`🎯 Milestone unlocked: ${groupLabel} — mastered!`]
  let body = `I just completed every topic in the "${groupLabel}" section of my ${roadmapTitle} learning path`
  if (topicsInGroup > 0) body += ` (${topicsInGroup} topics)`
  lines.push("", body + ".")
  if (overallPct > 0) lines.push("", `📈 Overall pathway progress: ${overallPct}%`)
  lines.push("", "Documenting my coding journey with Sudophus.")
  lines.push("", "#learninpublic #buildinpublic #coding")
  return lines.join("\n")
}

/* Compose post text for the weekly digest card. */
export function buildWeeklyDigestPost({ entries = 0, sessions = 0, activeDays = 0, streak = 0 } = {}) {
  const lines = [
    "📅 My coding week in review:",
    "",
    `✍️ ${entries} journal ${entries === 1 ? "entry" : "entries"}`,
    `🛠️ ${sessions} project work ${sessions === 1 ? "session" : "sessions"}`,
    `📆 Active ${activeDays} of 7 days`,
  ]
  if (streak > 1) lines.push(`🔥 ${streak}-day streak`)
  lines.push("", "Documenting my coding journey with Sudophus.")
  lines.push("", "#buildinpublic #coding #learninpublic")
  return lines.join("\n")
}
