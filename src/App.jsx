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

import './App.css'

/* ── Serpentine SVG decoration for the hero ── */
function HeroSerpent() {
  return (
    <svg
      className="hero-serpent"
      viewBox="0 0 600 520"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#10b981" stopOpacity="0.55" />
          <stop offset="45%"  stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4"  />
        </linearGradient>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Primary coiling serpent body */}
      <path
        d="M 80,20 C 220,-10 420,90 320,160
           C 220,230 60,195 110,295
           C 160,395 410,355 360,435
           C 330,480 200,490 150,520"
        stroke="url(#sg)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Echo / shadow path */}
      <path
        d="M 105,30 C 245,0 445,100 345,170
           C 245,240 85,205 135,305
           C 185,405 435,365 385,445"
        stroke="url(#sg2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Accent dots — like scale glints */}
      <circle cx="200" cy="62"  r="2.5" fill="#10b981" opacity="0.5" />
      <circle cx="330" cy="120" r="2"   fill="#f59e0b" opacity="0.45" />
      <circle cx="125" cy="245" r="2.5" fill="#10b981" opacity="0.4" />
      <circle cx="320" cy="340" r="2"   fill="#f59e0b" opacity="0.4" />
      <circle cx="195" cy="440" r="2"   fill="#34d399" opacity="0.35" />

      {/* Far-right mirrored coil */}
      <path
        d="M 520,60 C 420,120 500,200 430,250
           C 360,300 470,360 410,420"
        stroke="url(#sg2)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

/* ── Shared header used on all inner screens ── */
function AppHeader({ user, onBack, onHome, onDashboard }) {
  return (
    <header className="app-header">
      <div className="header-brand" onClick={onHome} role="button" tabIndex={0}>
        <img
          src="../public/sudo.jpg"
          alt="Sudophus home"
          className="header-logo"
        />
        <span className="header-title">Sudophus</span>
      </div>
      <div className="header-actions">
        {user && (
          <span
            className="header-user header-user--clickable"
            onClick={onDashboard}
            title="Your dashboard"
          >
            {user.email}
          </span>
        )}
        <button onClick={onBack} className="btn-ghost">← Back</button>
      </div>
    </header>
  )
}

function App() {
  const [screen, setScreen] = useState("home")
  const [history, setHistory] = useState([])
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
      getDoc(doc(db, "users", u.uid)).then(snap => {
        const pathway = snap.data()?.activePathway ?? null
        setUserPathway(pathway)
        if (!pathway && !pathwayPromptedRef.current) {
          pathwayPromptedRef.current = true
          setScreen("roadmap")
        }
      })
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
          <nav className="home-nav">
            {user ? (
              <div className="user-bar">
                <span
                  className="user-greeting user-greeting--clickable"
                  onClick={goDashboard}
                  title="Your dashboard"
                >
                  {user.email}
                </span>
                <button onClick={goDashboard} className="btn-outline">Dashboard</button>
                <button onClick={handleLogout} className="btn-outline btn-outline--muted">Log Out</button>
              </div>
            ) : (
              <button onClick={() => navigateTo("login")} className="btn-outline">Login</button>
            )}
          </nav>

          <div className="hero">
            <HeroSerpent />
            <div className="hero-content">
              <img
                src="../public/sudo.jpg"
                alt="climb the mountain"
                className={`hero-img${imgClicking ? " hero-img--clicking" : ""}`}
                onClick={handleImageClick}
                title="About Sudophus"
              />
              <h1>Sudophus</h1>
              <p className="subtitle">Document your coding journey. Maintain your momentum.</p>
              <div className="quote-block">
                <p className="quote-text"><i>{quote}</i></p>
                <button onClick={quoteChange} className="btn-ghost-sm">Refresh quote</button>
              </div>
            </div>
          </div>

          <div className="cards">
            <div className="card" onClick={journalClick}>
              <div className="card-icon">📓</div>
              <h3>Journal</h3>
              <p>Record your daily progress and reflections</p>
              {count > 0 && <span className="badge" data-testid="journal-count">{count}</span>}
            </div>
            <div className="card" onClick={() => navigateTo("project")}>
              <div className="card-icon">🚀</div>
              <h3>Projects</h3>
              <p>Showcase and track your builds</p>
            </div>
            {user && (
              <div className="card" onClick={() => navigateTo("roadmap")}>
                <div className="card-icon">🗺️</div>
                <h3>Learning Kit</h3>
                <p>
                  {userPathway
                    ? `${ROADMAPS[userPathway]?.title ?? "Custom"} pathway`
                    : "Set up your learning pathway"}
                </p>
              </div>
            )}
            {user && (
              <div className="card" onClick={goDashboard}>
                <div className="card-icon">👤</div>
                <h3>Dashboard</h3>
                <p>Profile, email &amp; password settings</p>
              </div>
            )}
            {!user && (
              <div className="card" onClick={() => navigateTo("login")}>
                <div className="card-icon">🔑</div>
                <h3>Sign In</h3>
                <p>Start tracking your journey</p>
              </div>
            )}
          </div>
        </div>
      )
  }
}

export default App
