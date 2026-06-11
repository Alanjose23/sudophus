import { useState, useEffect, useMemo } from "react"
import { db } from "./firebase"
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { normalizeLinkedInUrl } from "./linkedin"
import { calcStreak } from "./utils"
import { ROADMAPS } from "./roadmapData"
import { PROJECT_SUGGESTIONS, DIFFICULTY_TIERS, TIER_LABELS } from "./projectSuggestions"
import {
  PathwayIcon, LinkedInIcon, NotebookPen, Rocket, Map, BookOpen, Lightbulb, RefreshCw,
} from "./icons.jsx"
import "./App.css"

const QUICK_LINKS = [
  { screen: "journal",  Icon: NotebookPen, label: "Journal",      desc: "Write & reflect"      },
  { screen: "project",  Icon: Rocket,      label: "Projects",     desc: "Track your builds"     },
  { screen: "roadmap",  Icon: Map,         label: "Learning Kit", desc: "Your pathway progress" },
  { screen: "about",    Icon: BookOpen,    label: "About",        desc: "The Sudophus story"    },
]

const dayKey = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`


function AboutTab({ stats, totalTopics, donePct, roadmap, onNavigate }) {
  const features = [
    { Icon: NotebookPen, label: "Daily Journal",      desc: "Log reflections, bugs fixed, and wins" },
    { Icon: Rocket,      label: "Project Tracker",    desc: "Showcase builds, track progress targets" },
    { Icon: Map,         label: "Learning Pathways",  desc: "Curated roadmaps with skill checkpoints" },
    { Icon: Lightbulb,   label: "Smart Suggestions",  desc: "Project ideas matched to your pathway" },
  ]
  return (
    <div className="dash-tab-body">
      <h3 className="dash-section-title">What is Sudophus?</h3>
      <p className="dash-section-sub">
        Sudophus is your personal coding companion — a focused space to journal your
        learning, track the projects you build, and follow structured pathways toward
        mastery. No noise, no social feed — just you and your growth.
      </p>

      <div className="dash-about-stats">
        <div className="dash-about-stat" onClick={() => onNavigate?.("journal")} role="button" tabIndex={0}>
          <span className="dash-about-stat-val">{stats.entries}</span>
          <span className="dash-about-stat-lbl">Journal entries written</span>
        </div>
        <div className="dash-about-stat" onClick={() => onNavigate?.("project")} role="button" tabIndex={0}>
          <span className="dash-about-stat-val">{stats.projects}</span>
          <span className="dash-about-stat-lbl">Projects tracked</span>
        </div>
        <div className="dash-about-stat" onClick={() => onNavigate?.("roadmap")} role="button" tabIndex={0}>
          <span className="dash-about-stat-val">{totalTopics > 0 ? `${donePct}%` : "—"}</span>
          <span className="dash-about-stat-lbl">
            {roadmap ? `${roadmap.title} pathway` : "No pathway set"}
          </span>
        </div>
      </div>

      <div className="dash-about-features">
        {features.map(f => (
          <div key={f.label} className="dash-about-feature">
            <span className="dash-about-feature-icon"><f.Icon size={18} strokeWidth={1.75} aria-hidden="true" /></span>
            <div>
              <div className="dash-about-feature-name">{f.label}</div>
              <div className="dash-about-feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuggestionsTab({ pathway }) {
  const pool = useMemo(() => pathway ? (PROJECT_SUGGESTIONS[pathway] ?? []) : [], [pathway])
  const [tier, setTier] = useState(DIFFICULTY_TIERS[0])
  const shown = useMemo(() => pool.filter(s => s.difficulty === tier), [pool, tier])

  const cycleTier = () =>
    setTier(t => DIFFICULTY_TIERS[(DIFFICULTY_TIERS.indexOf(t) + 1) % DIFFICULTY_TIERS.length])

  if (!pathway) {
    return (
      <div className="dash-tab-body">
        <div className="dash-sugg-empty">
          <div className="dash-sugg-empty-icon"><Map size={28} strokeWidth={1.5} aria-hidden="true" /></div>
          <p>Set a learning pathway to unlock project suggestions.</p>
        </div>
      </div>
    )
  }

  if (pool.length === 0) {
    return (
      <div className="dash-tab-body">
        <div className="dash-sugg-empty">
          <div className="dash-sugg-empty-icon"><Lightbulb size={28} strokeWidth={1.5} aria-hidden="true" /></div>
          <p>No suggestions yet for this pathway.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-tab-body">
      <div className="dash-sugg-header">
        <div>
          <h3 className="dash-section-title" style={{ margin: "0 0 0.2rem" }}>Project Suggestions</h3>
          <p className="dash-section-sub" style={{ margin: 0 }}>Curated ideas for your active pathway.</p>
        </div>
        <button className="btn-ghost-sm btn-icon-row" onClick={cycleTier}>
          <RefreshCw size={12} strokeWidth={1.75} aria-hidden="true" /> Next tier
        </button>
      </div>
      <div className="tier-tabs" role="tablist" aria-label="Suggestion difficulty">
        {DIFFICULTY_TIERS.map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tier === t}
            className={`tier-tab${tier === t ? " active" : ""}`}
            onClick={() => setTier(t)}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="dash-sugg-list">
        {shown.map(s => (
          <a key={s.title} className="dash-sugg-item" href={s.source?.url} target="_blank" rel="noopener noreferrer">
            <div className="dash-sugg-item-top">
              <span className="dash-sugg-title">{s.title}</span>
              <span className={`dash-sugg-diff dash-sugg-diff--${s.difficulty}`}>
                {TIER_LABELS[s.difficulty]}
              </span>
            </div>
            {s.description && <p className="dash-sugg-desc">{s.description}</p>}
            {s.source && <span className="dash-sugg-source">{s.source.name} ↗</span>}
          </a>
        ))}
      </div>
    </div>
  )
}

function LinkedInCard({ user, linkedin, onChange }) {
  const [url, setUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const connect = async () => {
    const normalized = normalizeLinkedInUrl(url)
    if (!normalized) {
      setError("Enter a valid LinkedIn profile URL, e.g. linkedin.com/in/your-name")
      return
    }
    setSaving(true)
    setError("")
    try {
      const data = { profileUrl: normalized, connectedAt: serverTimestamp() }
      await setDoc(doc(db, "users", user.uid), { linkedin: data }, { merge: true })
      onChange({ profileUrl: normalized })
      setUrl("")
    } catch {
      setError("Could not save your LinkedIn profile. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const disconnect = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "users", user.uid), { linkedin: null }, { merge: true })
      onChange(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dash-linkedin">
      <div className="dash-linkedin-head">
        <span className="dash-linkedin-icon"><LinkedInIcon size={16} /></span>
        <span className="dash-linkedin-title">LinkedIn</span>
        {linkedin?.profileUrl && <span className="dash-linkedin-chip">Connected</span>}
      </div>
      {linkedin?.profileUrl ? (
        <div className="dash-linkedin-row">
          <a
            className="dash-linkedin-url"
            href={linkedin.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkedin.profileUrl.replace("https://www.", "")}
          </a>
          <button className="btn-ghost-sm" onClick={disconnect} disabled={saving}>
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <p className="dash-linkedin-sub">
            Connect your profile to share project updates with your network.
            Posting opens LinkedIn's composer with the post pre-written for you.
          </p>
          <div className="dash-linkedin-row">
            <input
              className="form-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") connect() }}
              placeholder="linkedin.com/in/your-name"
              aria-label="LinkedIn profile URL"
            />
            <button className="btn-primary dash-linkedin-btn" onClick={connect} disabled={saving}>
              {saving ? "Saving…" : "Connect"}
            </button>
          </div>
          {error && <p className="dash-linkedin-error">{error}</p>}
        </>
      )}
    </div>
  )
}

function Sparkline({ points, color = "var(--primary)" }) {
  if (!points?.length) return null
  const max = Math.max(...points, 1)
  const w = 100
  const h = 28
  const step = w / (points.length - 1 || 1)
  const coords = points
    .map((v, i) => `${(i * step).toFixed(1)},${(h - 3 - (v / max) * (h - 6)).toFixed(1)}`)
    .join(" ")
  return (
    <svg className="stat-tile-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={coords} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function StatTile({ accent, label, value, sub, spark, onClick, title }) {
  return (
    <div
      className="stat-tile"
      style={{ "--tile-accent": accent }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={title}
    >
      <span className="stat-tile-eyebrow">{label}</span>
      <span className="stat-tile-value">{value}</span>
      {sub && <span className="stat-tile-sub">{sub}</span>}
      {spark && <Sparkline points={spark} color={accent} />}
    </div>
  )
}

const HEATMAP_WEEKS = 15

function ActivityHeatmap({ countsByDay }) {
  const cells = useMemo(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    start.setDate(start.getDate() - start.getDay() - (HEATMAP_WEEKS - 1) * 7)
    const out = []
    for (const d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      out.push(new Date(d))
    }
    return out
  }, [])

  return (
    <div className="dash-heatmap-wrap">
      <div className="dash-quick-label">Activity · last {HEATMAP_WEEKS} weeks</div>
      <div className="dash-heatmap" aria-label="Daily journal and session activity">
        {cells.map(d => {
          const k = dayKey(d)
          const count = countsByDay[k] ?? 0
          const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          return (
            <span
              key={k}
              className={`heat-cell heat-${Math.min(count, 3)}`}
              title={`${count} ${count === 1 ? "entry" : "entries"} · ${date}`}
            />
          )
        })}
      </div>
      <div className="dash-heatmap-legend">
        <span>Less</span>
        <span className="heat-cell heat-0" />
        <span className="heat-cell heat-1" />
        <span className="heat-cell heat-2" />
        <span className="heat-cell heat-3" />
        <span>More</span>
      </div>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({ entries: 0, projects: 0 })
  const [entryDates, setEntryDates] = useState([])
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const load = async () => {
      const [userSnap, entriesSnap, projSnap] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDocs(query(collection(db, "entries"), where("uid", "==", user.uid))),
        getDocs(query(collection(db, "projects"), where("uid", "==", user.uid))),
      ])
      setUserData(userSnap.data() ?? {})
      setStats({ entries: entriesSnap.size, projects: projSnap.size })
      setEntryDates(
        entriesSnap.docs
          .map(d => d.data().createdAt?.toDate())
          .filter(Boolean)
      )
    }
    load()
  }, [user.uid])

  const countsByDay = useMemo(() => {
    const m = {}
    for (const d of entryDates) {
      const k = dayKey(d)
      m[k] = (m[k] ?? 0) + 1
    }
    return m
  }, [entryDates])

  const streak = useMemo(
    () => calcStreak(entryDates.map(d => ({ createdAt: d }))),
    [entryDates]
  )

  const last14 = useMemo(() => {
    const out = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
      out.push(countsByDay[dayKey(d)] ?? 0)
    }
    return out
  }, [countsByDay])

  const pathway     = userData?.activePathway
  const roadmap     = pathway ? ROADMAPS[pathway] : null
  const progressObj = userData?.progress?.[pathway] ?? {}
  const doneCount   = typeof progressObj === "object" && !Array.isArray(progressObj)
    ? Object.values(progressObj).filter(v => v === "mastered").length
    : (Array.isArray(progressObj) ? progressObj.length : 0)
  const totalTopics = roadmap?.groups.reduce((n, g) => n + g.topics.length, 0) ?? 0
  const donePct     = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0

  const initials    = (user.email ?? "?")[0].toUpperCase()
  const memberSince = userData?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(userData.createdAt.toDate())
    : null

  const tabs = [
    { id: "about",       label: "About"       },
    { id: "suggestions", label: "Suggestions" },
  ]

  return (
    <div className="dash-container">

      {/* ── Serpentine accent line at top ── */}
      <div className="dash-serpent-bar" aria-hidden="true" />

      {/* ── Profile hero ── */}
      <div className="dash-hero">
        <div className="dash-avatar">{initials}</div>
        <div className="dash-user-info">
          <h2 className="dash-name">{userData?.username ?? user.email}</h2>
          <p className="dash-email">{user.email}</p>
          {memberSince && <p className="dash-since">Member since {memberSince}</p>}
        </div>
      </div>

      {/* ── Stat tiles ── */}
      <div className="dash-tiles">
        <StatTile
          accent="var(--info)"
          label="Entries"
          value={stats.entries}
          spark={last14}
          onClick={() => onNavigate?.("journal")}
          title="Go to Journal"
        />
        <StatTile
          accent="var(--primary)"
          label="Projects"
          value={stats.projects}
          sub="tracked builds"
          onClick={() => onNavigate?.("project")}
          title="Go to Projects"
        />
        <StatTile
          accent="var(--success)"
          label="Day streak"
          value={streak}
          sub={streak > 0 ? "keep it alive" : "log today to start"}
          onClick={() => onNavigate?.("journal")}
          title="Days in a row with at least one entry"
        />
        <StatTile
          accent="var(--tertiary)"
          label="Pathway"
          value={roadmap ? `${donePct}%` : "—"}
          sub={roadmap ? roadmap.title : "No pathway set"}
          onClick={() => onNavigate?.("roadmap")}
          title="Go to Learning Kit"
        />
      </div>

      {/* ── Pathway progress bar ── */}
      {roadmap && (
        <div className="dash-pathway">
          <div className="dash-pathway-header">
            <span className="dash-pathway-title">
              <PathwayIcon id={pathway} size={15} /> {roadmap.title} Pathway
            </span>
            <span className="dash-pathway-pct">{doneCount} / {totalTopics} mastered</span>
          </div>
          <div className="dash-pathway-bar">
            <div className="dash-pathway-fill" style={{ width: `${donePct}%` }} />
          </div>
        </div>
      )}

      {/* ── Activity heatmap ── */}
      <ActivityHeatmap countsByDay={countsByDay} />

      {/* ── LinkedIn ── */}
      <LinkedInCard
        user={user}
        linkedin={userData?.linkedin}
        onChange={linkedin => setUserData(d => ({ ...d, linkedin }))}
      />

      {/* ── Quick Access ── */}
      <div className="dash-quick-label">Quick Access</div>
      <div className="dash-quick-grid">
        {QUICK_LINKS.map(link => (
          <button
            key={link.screen}
            className="dash-quick-tile"
            onClick={() => onNavigate?.(link.screen)}
          >
            <span className="dash-quick-icon"><link.Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="dash-quick-name">{link.label}</span>
            <span className="dash-quick-desc">{link.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="dash-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`dash-tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "about" && (
        <AboutTab
          user={user}
          userData={userData}
          stats={stats}
          doneCount={doneCount}
          totalTopics={totalTopics}
          donePct={donePct}
          roadmap={roadmap}
          onNavigate={onNavigate}
        />
      )}
      {activeTab === "suggestions" && <SuggestionsTab pathway={pathway} />}
    </div>
  )
}

export default Dashboard
