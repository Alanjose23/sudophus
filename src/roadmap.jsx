import { useState, useEffect, useRef } from "react"
import { db } from "./firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { ROADMAPS } from "./roadmapData"
import "./roadmap.css"

function PathwayCard({ roadmap, onSelect }) {
  const topicCount = roadmap.groups.reduce((n, g) => n + g.topics.length, 0)
  return (
    <div className="pathway-card" onClick={() => onSelect(roadmap.id)} role="button" tabIndex={0}>
      <div className="pathway-icon">{roadmap.icon}</div>
      <h3 className="pathway-title">{roadmap.title}</h3>
      <p className="pathway-desc">{roadmap.description}</p>
      <div className="pathway-footer">
        <span className="pathway-topic-count">{topicCount} topics</span>
        <span className="pathway-cta">Start →</span>
      </div>
    </div>
  )
}

function TopicGroup({ group, completed, onToggle }) {
  const done = group.topics.filter(t => completed.has(t.id)).length
  const pct = Math.round((done / group.topics.length) * 100)
  return (
    <div className="topic-group">
      <div className="topic-group-header">
        <span className="topic-group-label">{group.label}</span>
        <span className="topic-group-count">{done} / {group.topics.length}</span>
      </div>
      <div className="topic-group-bar">
        <div className="topic-group-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="topic-list">
        {group.topics.map(t => (
          <label key={t.id} className={`topic-item${completed.has(t.id) ? " done" : ""}`}>
            <input
              type="checkbox"
              checked={completed.has(t.id)}
              onChange={() => onToggle(t.id)}
              className="topic-checkbox"
            />
            <span className="topic-label">{t.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Roadmap({ user, onPathwaySet }) {
  const [view, setView] = useState("loading")
  const [activePathway, setActivePathway] = useState(null)
  const [progress, setProgress] = useState({})
  const savingRef = useRef(false)

  useEffect(() => {
    getDoc(doc(db, "users", user.uid)).then(snap => {
      const data = snap.data() ?? {}
      const prog = {}
      for (const [pid, topics] of Object.entries(data.progress ?? {})) {
        prog[pid] = new Set(topics)
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

  const persist = async (pathway, prog) => {
    if (savingRef.current) return
    savingRef.current = true
    const serialized = {}
    for (const [pid, topics] of Object.entries(prog)) {
      serialized[pid] = [...topics]
    }
    await setDoc(
      doc(db, "users", user.uid),
      { activePathway: pathway, progress: serialized, updatedAt: serverTimestamp() },
      { merge: true }
    )
    savingRef.current = false
  }

  const handleSelectPathway = async id => {
    setActivePathway(id)
    setView("progress")
    await persist(id, progress)
    onPathwaySet?.(id)
  }

  const handleToggle = async topicId => {
    const updated = { ...progress }
    const topics = new Set(updated[activePathway] ?? [])
    if (topics.has(topicId)) topics.delete(topicId)
    else topics.add(topicId)
    updated[activePathway] = topics
    setProgress(updated)
    await persist(activePathway, updated)
  }

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
  const completed = progress[activePathway] ?? new Set()
  const totalTopics = roadmap.groups.reduce((n, g) => n + g.topics.length, 0)
  const doneTopics = completed.size
  const overallPct = Math.round((doneTopics / totalTopics) * 100)

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <div>
          <div className="roadmap-pathway-label">Active Pathway</div>
          <h2 className="roadmap-pathway-title">
            {roadmap.icon} {roadmap.title}
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
          <button className="btn-ghost" onClick={() => setView("select")}>
            Change path
          </button>
        </div>
      </div>

      <div className="roadmap-overview">
        <div className="roadmap-stats">
          <span className="roadmap-done">{doneTopics} / {totalTopics} topics</span>
          <span className="roadmap-pct" data-testid="overall-pct">{overallPct}%</span>
        </div>
        <div className="roadmap-overall-bar">
          <div
            className="roadmap-overall-fill"
            data-testid="overall-bar"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      <div className="topic-groups">
        {roadmap.groups.map(g => (
          <TopicGroup
            key={g.label}
            group={g}
            completed={completed}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}

export default Roadmap
