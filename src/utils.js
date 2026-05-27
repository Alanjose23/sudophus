export function timeAgo(date) {
  if (!date) return ""
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 10) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w}w ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}

export function formatFull(date) {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

// Use local calendar date to avoid UTC midnight edge cases
function toLocalDay(d) {
  const date = d?.toDate ? d.toDate() : new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function calcStreak(entries) {
  if (!entries.length) return 0
  const days = new Set(entries.map(e => toLocalDay(e.createdAt)))
  const today     = toLocalDay(new Date())
  const yesterday = toLocalDay(new Date(Date.now() - 86400000))
  let current = days.has(today) ? today : days.has(yesterday) ? yesterday : null
  if (!current) return 0
  let streak = 0
  while (days.has(current)) {
    streak++
    const [y, m, d] = current.split("-").map(Number)
    current = toLocalDay(new Date(y, m - 1, d - 1))
  }
  return streak
}

export function progressPct(entriesCount, target) {
  if (!target) return 0
  return Math.min(100, Math.round((entriesCount / target) * 100))
}

// Consistent with the gold/green design system
export function progressColor(pct) {
  if (pct >= 100) return "#4ade80"
  if (pct >= 60)  return "#c9b8a0"
  if (pct >= 20)  return "#a78b71"
  return "rgba(255,255,255,0.2)"
}

export function friendlyError(code) {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":     return "Incorrect email or password."
    case "auth/email-already-in-use":   return "An account with that email already exists."
    case "auth/invalid-email":          return "Please enter a valid email address."
    case "auth/weak-password":          return "Password must be at least 6 characters."
    case "auth/too-many-requests":      return "Too many attempts — please try again later."
    case "auth/user-not-found":         return "No account found with that email."
    case "auth/requires-recent-login":  return "Please sign in again to continue."
    case "auth/network-request-failed": return "Network error — check your connection."
    default:                            return "Something went wrong. Please try again."
  }
}
