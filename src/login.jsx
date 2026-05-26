import { useState } from "react"
import { auth } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { db } from "./firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import "./login.css"

function Loginscreen() {
  const [view, setView] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const resetFields = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setError("")
  }

  const signup = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = credential.user.uid
      await setDoc(doc(db, "users", uid), {
        username,
        email,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (view === "signup") {
    return (
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />
        </div>
        <button onClick={signup} disabled={loading} className="btn-primary">
          {loading ? "Creating account…" : "Create Account"}
        </button>
        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => { setView("login"); resetFields() }}>Sign in</span>
        </p>
      </div>
    )
  }

  if (view === "login") {
    return (
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <button onClick={login} disabled={loading} className="btn-primary">
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <p className="auth-switch">
          New to Sudophus?{" "}
          <span onClick={() => { setView("signup"); resetFields() }}>Create account</span>
        </p>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <h2>Get Started</h2>
      <p className="auth-subtitle">Sign in to track your progress and access all features.</p>
      <div className="auth-buttons">
        <button onClick={() => setView("signup")} className="btn-primary">Create Account</button>
        <button onClick={() => setView("login")} className="btn-outline">Sign In</button>
      </div>
    </div>
  )
}

export default Loginscreen
