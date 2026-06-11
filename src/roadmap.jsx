import { useState, useEffect, useRef, useCallback } from "react"
import { db } from "./firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { ROADMAPS } from "./roadmapData"
import { PathwayIcon, TopicIcon, LinkedInIcon } from "./icons.jsx"
import { buildMilestonePost, openLinkedInComposer } from "./linkedin"
import "./roadmap.css"

const STATUSES = ["practiced", "mastered"]

const STATUS_LABELS = {
  practiced: "Practiced",
  mastered:  "Mastered",
}

// Mastered = full credit, practiced = half credit, need_practice = 0
function weightedDone(statusMap, topics) {
  let score = 0
  for (const t of topics) {
    const s = statusMap[t.id]
    if (s === "mastered") score += 1
    else if (s === "practiced") score += 0.5
  }
  return score
}

function groupStats(statusMap, topics) {
  let mastered = 0, practiced = 0
  for (const t of topics) {
    const s = statusMap[t.id]
    if (s === "mastered") mastered++
    else if (s === "practiced") practiced++
  }
  return { mastered, practiced }
}

function PathwayCard({ roadmap, onSelect }) {
  const topicCount = roadmap.groups.reduce((n, g) => n + g.topics.length, 0)
  return (
    <div className="pathway-card" onClick={() => onSelect(roadmap.id)} role="button" tabIndex={0}>
      <div className="pathway-icon"><PathwayIcon id={roadmap.id} size={28} /></div>
      <h3 className="pathway-title">{roadmap.title}</h3>
      <p className="pathway-desc">{roadmap.description}</p>
      <div className="pathway-footer">
        <span className="pathway-topic-count">{topicCount} topics</span>
        <span className="pathway-cta">Start →</span>
      </div>
    </div>
  )
}

function TopicGroup({ group, statusMap, onSetStatus, onShareMilestone }) {
  const allTopics = group.topics
  const weighted = weightedDone(statusMap, allTopics)
  const pct = Math.round((weighted / allTopics.length) * 100)
  const { mastered, practiced } = groupStats(statusMap, allTopics)
  const complete = mastered === allTopics.length

  return (
    <div className="topic-group">
      <div className="topic-group-header">
        <span className="topic-group-label">{group.label}</span>
        <div className="topic-group-counts">
          {complete && (
            <button
              className="tgc-share"
              onClick={() => onShareMilestone(group)}
              title="Share this milestone on LinkedIn"
              data-testid="share-milestone"
            >
              <LinkedInIcon size={11} /> Share milestone
            </button>
          )}
          {mastered > 0 && (
            <span className="tgc tgc--mastered">{mastered} mastered</span>
          )}
          {practiced > 0 && (
            <span className="tgc tgc--practiced">{practiced} practiced</span>
          )}
          <span className="tgc tgc--total">{allTopics.length} topics</span>
        </div>
      </div>
      <div className="topic-group-bar">
        <div className="topic-group-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="topic-list">
        {allTopics.map(t => {
          const current = statusMap[t.id] ?? null
          return (
            <div
              key={t.id}
              className={`topic-row${current === "mastered" ? " topic-row--mastered" : ""}`}
            >
              <div className="topic-row-left">
                <span className="topic-icon" aria-hidden="true"><TopicIcon id={t.id} /></span>
                <span className={`topic-label${current === "mastered" ? " done" : ""}`}>
                  {t.label}
                </span>
              </div>
              <div className="topic-pills" role="group" aria-label={`Status for ${t.label}`}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`topic-pill topic-pill--${s}${current === s ? " active" : ""}`}
                    onClick={() => onSetStatus(t.id, current === s ? null : s)}
                    title={current === s ? `Remove "${STATUS_LABELS[s]}"` : STATUS_LABELS[s]}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UserKitBanner({ user, roadmap, masteredCount, practicedCount, totalTopics, onChangePath }) {
  const initials = (user.email ?? "?")[0].toUpperCase()
  return (
    <div className="kit-banner">
      <div className="kit-banner-left">
        <div className="kit-avatar">{initials}</div>
        <div className="kit-user-info">
          <span className="kit-user-email">{user.email}</span>
          <span className="kit-user-pathway">
            <PathwayIcon id={roadmap.id} size={14} /> {roadmap.title}
          </span>
        </div>
      </div>
      <div className="kit-banner-right">
        <div className="kit-banner-stats">
          <span className="kit-stat kit-stat--mastered">{masteredCount} mastered</span>
          {practicedCount > 0 && (
            <span className="kit-stat kit-stat--practiced">{practicedCount} practiced</span>
          )}
          <span className="kit-stat kit-stat--total">of {totalTopics}</span>
        </div>
        <button className="btn-ghost-sm" onClick={() => {
          if (window.confirm("Switch pathway? Your progress is saved and you can return to this pathway anytime.")) {
            onChangePath()
          }
        }}>Switch kit</button>
      </div>
    </div>
  )
}

function Roadmap({ user, onPathwaySet }) {
  const [view, setView] = useState("loading")
  const [activePathway, setActivePathway] = useState(null)
  // progress shape: { [pathwayId]: { [topicId]: 'need_practice'|'practiced'|'mastered' } }
  const [progress, setProgress] = useState({})
  const savingRef      = useRef(false)
  const saveTimerRef   = useRef(null)
  const latestProgRef  = useRef({})

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then(snap => {
      const data = snap.data() ?? {}
      const prog = {}
      for (const [pid, val] of Object.entries(data.progress ?? {})) {
        if (Array.isArray(val)) {
          // backward-compat: old format stored an array of completed topic IDs
          const obj = {}
          for (const id of val) obj[id] = "mastered"
          prog[pid] = obj
        } else {
          prog[pid] = val ?? {}
        }
      }
      setProgress(prog)
      if (data.activePathway && ROADMAPS[data.activePathway]) {
        setActivePathway(data.activePathway)
        setView("progress")
      } else {
        setView("select")
      }
    })
  }, [user.uid])

  const persist = useCallback(async (pathway, prog) => {
    if (savingRef.current) return
    savingRef.current = true
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { activePathway: pathway, progress: prog, updatedAt: serverTimestamp() },
        { merge: true }
      )
    } finally {
      savingRef.current = false
    }
  }, [user.uid])

  const handleSelectPathway = async id => {
    setActivePathway(id)
    setView("progress")
    await persist(id, progress)
    onPathwaySet?.(id)
  }

  const handleSetStatus = useCallback((topicId, newStatus) => {
    setProgress(prev => {
      const pathwayStatus = { ...(prev[activePathway] ?? {}) }
      if (newStatus === null) delete pathwayStatus[topicId]
      else pathwayStatus[topicId] = newStatus
      const updated = { ...prev, [activePathway]: pathwayStatus }
      latestProgRef.current = updated
      return updated
    })
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      persist(activePathway, latestProgRef.current)
    }, 600)
  }, [activePathway, persist])

  if (view === "loading") {
    return (
      <div className="roadmap-loading" data-testid="roadmap-loading">
        <span className="loading-dot" />
      </div>
    )
  }

  if (view === "select") {
    return (
      <div className="roadmap-page">
        <div className="roadmap-select-header">
          <h2 className="roadmap-select-title">Choose your pathway</h2>
          <p className="roadmap-select-sub">
            Select a career track to begin documenting your progress.
            Roadmaps are sourced from{" "}
            <a
              href="https://roadmap.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="roadmap-link"
            >
              roadmap.sh
            </a>
            .
          </p>
        </div>
        <div className="pathway-grid">
          {Object.values(ROADMAPS).map(r => (
            <PathwayCard key={r.id} roadmap={r} onSelect={handleSelectPathway} />
          ))}
        </div>
      </div>
    )
  }

  const roadmap = ROADMAPS[activePathway]
  const statusMap = progress[activePathway] ?? {}
  const allTopics = roadmap.groups.flatMap(g => g.topics)
  const totalTopics = allTopics.length
  const masteredCount = allTopics.filter(t => statusMap[t.id] === "mastered").length
  const practicedCount = allTopics.filter(t => statusMap[t.id] === "practiced").length
  const weighted = weightedDone(statusMap, allTopics)
  const overallPct = Math.round((weighted / totalTopics) * 100)

  return (
    <div className="roadmap-page">
      <UserKitBanner
        user={user}
        roadmap={roadmap}
        masteredCount={masteredCount}
        practicedCount={practicedCount}
        totalTopics={totalTopics}
        onChangePath={() => setView("select")}
      />

      <div className="roadmap-header">
        <div>
          <div className="roadmap-pathway-label">Active Pathway</div>
          <h2 className="roadmap-pathway-title">
            <PathwayIcon id={roadmap.id} size={20} /> {roadmap.title}
          </h2>
        </div>
        <div className="roadmap-header-actions">
          <a
            href={roadmap.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-sm"
          >
            roadmap.sh ↗
          </a>
        </div>
      </div>

      <div className="roadmap-overview">
        <div className="roadmap-stats">
          <div className="roadmap-stat-pills">
            <span className="roadmap-stat-chip roadmap-stat-chip--mastered">
              ✓ {masteredCount} mastered
            </span>
            {practicedCount > 0 && (
              <span className="roadmap-stat-chip roadmap-stat-chip--practiced">
                ◑ {practicedCount} practiced
              </span>
            )}
            </div>
          <span className="roadmap-pct" data-testid="overall-pct">{overallPct}%</span>
        </div>
        <div className="roadmap-overall-bar">
          <div
            className="roadmap-overall-fill"
            data-testid="overall-bar"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="roadmap-overview-hint">
          Mastered = full credit · Practiced = half credit · Unset = not yet started
        </p>
      </div>

      <div className="topic-groups">
        {roadmap.groups.map(g => (
          <TopicGroup
            key={g.label}
            group={g}
            statusMap={statusMap}
            onSetStatus={handleSetStatus}
            onShareMilestone={group =>
              openLinkedInComposer(
                buildMilestonePost(roadmap.title, group.label, {
                  topicsInGroup: group.topics.length,
                  overallPct,
                })
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export default Roadmap
