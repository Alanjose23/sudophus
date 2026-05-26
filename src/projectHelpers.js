export function calcStreak(entries) {
  if (!entries.length) return 0
  const toDay = d => {
    const date = d?.toDate ? d.toDate() : new Date(d)
    return date.toISOString().slice(0, 10)
  }
  const days = new Set(entries.map(e => toDay(e.createdAt)))
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  let current = days.has(today) ? today : days.has(yesterday) ? yesterday : null
  if (!current) return 0
  let streak = 0
  while (days.has(current)) {
    streak++
    const prev = new Date(current + "T12:00:00Z")
    prev.setUTCDate(prev.getUTCDate() - 1)
    current = prev.toISOString().slice(0, 10)
  }
  return streak
}

export function progressPct(entriesCount, target) {
  if (!target) return 0
  return Math.min(100, Math.round((entriesCount / target) * 100))
}

export function progressColor(pct) {
  if (pct >= 100) return "#22c55e"
  if (pct >= 60)  return "#f59e0b"
  if (pct >= 20)  return "#6366f1"
  return "#475569"
}
