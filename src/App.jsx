import { useState, useEffect, useRef } from 'react'
import Journal from './journal'
import Loginscreen from './login'
import Project from './project'
import About from './about'
import Roadmap from './roadmap'
import Dashboard from './dashboard'
import quotes from './quotes'
import { ROADMAPS } from './roadmapData'
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import sudoLogo from './assets/sudo.jpg'

import './App.css'

/* ── Neural SVG decoration (gold snake aesthetic) ── */
function HeroNeural() {
  return (
    <svg
      className="hero-neural"
      viewBox="0 0 900 500"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nl1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl4" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Neural bezier branches from center outward — snake coil paths */}
      <path className="node-line" d="M450,270 C380,260 280,200 130,90"   stroke="url(#nl1)" />
      <path className="node-line" d="M450,270 C520,260 620,200 770,90"   stroke="url(#nl2)" />
      <path className="node-line" d="M450,270 C380,280 260,340 110,430"  stroke="url(#nl3)" />
      <path className="node-line" d="M450,270 C520,280 640,340 790,430"  stroke="url(#nl4)" />
      {/* Secondary branches */}
      <path className="node-line" d="M450,270 C400,240 320,160 200,60"  stroke="url(#nl1)" strokeWidth="0.7" opacity="0.4" />
      <path className="node-line" d="M450,270 C500,240 580,160 700,60"  stroke="url(#nl2)" strokeWidth="0.7" opacity="0.4" />

      {/* Dashed flow overlay */}
      <path className="node-dash" d="M450,270 C380,260 280,200 130,90"  stroke="#c9b8a0" />
      <path className="node-dash" d="M450,270 C520,260 620,200 770,90"  stroke="#a78b71" />
      <path className="node-dash" d="M450,270 C380,280 260,340 110,430" stroke="#c9b8a0" />
      <path className="node-dash" d="M450,270 C520,280 640,340 790,430" stroke="#a78b71" />

      {/* Central glow rings */}
      <circle cx="450" cy="270" r="45"  fill="none" stroke="#a78b71" strokeWidth="0.6" opacity="0.2" />
      <circle cx="450" cy="270" r="90"  fill="none" stroke="#a78b71" strokeWidth="0.4" opacity="0.1" />
      <circle cx="450" cy="270" r="145" fill="none" stroke="#a78b71" strokeWidth="0.3" opacity="0.06" />

      {/* Central node dot */}
      <circle cx="450" cy="270" r="4.5" fill="#c9b8a0" opacity="0.7" />

      {/* Endpoint accent dots */}
      <circle cx="130"  cy="90"  r="3.5" fill="#a78b71" opacity="0.55" />
      <circle cx="770"  cy="90"  r="3.5" fill="#a78b71" opacity="0.55" />
      <circle cx="110"  cy="430" r="3.5" fill="#a78b71" opacity="0.55" />
      <circle cx="790"  cy="430" r="3.5" fill="#a78b71" opacity="0.55" />
      <circle cx="200"  cy="60"  r="2"   fill="#c9b8a0" opacity="0.35" />
      <circle cx="700"  cy="60"  r="2"   fill="#c9b8a0" opacity="0.35" />
    </svg>
  )
}

function LivePill() {
  return (
    <div className="live-pill" aria-hidden="true">
      <span className="live-dot" />
      <span className="live-label">Live</span>
      <span className="live-text">Your journey, tracked</span>
    </div>
  )
}

/* ── Shared header used on all inner screens ── */
function AppHeader({ user, onBack, onHome, onDashboard }) {
  return (
    <header className="app-header">
      <div className="header-brand" onClick={onHome} role="button" tabIndex={0} title="Home">
        <img src={sudoLogo} alt="Sudophus home" className="header-logo" />
        <span className="header-title">Sudophus</span>
      </div>
      <div className="header-actions">
        {user && (
          <span className="header-user header-user--clickable" onClick={onDashboard} title="Your dashboard">
            {user.email}
          </span>
        )}
        <button onClick={onBack} className="btn-ghost">← Back</button>
      </div>
    </header>
  )
}

function HubCards({ onNavigate, onJournal, userPathway, count }) {
  const items = [
    {
      id:    "journal",
      icon:  "📓",
      label: "Journal",
      desc:  "Log your daily progress",
      badge: count > 0 ? count : null,
      delay: "0s",
    },
    {
      id:    "project",
      icon:  "🚀",
      label: "Projects",
      desc:  "Build & showcase your work",
      delay: "0.6s",
    },
    {
      id:    "roadmap",
      icon:  "🗺️",
      label: "Dev Topics",
      desc:  userPathway
        ? `${ROADMAPS[userPathway]?.title ?? "Custom"} pathway`
        : "Set your learning path",
      delay: "1.2s",
    },
  ]

  return (
    <div className="hub-section">
      <svg
        className="hub-svg"
        viewBox="0 0 820 300"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="hgl" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#c9b8a0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78b71" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hgm" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="#c9b8a0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78b71" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hgr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#c9b8a0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78b71" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Hub node → Journal */}
        <path className="node-line" style={{ animationDelay: "0s" }}
          d="M410,24 C380,80 240,140 139,188" stroke="url(#hgl)" />
        {/* Hub node → Projects */}
        <path className="node-line" style={{ animationDelay: "0.6s" }}
          d="M410,24 C410,80 410,130 410,192" stroke="url(#hgm)" />
        {/* Hub node → Dev Topics */}
        <path className="node-line" style={{ animationDelay: "1.2s" }}
          d="M410,24 C440,80 580,140 681,188" stroke="url(#hgr)" />

        {/* Hub center */}
        <circle cx="410" cy="24" r="5"  fill="#c9b8a0" opacity="0.85" />
        <circle cx="410" cy="24" r="14" fill="none" stroke="#c9b8a0" strokeWidth="0.6" opacity="0.25" />
        <circle cx="410" cy="24" r="26" fill="none" stroke="#c9b8a0" strokeWidth="0.3" opacity="0.12" />

        {/* Endpoint accent dots */}
        <circle cx="139" cy="188" r="3.5" fill="#a78b71" opacity="0.55" />
        <circle cx="410" cy="192" r="3.5" fill="#a78b71" opacity="0.55" />
        <circle cx="681" cy="188" r="3.5" fill="#a78b71" opacity="0.55" />
      </svg>

      <div className="hub-cards">
        {items.map(item => (
          <button
            key={item.id}
            className="hub-card"
            onClick={() => item.id === "journal" ? onJournal() : onNavigate(item.id)}
          >
            <span className="hub-card-icon">{item.icon}</span>
            <span className="hub-card-label">{item.label}</span>
            <span className="hub-card-desc">{item.desc}</span>
            {item.badge && <span className="hub-card-badge">{item.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState("home")
  const [, setHistory] = useState([])
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [imgClicking, setImgClicking] = useState(false)
  const [quote, setQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  )
  const [userPathway, setUserPathway] = useState(null)
  const pathwayPromptedRef = useRef(false)

  const quoteChange = () => {
    const idx = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[idx])
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady(true)
      if (!u) {
        setUserPathway(null)
        pathwayPromptedRef.current = false
        return
      }
      getDoc(doc(db, "users", u.uid))
        .then(snap => {
          const pathway = snap.data()?.activePathway ?? null
          setUserPathway(pathway)
          if (!pathway && !pathwayPromptedRef.current) {
            pathwayPromptedRef.current = true
            setScreen("roadmap")
          }
        })
        .catch(err => console.error("Failed to load user data:", err))
    })
    return unsubscribe
  }, [])

  const navigateTo = (next) => {
    if (next === screen) return
    setHistory(h => [...h, screen])
    setScreen(next)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setHistory([])
    setScreen("home")
    setCount(0)
  }

  const journalClick = () => {
    setCount(c => c + 1)
    navigateTo("journal")
  }

  const backClick = () => {
    if (screen === "login") setCount(0)
    setHistory(h => {
      const prev = h.at(-1) ?? "home"
      setScreen(prev)
      return h.slice(0, -1)
    })
  }

  const goHome      = () => { setHistory([]); setScreen("home") }
  const goDashboard = () => navigateTo("dashboard")

  const handleImageClick = () => {
    setImgClicking(true)
    setTimeout(() => {
      setImgClicking(false)
      navigateTo("about")
    }, 350)
  }

  if (!authReady) {
    return (
      <div className="loading-screen">
        <span className="loading-dot" />
      </div>
    )
  }

  switch (screen) {
    case "about":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          <About />
        </div>
      )

    case "journal":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          {user
            ? <Journal entryC={count} user={user} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    case "login":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          <Loginscreen />
        </div>
      )

    case "project":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          {user
            ? <Project user={user} userPathway={userPathway} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    case "roadmap":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          {user
            ? <Roadmap user={user} onPathwaySet={id => setUserPathway(id)} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    case "dashboard":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} onDashboard={goDashboard} />
          {user
            ? <Dashboard user={user} onNavigate={navigateTo} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    default:
      return (
        <div className="container">
          {/* ── Navigation ── */}
          <nav className="home-nav">
            <div className="nav-brand" role="button" tabIndex={0}>
              <img src={sudoLogo} alt="Sudophus" className="header-logo" />
              <span className="nav-title">Sudophus</span>
            </div>
            <div className="nav-links">
              <button className="nav-link" onClick={() => navigateTo("about")}>About</button>
              <button className="nav-link" onClick={journalClick}>Journal</button>
              <button className="nav-link" onClick={() => navigateTo("project")}>Projects</button>
              {user && <button className="nav-link" onClick={() => navigateTo("roadmap")}>Learning</button>}
            </div>
            <div className="nav-actions">
              {user ? (
                <div className="user-bar">
                  <span className="user-greeting user-greeting--clickable" onClick={goDashboard} title="Your dashboard">
                    {user.email}
                  </span>
                  <button onClick={goDashboard} className="btn-outline">Dashboard</button>
                  <button onClick={handleLogout} className="btn-outline btn-outline--muted">Log Out</button>
                </div>
              ) : (
                <button onClick={() => navigateTo("login")} className="nav-cta">Get Started</button>
              )}
            </div>
          </nav>

          {/* ── Hero ── */}
          <div className="hero">
            <HeroNeural />
            <div className="hero-content">
              <LivePill />
              <h1 className="hero-headline">
                Document your<br />
                <em>coding journey.</em>
              </h1>
              <p className="subtitle">Maintain your momentum. Track your growth.</p>
              <img
                src={sudoLogo}
                alt="climb the mountain"
                className={`hero-img${imgClicking ? " hero-img--clicking" : ""}`}
                onClick={handleImageClick}
                title="About Sudophus"
              />
              <div className="hero-cta-group">
                {user ? (
                  <button className="btn-primary hero-cta-primary" onClick={goDashboard}>
                    Open Dashboard
                  </button>
                ) : (
                  <>
                    <button className="btn-primary hero-cta-primary" onClick={() => navigateTo("login")}>
                      Get Started
                    </button>
                    <button className="btn-ghost-gold" onClick={() => navigateTo("about")}>
                      Learn more ↗
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Quote ── */}
          <div className="quote-block" style={{ margin: "0 auto 1rem" }}>
            <p className="quote-text"><i>{quote}</i></p>
            <button onClick={quoteChange} className="btn-ghost-sm">↻ Refresh</button>
          </div>

          {/* ── Feature area ── */}
          {user ? (
            <HubCards
              onNavigate={navigateTo}
              onJournal={journalClick}
              userPathway={userPathway}
              count={count}
            />
          ) : (
            <div className="cards">
              <div className="card" onClick={journalClick}>
                <div className="card-icon">📓</div>
                <h3>Journal</h3>
                <p>Record your daily progress and reflections</p>
              </div>
              <div className="card" onClick={() => navigateTo("project")}>
                <div className="card-icon">🚀</div>
                <h3>Projects</h3>
                <p>Showcase and track your builds</p>
              </div>
              <div className="card" onClick={() => navigateTo("login")}>
                <div className="card-icon">🔑</div>
                <h3>Sign In</h3>
                <p>Start tracking your journey</p>
              </div>
            </div>
          )}
        </div>
      )
  }
}

export default App