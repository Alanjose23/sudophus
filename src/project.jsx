import { useState, useEffect } from "react"
import { db, storage } from "./firebase"
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import "./project.css"
import { calcStreak, progressPct, progressColor } from "./projectHelpers"

function ProjectCard({ project, entryCount, streak, onClick, onStar }) {
  const pct = progressPct(entryCount, project.target)
  const color = progressColor(pct)
  return (
    <div className="proj-card" onClick={onClick} role="button" tabIndex={0}>
      <div>
        <div className="proj-card-title-row">
          <h3 className="proj-card-title">{project.title}</h3>
          <span
            className={`proj-star${project.starred ? " starred" : ""}`}
            onClick={e => { e.stopPropagation(); onStar() }}
            title={project.starred ? "Unstar" : "Star"}
          >
            {project.starred ? "★" : "☆"}
          </span>
        </div>
        {project.description && (
          <p className="proj-card-desc">{project.description}</p>
        )}
      </div>
      <div className="proj-card-footer">
        <div className="proj-progress-bar">
          <div
            className="proj-progress-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div className="proj-card-meta">
          <span className="proj-pct">{pct}%</span>
          {streak > 0 && (
            <span className="proj-streak" data-testid="streak-badge">
              🔥 {streak} day{streak !== 1 ? "s" : ""}
            </span>
          )}
          <span className="proj-entries">{entryCount} / {project.target ?? "?"} sessions</span>
        </div>
        {project.tags?.length > 0 && (
          <div className="proj-tags">
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}

function CreateProjectForm({ user, onCreated, onCancel }) {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [target, setTarget] = useState(20)
  const [tagsRaw, setTagsRaw] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title.trim()) { setError("Title is required"); return }
    setSaving(true)
    setError("")
    try {
      const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean)
      const docRef = await addDoc(collection(db, "projects"), {
        title: title.trim(),
        description: desc.trim(),
        target: Number(target) || 20,
        tags,
        starred: false,
        uid: user.uid,
        createdAt: serverTimestamp(),
      })
      onCreated({
        id: docRef.id,
        title: title.trim(),
        description: desc.trim(),
        target: Number(target) || 20,
        tags,
        starred: false,
        uid: user.uid,
        createdAt: new Date(),
      })
    } catch {
      setError("Failed to create project. Try again.")
      setSaving(false)
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <h2 className="create-form-title">New Project</h2>
      {error && <div className="form-error" data-testid="form-error">{error}</div>}
      <div className="form-group">
        <label htmlFor="proj-title">Title</label>
        <input
          id="proj-title"
          className="form-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project name"
          maxLength={80}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label htmlFor="proj-desc">Description</label>
        <textarea
          id="proj-desc"
          className="form-input form-textarea"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="What are you building?"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label htmlFor="proj-target">Target sessions</label>
        <input
          id="proj-target"
          className="form-input"
          type="number"
          min={1}
          max={500}
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="proj-tags">Tags (comma-separated)</label>
        <input
          id="proj-tags"
          className="form-input"
          value={tagsRaw}
          onChange={e => setTagsRaw(e.target.value)}
          placeholder="React, Firebase, TypeScript"
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
          style={{ width: "auto", padding: "0.65rem 1.5rem" }}
          data-testid="create-submit"
        >
          {saving ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  )
}

function ProjectDetail({ project, entries, user, onBack, onEntryAdded, onStar }) {
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [screenshots, setScreenshots] = useState(project.screenshots ?? [])
  const [uploadProgress, setUploadProgress] = useState(null)
  const pct = progressPct(entries.length, project.target)
  const color = progressColor(pct)
  const streak = calcStreak(entries)

  const handleUpload = file => {
    if (uploadProgress !== null) return
    const path = `screenshots/${user.uid}/${project.id}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    setUploadProgress(0)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      "state_changed",
      snap => setUploadProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      () => setUploadProgress(null),
      () => {
        getDownloadURL(task.snapshot.ref).then(url => {
          const newShot = { url, name: file.name, storagePath: path, uploadedAt: new Date() }
          setScreenshots(prev => {
            const updated = [...prev, newShot]
            updateDoc(doc(db, "projects", project.id), { screenshots: updated })
            return updated
          })
          setUploadProgress(null)
        })
      }
    )
  }

  const handleDeleteScreenshot = async shot => {
    const updated = screenshots.filter(s => s.storagePath !== shot.storagePath)
    setScreenshots(updated)
    await updateDoc(doc(db, "projects", project.id), { screenshots: updated })
    try { await deleteObject(ref(storage, shot.storagePath)) } catch { /* already gone */ }
  }

  const handleLog = async () => {
    if (!text.trim() || saving) return
    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "entries"), {
        text: text.trim(),
        uid: user.uid,
        projectId: project.id,
        createdAt: serverTimestamp(),
      })
      onEntryAdded({
        id: docRef.id,
        text: text.trim(),
        projectId: project.id,
        uid: user.uid,
        createdAt: new Date(),
      })
      setText("")
    } finally {
      setSaving(false)
    }
  }

  const formatDate = d => {
    const date = d?.toDate ? d.toDate() : new Date(d)
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }).format(date)
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="btn-ghost" onClick={onBack}>← Projects</button>
        <h2 className="detail-title">{project.title}</h2>
        <span
          className={`proj-star${project.starred ? " starred" : ""}`}
          onClick={onStar}
          title={project.starred ? "Unstar" : "Star"}
          data-testid="detail-star"
        >
          {project.starred ? "★" : "☆"}
        </span>
      </div>

      {project.description && (
        <p className="detail-desc">{project.description}</p>
      )}

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value" data-testid="sessions-count">{entries.length}</div>
          <div className="stat-label">sessions</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" data-testid="streak-value">{streak}</div>
          <div className="stat-label">day streak</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" data-testid="progress-pct">{pct}%</div>
          <div className="stat-label">complete</div>
        </div>
      </div>

      <div className="detail-progress">
        <div className="detail-progress-label">
          <span>{entries.length} of {project.target} sessions</span>
          <span style={{ color }}>{pct}%</span>
        </div>
        <div className="detail-progress-track">
          <div
            className="detail-progress-fill"
            data-testid="progress-bar"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>

      <div className="log-section">
        <label className="log-label">Log work session</label>
        <textarea
          className="log-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What did you work on?"
          rows={3}
          data-testid="log-textarea"
        />
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "0.6rem 1.4rem", marginTop: "0.75rem" }}
          onClick={handleLog}
          disabled={saving || !text.trim()}
          data-testid="log-btn"
        >
          {saving ? "Saving…" : "Log session"}
        </button>
      </div>

      <div className="entry-list">
        <h3 className="entry-list-heading">
          {entries.length > 0
            ? `${entries.length} session${entries.length !== 1 ? "s" : ""}`
            : "No sessions yet"}
        </h3>
        {entries.map(e => (
          <div key={e.id} className="entry-item" data-testid="entry-item">
            <p className="entry-text">{e.text}</p>
            <span className="entry-date">{formatDate(e.createdAt)}</span>
          </div>
        ))}
      </div>

      {project.tags?.length > 0 && (
        <div className="proj-tags" style={{ marginTop: "2rem" }}>
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}

      <div className="screenshots-section">
        <div className="screenshots-header">
          <h3 className="screenshots-title">Screenshots</h3>
          <label className={`btn-ghost-sm${uploadProgress !== null ? " uploading" : ""}`} style={{ cursor: "pointer" }}>
            {uploadProgress !== null ? `Uploading ${uploadProgress}%` : "+ Add screenshot"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              disabled={uploadProgress !== null}
              onChange={e => {
                if (e.target.files[0]) handleUpload(e.target.files[0])
                e.target.value = ""
              }}
              data-testid="screenshot-input"
            />
          </label>
        </div>

        {uploadProgress !== null && (
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {screenshots.length > 0 ? (
          <div className="screenshots-grid" data-testid="screenshots-grid">
            {screenshots.map((shot, i) => (
              <div key={shot.storagePath ?? i} className="screenshot-thumb">
                <img
                  src={shot.url}
                  alt={shot.name}
                  className="screenshot-img"
                  onClick={() => window.open(shot.url, "_blank")}
                />
                <button
                  className="screenshot-delete"
                  onClick={() => handleDeleteScreenshot(shot)}
                  title="Remove screenshot"
                  data-testid="screenshot-delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="screenshots-empty">No screenshots yet. Document your build visually.</p>
        )}
      </div>
    </div>
  )
}

function Project({ user }) {
  const [projects, setProjects] = useState([])
  const [allEntries, setAllEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("list")
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [pSnap, eSnap] = await Promise.all([
        getDocs(query(collection(db, "projects"), where("uid", "==", user.uid))),
        getDocs(query(collection(db, "entries"), where("uid", "==", user.uid))),
      ])
      if (cancelled) return
      const projs = pSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setProjects(projs)
      setAllEntries(eSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [user.uid])

  const projectEntries = pid => allEntries.filter(e => e.projectId === pid)

  const handleStar = async proj => {
    const next = !proj.starred
    setProjects(ps => ps.map(p => p.id === proj.id ? { ...p, starred: next } : p))
    setActiveProject(ap => ap?.id === proj.id ? { ...ap, starred: next } : ap)
    await updateDoc(doc(db, "projects", proj.id), { starred: next })
  }

  if (loading) {
    return (
      <div className="proj-loading" data-testid="proj-loading">
        <span className="loading-dot" />
      </div>
    )
  }

  if (view === "create") {
    return (
      <div className="proj-page">
        <CreateProjectForm
          user={user}
          onCreated={p => {
            setProjects(ps => [p, ...ps])
            setView("list")
          }}
          onCancel={() => setView("list")}
        />
      </div>
    )
  }

  if (view === "detail" && activeProject) {
    return (
      <ProjectDetail
        project={activeProject}
        entries={projectEntries(activeProject.id)}
        user={user}
        onBack={() => { setView("list"); setActiveProject(null) }}
        onEntryAdded={entry => setAllEntries(prev => [entry, ...prev])}
        onStar={() => handleStar(activeProject)}
      />
    )
  }

  return (
    <div className="proj-page">
      <div className="proj-list-header">
        <h2 className="proj-list-title">Projects</h2>
        <button className="btn-outline" onClick={() => setView("create")}>+ New project</button>
      </div>

      {projects.length === 0 ? (
        <div className="proj-empty" data-testid="empty-state">
          <p>No projects yet.</p>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "0.6rem 1.4rem", marginTop: "1rem" }}
            onClick={() => setView("create")}
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="proj-grid" data-testid="project-grid">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              entryCount={projectEntries(p.id).length}
              streak={calcStreak(projectEntries(p.id))}
              onClick={() => { setActiveProject(p); setView("detail") }}
              onStar={() => handleStar(p)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Project
