import { useState, useEffect, useRef } from 'react'
import Journal from './journal'
import Loginscreen from './login'
import Project from './project'
import About from './about'
import Roadmap from './roadmap'
import quotes from './quotes'
import { ROADMAPS } from './roadmapData'
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import './App.css'

function AppHeader({ user, onBack, onHome }) {
  return (
    <header className="app-header">
      <span className="header-title" onClick={onHome}>Sudophus</span>
      <div className="header-actions">
        {user && <span className="header-user">{user.email}</span>}
        <button onClick={onBack} className="btn-ghost">← Back</button>
      </div>
    </header>
  )
}

function App() {
  const [screen, setScreen] = useState("home")
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

  const handleLogout = async () => {
    await signOut(auth)
    setScreen("home")
    setCount(0)
  }

  const journalClick = () => {
    setCount(c => c + 1)
    setScreen("journal")
  }

  const backClick = () => {
    if (screen === "login") setCount(0)
    setScreen("home")
  }

  const goHome = () => setScreen("home")

  const handleImageClick = () => {
    setImgClicking(true)
    setTimeout(() => {
      setImgClicking(false)
      setScreen("about")
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
          <AppHeader user={user} onBack={backClick} onHome={goHome} />
          <About />
        </div>
      )

    case "journal":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} />
          {user
            ? <Journal entryC={count} user={user} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    case "login":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} />
          <Loginscreen />
        </div>
      )

    case "project":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} />
          {user
            ? <Project user={user} />
            : <div className="auth-prompt"><Loginscreen /></div>
          }
        </div>
      )

    case "roadmap":
      return (
        <div className="app-wrapper">
          <AppHeader user={user} onBack={backClick} onHome={goHome} />
          {user
            ? <Roadmap user={user} onPathwaySet={id => setUserPathway(id)} />
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
                <span className="user-greeting">{user.email}</span>
                <button onClick={handleLogout} className="btn-outline">Log Out</button>
              </div>
            ) : (
              <button onClick={() => setScreen("login")} className="btn-outline">Login</button>
            )}
          </nav>

          <div className="hero">
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

          <div className="cards">
            <div className="card" onClick={journalClick}>
              <div className="card-icon">📓</div>
              <h3>Journal</h3>
              <p>Record your daily progress and reflections</p>
              {count > 0 && <span className="badge" data-testid="journal-count">{count}</span>}
            </div>
            <div className="card" onClick={() => setScreen("project")}>
              <div className="card-icon">🚀</div>
              <h3>Projects</h3>
              <p>Showcase and track your builds</p>
            </div>
            {user && (
              <div className="card" onClick={() => setScreen("roadmap")}>
                <div className="card-icon">🗺️</div>
                <h3>Learning Kit</h3>
                <p>
                  {userPathway
                    ? `${ROADMAPS[userPathway]?.title ?? "Custom"} pathway`
                    : "Set up your learning pathway"}
                </p>
              </div>
            )}
            {!user && (
              <div className="card" onClick={() => setScreen("login")}>
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
