import { useState, useEffect } from "react"
import { auth, db } from "./firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ROADMAPS } from "./roadmapData"
import { PROJECT_SUGGESTIONS } from "./projectSuggestions"
import "./App.css"

const QUICK_LINKS = [
  { screen: "journal",  icon: "📓", label: "Journal",      desc: "Write & reflect"         },
  { screen: "project",  icon: "🚀", label: "Projects",     desc: "Track your builds"        },
  { screen: "roadmap",  icon: "🗺️", label: "Learning Kit", desc: "Your pathway progress"    },
  { screen: "about",    icon: "🐍", label: "About",        desc: "The Sudophus story"       },
]

const TIERS = [
  {
    id:       "free",
    name:     "Free",
    monthly:  0,
    annual:   0,
    desc:     "Start your journey",
    features: [
      "Unlimited journal entries",
      "Up to 5 projects",
      "1 learning pathway",
      "Project suggestions",
    ],
    cta:     "Current plan",
    current: true,
  },
  {
    id:      "builder",
    name:    "Builder",
    monthly: 7,
    annual:  5,
    desc:    "Serious builders",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited projects",
      "All learning pathways",
      "Priority suggestions",
      "Export journal (CSV)",
    ],
    cta: "Upgrade",
  },
  {
    id:      "master",
    name:    "Master",
    monthly: 18,
    annual:  13,
    desc:    "Professionals & teams",
    features: [
      "Everything in Builder",
      "Team workspaces",
      "Mentor review queue",
      "Custom roadmaps",
      "API access",
    ],
    cta: "Go Master",
  },
]

const SHOWN_SUGG = 3

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function AboutTab({ user, userData, stats, doneCount, totalTopics, donePct, roadmap, onNavigate }) {
  const features = [
    { icon: "📓", label: "Daily Journal",      desc: "Log reflections, bugs fixed, and wins" },
    { icon: "🚀", label: "Project Tracker",    desc: "Showcase builds, track progress targets" },
    { icon: "🗺️", label: "Learning Pathways", desc: "Curated roadmaps with skill checkpoints" },
    { icon: "💡", label: "Smart Suggestions",  desc: "Project ideas matched to your pathway" },
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
            <span className="dash-about-feature-icon">{f.icon}</span>
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

function PricingTab() {
  const [annual, setAnnual] = useState(false)
  return (
    <div className="dash-tab-body">
      <div className="dash-pricing-header">
        <h3 className="dash-section-title" style={{ margin: 0 }}>Plans &amp; Pricing</h3>
        <div className="dash-pricing-toggle" onClick={() => setAnnual(a => !a)} role="button" tabIndex={0} aria-label="Toggle billing period">
          <span className={!annual ? "dash-toggle-active" : ""}>Monthly</span>
          <div className={`dash-toggle-pill${annual ? " on" : ""}`}>
            <div className="dash-toggle-knob" />
          </div>
          <span className={annual ? "dash-toggle-active" : ""}>Annual <span className="dash-toggle-save">−30%</span></span>
        </div>
      </div>
      <div className="dash-pricing-grid">
        {TIERS.map(tier => (
          <div key={tier.id} className={`dash-tier${tier.popular ? " dash-tier--popular" : ""}`}>
            {tier.popular && <div className="dash-tier-badge">Most Popular</div>}
            <div className="dash-tier-name">{tier.name}</div>
            <div className="dash-tier-price">
              {tier.monthly === 0
                ? <span className="dash-tier-amount">Free</span>
                : <>
                    <span className="dash-tier-amount">${annual ? tier.annual : tier.monthly}</span>
                    <span className="dash-tier-period">/ mo</span>
                  </>
              }
            </div>
            <div className="dash-tier-desc">{tier.desc}</div>
            <ul className="dash-tier-features">
              {tier.features.map(f => (
                <li key={f} className="dash-tier-feature">
                  <span className="dash-tier-check">✓</span>{f}
                </li>
              ))}
            </ul>
            <button className={`dash-tier-cta${tier.current ? " dash-tier-cta--current" : ""}`} disabled={tier.current}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuggestionsTab({ pathway }) {
  const pool = pathway ? (PROJECT_SUGGESTIONS[pathway] ?? []) : []
  const [shown, setShown] = useState(() => shuffleArr(pool).slice(0, SHOWN_SUGG))

  useEffect(() => {
    setShown(shuffleArr(pool).slice(0, SHOWN_SUGG))
  }, [pathway])

  const shuffle = () => setShown(shuffleArr(pool).slice(0, SHOWN_SUGG))

  if (!pathway) {
    return (
      <div className="dash-tab-body">
        <div className="dash-sugg-empty">
          <div className="dash-sugg-empty-icon">🗺️</div>
          <p>Set a learning pathway to unlock project suggestions.</p>
        </div>
      </div>
    )
  }

  if (pool.length === 0) {
    return (
      <div className="dash-tab-body">
        <div className="dash-sugg-empty">
          <div className="dash-sugg-empty-icon">💡</div>
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
        <button className="btn-ghost-sm" onClick={shuffle}>↻ Shuffle</button>
      </div>
      <div className="dash-sugg-list">
        {shown.map((s, i) => (
          <a key={i} className="dash-sugg-item" href={s.url} target="_blank" rel="noopener noreferrer">
            <div className="dash-sugg-item-top">
              <span className="dash-sugg-title">{s.title}</span>
              <span className={`dash-sugg-diff dash-sugg-diff--${(s.difficulty ?? "beginner").toLowerCase()}`}>
                {s.difficulty ?? "Beginner"}
              </span>
            </div>
            {s.desc && <p className="dash-sugg-desc">{s.desc}</p>}
            {s.source && <span className="dash-sugg-source">{s.source.name} ↗</span>}
          </a>
        ))}
      </div>
    </div>
  )
}

function Dashboard({ user, onNavigate }) {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({ entries: 0, projects: 0 })
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
    }
    load()
  }, [user.uid])

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
    { id: "pricing",     label: "Pricing"     },
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

      {/* ── Stats row ── */}
      <div className="dash-stats">
        <div className="dash-stat" onClick={() => onNavigate?.("journal")} role="button" tabIndex={0} title="Go to Journal">
          <div className="dash-stat-value">{stats.entries}</div>
          <div className="dash-stat-label">Journal Entries</div>
        </div>
        <div className="dash-stat" onClick={() => onNavigate?.("project")} role="button" tabIndex={0} title="Go to Projects">
          <div className="dash-stat-value">{stats.projects}</div>
          <div className="dash-stat-label">Projects</div>
        </div>
        <div className="dash-stat" onClick={() => onNavigate?.("roadmap")} role="button" tabIndex={0} title="Go to Learning Kit">
          {roadmap ? (
            <>
              <div className="dash-stat-value">{donePct}%</div>
              <div className="dash-stat-label">{roadmap.icon} {roadmap.title}</div>
            </>
          ) : (
            <>
              <div className="dash-stat-value">—</div>
              <div className="dash-stat-label">No pathway set</div>
            </>
          )}
        </div>
      </div>

      {/* ── Pathway progress bar ── */}
      {roadmap && (
        <div className="dash-pathway">
          <div className="dash-pathway-header">
            <span className="dash-pathway-title">{roadmap.icon} {roadmap.title} Pathway</span>
            <span className="dash-pathway-pct">{doneCount} / {totalTopics} mastered</span>
          </div>
          <div className="dash-pathway-bar">
            <div className="dash-pathway-fill" style={{ width: `${donePct}%` }} />
          </div>
        </div>
      )}

      {/* ── Quick Access ── */}
      <div className="dash-quick-label">Quick Access</div>
      <div className="dash-quick-grid">
        {QUICK_LINKS.map(link => (
          <button
            key={link.screen}
            className="dash-quick-tile"
            onClick={() => onNavigate?.(link.screen)}
          >
            <span className="dash-quick-icon">{link.icon}</span>
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
      {activeTab === "pricing"     && <PricingTab />}
      {activeTab === "suggestions" && <SuggestionsTab pathway={pathway} />}
    </div>
  )
}

export default Dashboard
