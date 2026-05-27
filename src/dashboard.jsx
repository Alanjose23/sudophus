import { useState, useEffect } from "react"
import { auth, db } from "./firebase"
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
} from "firebase/auth"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ROADMAPS } from "./roadmapData"
import "./dashboard.css"

const QUICK_LINKS = [
  { screen: "journal",  icon: "📓", label: "Journal",      desc: "Write & reflect"         },
  { screen: "project",  icon: "🚀", label: "Projects",     desc: "Track your builds"        },
  { screen: "roadmap",  icon: "🗺️", label: "Learning Kit", desc: "Your pathway progress"    },
  { screen: "about",    icon: "🐍", label: "About",        desc: "The Sudophus story"       },
]

function friendlyError(code) {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":   return "Incorrect current password."
    case "auth/email-already-in-use": return "That email is already taken."
    case "auth/invalid-email":        return "Invalid email address."
    case "auth/weak-password":        return "Password must be at least 6 characters."
    case "auth/too-many-requests":    return "Too many attempts — try again later."
    case "auth/requires-recent-login":return "Re-enter your current password to continue."
    default:                          return "Something went wrong. Try again."
  }
}

function StatusMsg({ msg }) {
  if (!msg) return null
  return <div className={`dash-msg dash-msg--${msg.type}`}>{msg.text}</div>
}

function Dashboard({ user, onNavigate }) {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({ entries: 0, projects: 0 })
  const [activeTab, setActiveTab] = useState("email")

  // Change email state
  const [newEmail, setNewEmail]   = useState("")
  const [emailPw, setEmailPw]     = useState("")
  const [emailMsg, setEmailMsg]   = useState(null)
  const [emailLoading, setEmailLoading] = useState(false)

  // Change password state
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwMsg, setPwMsg]         = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

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

  const handleEmailChange = async e => {
    e.preventDefault()
    if (!newEmail.trim() || !emailPw) return
    setEmailLoading(true)
    setEmailMsg(null)
    try {
      const credential = EmailAuthProvider.credential(user.email, emailPw)
      await reauthenticateWithCredential(user, credential)
      await verifyBeforeUpdateEmail(user, newEmail.trim())
      setEmailMsg({
        type: "success",
        text: `Verification link sent to ${newEmail.trim()}. Click it to confirm.`,
      })
      setNewEmail("")
      setEmailPw("")
    } catch (err) {
      setEmailMsg({ type: "error", text: friendlyError(err.code) })
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (!currentPw || !newPw || !confirmPw) return
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "New passwords do not match." }); return }
    if (newPw.length < 6)    { setPwMsg({ type: "error", text: "Password must be at least 6 characters." }); return }
    setPwLoading(true)
    setPwMsg(null)
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPw)
      setPwMsg({ type: "success", text: "Password updated successfully." })
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
    } catch (err) {
      setPwMsg({ type: "error", text: friendlyError(err.code) })
    } finally {
      setPwLoading(false)
    }
  }

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

      {/* ── Account settings tabs ── */}
      <div className="dash-section-heading">Account Settings</div>
      <div className="dash-tabs">
        <button
          className={`dash-tab${activeTab === "email" ? " active" : ""}`}
          onClick={() => setActiveTab("email")}
        >
          Change Email
        </button>
        <button
          className={`dash-tab${activeTab === "password" ? " active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* ── Change email ── */}
      {activeTab === "email" && (
        <div className="dash-section">
          <h3 className="dash-section-title">Update Email Address</h3>
          <p className="dash-section-sub">
            A verification link will be sent to your new address. Your email
            won&apos;t change until you click the link.
          </p>
          <form className="dash-form" onSubmit={handleEmailChange}>
            <div className="form-group">
              <label htmlFor="new-email">New email</label>
              <input id="new-email" className="form-input" type="email" value={newEmail}
                onChange={e => setNewEmail(e.target.value)} placeholder="new@example.com"
                autoComplete="email" />
            </div>
            <div className="form-group">
              <label htmlFor="email-pw">Current password</label>
              <input id="email-pw" className="form-input" type="password" value={emailPw}
                onChange={e => setEmailPw(e.target.value)} placeholder="Your current password"
                autoComplete="current-password" />
            </div>
            <StatusMsg msg={emailMsg} />
            <button type="submit" className="btn-primary"
              style={{ width: "auto", padding: "0.6rem 1.5rem", marginTop: "0.5rem" }}
              disabled={emailLoading || !newEmail.trim() || !emailPw}>
              {emailLoading ? "Sending…" : "Send Verification"}
            </button>
          </form>
        </div>
      )}

      {/* ── Change password ── */}
      {activeTab === "password" && (
        <div className="dash-section">
          <h3 className="dash-section-title">Change Password</h3>
          <p className="dash-section-sub">You must enter your current password to set a new one.</p>
          <form className="dash-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="current-pw">Current password</label>
              <input id="current-pw" className="form-input" type="password" value={currentPw}
                onChange={e => setCurrentPw(e.target.value)} placeholder="Current password"
                autoComplete="current-password" />
            </div>
            <div className="form-group">
              <label htmlFor="new-pw">New password</label>
              <input id="new-pw" className="form-input" type="password" value={newPw}
                onChange={e => setNewPw(e.target.value)} placeholder="At least 6 characters"
                autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-pw">Confirm new password</label>
              <input id="confirm-pw" className="form-input" type="password" value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password"
                autoComplete="new-password" />
            </div>
            <StatusMsg msg={pwMsg} />
            <button type="submit" className="btn-primary"
              style={{ width: "auto", padding: "0.6rem 1.5rem", marginTop: "0.5rem" }}
              disabled={pwLoading || !currentPw || !newPw || !confirmPw}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Dashboard
