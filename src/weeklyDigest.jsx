import { useState, useEffect, useMemo } from "react"
import { db } from "./firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { calcStreak } from "./utils"
import { buildWeeklyDigestPost, openLinkedInComposer } from "./linkedin"
import { LinkedInIcon, Flame } from "./icons.jsx"

const dayStart = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const DAY_MS = 86400000

/* Replaces the hero logo for signed-in users: a shareable summary of the
   last 7 days of journal entries and project work sessions. */
function WeeklyDigest({ user }) {
  const [entries, setEntries] = useState(null) // null = loading

  useEffect(() => {
    let cancelled = false
    getDocs(query(collection(db, "entries"), where("uid", "==", user.uid)))
      .then(snap => {
        if (cancelled) return
        setEntries(
          snap.docs
            .map(d => ({
              createdAt: d.data().createdAt?.toDate() ?? null,
              projectId: d.data().projectId ?? null,
            }))
            .filter(e => e.createdAt)
        )
      })
      .catch(() => { if (!cancelled) setEntries([]) })
    return () => { cancelled = true }
  }, [user.uid])

  const digest = useMemo(() => {
    if (!entries) return null
    const today = dayStart(new Date())
    const weekStart = new Date(today.getTime() - 6 * DAY_MS)
    const days = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(weekStart.getTime() + i * DAY_MS),
      count: 0,
    }))
    let journalCount = 0
    let sessionCount = 0
    for (const e of entries) {
      if (e.createdAt < weekStart) continue
      if (e.projectId) sessionCount++
      else journalCount++
      const idx = Math.round((dayStart(e.createdAt) - weekStart) / DAY_MS)
      if (days[idx]) days[idx].count++
    }
    return {
      days,
      journalCount,
      sessionCount,
      activeDays: days.filter(d => d.count > 0).length,
      streak: calcStreak(entries),
    }
  }, [entries])

  if (!digest) {
    return (
      <div className="weekly-digest weekly-digest--loading" aria-hidden="true">
        <span className="loading-dot" />
      </div>
    )
  }

  const { days, journalCount, sessionCount, activeDays, streak } = digest
  const maxCount = Math.max(...days.map(d => d.count), 1)

  const share = () =>
    openLinkedInComposer(
      buildWeeklyDigestPost({
        entries: journalCount,
        sessions: sessionCount,
        activeDays,
        streak,
      })
    )

  return (
    <div className="weekly-digest" data-testid="weekly-digest">
      <div className="weekly-digest-head">
        <span className="weekly-digest-eyebrow">Your week</span>
        {streak > 0 && (
          <span className="weekly-digest-streak">
            <Flame size={11} strokeWidth={1.75} aria-hidden="true" /> {streak} day{streak !== 1 ? "s" : ""}
          </span>
        )}
        <button className="weekly-digest-share" onClick={share} title="Share your week on LinkedIn">
          <LinkedInIcon size={12} /> Share
        </button>
      </div>

      <div className="weekly-digest-stats">
        <div className="weekly-digest-stat">
          <span className="weekly-digest-value">{journalCount}</span>
          <span className="weekly-digest-label">entries</span>
        </div>
        <div className="weekly-digest-stat">
          <span className="weekly-digest-value">{sessionCount}</span>
          <span className="weekly-digest-label">sessions</span>
        </div>
        <div className="weekly-digest-stat">
          <span className="weekly-digest-value">{activeDays}<span className="weekly-digest-denom">/7</span></span>
          <span className="weekly-digest-label">active days</span>
        </div>
      </div>

      <div className="weekly-digest-bars" aria-label="Activity per day, last 7 days">
        {days.map(d => (
          <div className="weekly-digest-day" key={d.date.toISOString()}>
            <div
              className={`weekly-digest-bar${d.count > 0 ? " has-activity" : ""}`}
              style={{ height: `${Math.max(8, (d.count / maxCount) * 100)}%` }}
              title={`${d.count} ${d.count === 1 ? "entry" : "entries"} · ${d.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`}
            />
            <span className="weekly-digest-daylabel">
              {d.date.toLocaleDateString("en-US", { weekday: "narrow" })}
            </span>
          </div>
        ))}
      </div>

      {journalCount + sessionCount === 0 && (
        <p className="weekly-digest-empty">Quiet week so far — write an entry to light it up.</p>
      )}
    </div>
  )
}

export default WeeklyDigest
