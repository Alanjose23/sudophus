import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import WeeklyDigest from './weeklyDigest'
import quotes from './quotes'

/* Route-level code splitting: each page loads on first visit */
const Journal     = lazy(() => import('./journal'))
const Loginscreen = lazy(() => import('./login'))
const Project     = lazy(() => import('./project'))
const About       = lazy(() => import('./about'))
const Roadmap     = lazy(() => import('./roadmap'))
const Dashboard   = lazy(() => import('./dashboard'))
import { ROADMAPS } from './roadmapData'
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { NotebookPen, Rocket, Map, KeyRound, RefreshCw } from './icons.jsx'
import sudoLogo from './assets/sudo.jpg'

import './App.css'

/* Screen ids (used by Dashboard quick links) → routes */
const PATHS = {
  home:      "/",
  about:     "/about",
  journal:   "/journal",
  project:   "/projects",
  roadmap:   "/learning",
  dashboard: "/dashboard",
  login:     "/login",
}

/* ── Neural SVG decoration (indigo signal aesthetic) ── */
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
          <stop offset="0%" stopColor="#7886FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7886FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7886FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nl4" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7886FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0" />
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
      <path className="node-dash" d="M450,270 C380,260 280,200 130,90"  stroke="#7886FF" />
      <path className="node-dash" d="M450,270 C520,260 620,200 770,90"  stroke="#5B6BFF" />
      <path className="node-dash" d="M450,270 C380,280 260,340 110,430" stroke="#7886FF" />
      <path className="node-dash" d="M450,270 C520,280 640,340 790,430" stroke="#5B6BFF" />

      {/* Central glow rings */}
      <circle cx="450" cy="270" r="45"  fill="none" stroke="#5B6BFF" strokeWidth="0.6" opacity="0.2" />
      <circle cx="450" cy="270" r="90"  fill="none" stroke="#5B6BFF" strokeWidth="0.4" opacity="0.1" />
      <circle cx="450" cy="270" r="145" fill="none" stroke="#5B6BFF" strokeWidth="0.3" opacity="0.06" />

      {/* Central node dot */}
      <circle cx="450" cy="270" r="4.5" fill="#7886FF" opacity="0.7" />

      {/* Endpoint accent dots */}
      <circle cx="130"  cy="90"  r="3.5" fill="#5B6BFF" opacity="0.55" />
      <circle cx="770"  cy="90"  r="3.5" fill="#5B6BFF" opacity="0.55" />
      <circle cx="110"  cy="430" r="3.5" fill="#5B6BFF" opacity="0.55" />
      <circle cx="790"  cy="430" r="3.5" fill="#5B6BFF" opacity="0.55" />
      <circle cx="200"  cy="60"  r="2"   fill="#7886FF" opacity="0.35" />
      <circle cx="700"  cy="60"  r="2"   fill="#7886FF" opacity="0.35" />
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
function AppHeader({ user }) {
  const navigate = useNavigate()
  return (
    <header className="app-header">
      <Link to="/" className="header-brand" title="Home">
        <img src={sudoLogo} alt="Sudophus home" className="header-logo" />
        <span className="header-title">Sudophus</span>
      </Link>
      <div className="header-actions">
        {user && (
          <Link to="/dashboard" className="header-user header-user--clickable" title="Your dashboard">
            {user.email}
          </Link>
        )}
        <button onClick={() => navigate(-1)} className="btn-ghost">← Back</button>
      </div>
    </header>
  )
}

function HubCards({ userPathway }) {
  const items = [
    {
      to:    PATHS.journal,
      Icon:  NotebookPen,
      label: "Journal",
      desc:  "Log your daily progress",
    },
    {
      to:    PATHS.project,
      Icon:  Rocket,
      label: "Projects",
      desc:  "Build & showcase your work",
    },
    {
      to:    PATHS.roadmap,
      Icon:  Map,
      label: "Dev Topics",
      desc:  userPathway
        ? `${ROADMAPS[userPathway]?.title ?? "Custom"} pathway`
        : "Set your learning path",
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
            <stop offset="0%"   stopColor="#7886FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hgm" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="#7886FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="hgr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7886FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5B6BFF" stopOpacity="0.1" />
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
        <circle cx="410" cy="24" r="5"  fill="#7886FF" opacity="0.85" />
        <circle cx="410" cy="24" r="14" fill="none" stroke="#7886FF" strokeWidth="0.6" opacity="0.25" />
        <circle cx="410" cy="24" r="26" fill="none" stroke="#7886FF" strokeWidth="0.3" opacity="0.12" />

        {/* Endpoint accent dots */}
        <circle cx="139" cy="188" r="3.5" fill="#5B6BFF" opacity="0.55" />
        <circle cx="410" cy="192" r="3.5" fill="#5B6BFF" opacity="0.55" />
        <circle cx="681" cy="188" r="3.5" fill="#5B6BFF" opacity="0.55" />
      </svg>

      <div className="hub-cards">
        {items.map(item => (
          <Link key={item.to} to={item.to} className="hub-card">
            <span className="hub-card-icon"><item.Icon size={36} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="hub-card-label">{item.label}</span>
            <span className="hub-card-desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ── Home (landing) screen ── */
function Home({ user, userPathway }) {
  const navigate = useNavigate()
  const [imgClicking, setImgClicking] = useState(false)
  const [quote, setQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  )

  const quoteChange = () => {
    const idx = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[idx])
  }

  const handleLogout = () => signOut(auth)

  const handleImageClick = () => {
    setImgClicking(true)
    setTimeout(() => {
      setImgClicking(false)
      navigate(PATHS.about)
    }, 350)
  }

  return (
    <div className="container">
      {/* ── Navigation ── */}
      <nav className="home-nav">
        <div className="nav-brand">
          <img src={sudoLogo} alt="Sudophus" className="header-logo" />
          <span className="nav-title">Sudophus</span>
        </div>
        <div className="nav-links">
          <Link className="nav-link" to={PATHS.about}>About</Link>
          <Link className="nav-link" to={PATHS.journal}>Journal</Link>
          <Link className="nav-link" to={PATHS.project}>Projects</Link>
          {user && <Link className="nav-link" to={PATHS.roadmap}>Learning</Link>}
        </div>
        <div className="nav-actions">
          {user ? (
            <div className="user-bar">
              <Link to={PATHS.dashboard} className="user-greeting user-greeting--clickable" title="Your dashboard">
                {user.email}
              </Link>
              <button onClick={() => navigate(PATHS.dashboard)} className="btn-outline">Dashboard</button>
              <button onClick={handleLogout} className="btn-outline btn-outline--muted">Log Out</button>
            </div>
          ) : (
            <Link to={PATHS.login} className="nav-cta">Get Started</Link>
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
          {user ? (
            <WeeklyDigest user={user} />
          ) : (
            <img
              src={sudoLogo}
              alt="climb the mountain"
              className={`hero-img${imgClicking ? " hero-img--clicking" : ""}`}
              onClick={handleImageClick}
              title="About Sudophus"
            />
          )}
          <div className="hero-cta-group">
            {user ? (
              <button className="btn-primary hero-cta-primary" onClick={() => navigate(PATHS.dashboard)}>
                Open Dashboard
              </button>
            ) : (
              <>
                <button className="btn-primary hero-cta-primary" onClick={() => navigate(PATHS.login)}>
                  Get Started
                </button>
                <button className="btn-ghost-gold" onClick={() => navigate(PATHS.about)}>
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
        <button onClick={quoteChange} className="btn-ghost-sm btn-icon-row">
          <RefreshCw size={13} strokeWidth={1.75} aria-hidden="true" /> Refresh
        </button>
      </div>

      {/* ── Feature area ── */}
      {user ? (
        <HubCards userPathway={userPathway} />
      ) : (
        <div className="cards">
          <Link to={PATHS.journal} className="card">
            <div className="card-icon"><NotebookPen size={28} strokeWidth={1.5} aria-hidden="true" /></div>
            <h3>Journal</h3>
            <p>Record your daily progress and reflections</p>
          </Link>
          <Link to={PATHS.project} className="card">
            <div className="card-icon"><Rocket size={28} strokeWidth={1.5} aria-hidden="true" /></div>
            <h3>Projects</h3>
            <p>Showcase and track your builds</p>
          </Link>
          <Link to={PATHS.login} className="card">
            <div className="card-icon"><KeyRound size={28} strokeWidth={1.5} aria-hidden="true" /></div>
            <h3>Sign In</h3>
            <p>Start tracking your journey</p>
          </Link>
        </div>
      )}
    </div>
  )
}

/* ── Shared chrome for all inner screens ── */
function ShellLayout({ user }) {
  return (
    <div className="app-wrapper">
      <AppHeader user={user} />
      <Outlet />
    </div>
  )
}

/* Renders the login card in place when the route needs an account.
   The URL is preserved, so the requested page appears right after sign-in. */
function RequireAuth({ user, children }) {
  if (!user) return <div className="auth-prompt"><Loginscreen /></div>
  return children
}

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [userPathway, setUserPathway] = useState(null)
  const pathwayPromptedRef = useRef(false)

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
            navigate(PATHS.roadmap)
          }
        })
        .catch(err => console.error("Failed to load user data:", err))
    })
    return unsubscribe
  }, [navigate])

  if (!authReady) {
    return (
      <div className="loading-screen">
        <span className="loading-dot" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="loading-screen">
          <span className="loading-dot" />
        </div>
      }
    >
    <Routes>
      <Route path="/" element={<Home user={user} userPathway={userPathway} />} />
      <Route element={<ShellLayout user={user} />}>
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Loginscreen />}
        />
        <Route
          path="/journal"
          element={
            <RequireAuth user={user}>
              <Journal user={user} />
            </RequireAuth>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireAuth user={user}>
              <Project user={user} userPathway={userPathway} />
            </RequireAuth>
          }
        />
        <Route
          path="/learning"
          element={
            <RequireAuth user={user}>
              <Roadmap user={user} onPathwaySet={setUserPathway} />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <Dashboard user={user} onNavigate={id => navigate(PATHS[id] ?? "/")} />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  )
}

export default App
