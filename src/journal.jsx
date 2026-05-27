import { useState, useEffect, useRef } from 'react'
import "./journal.css"
import { db, storage } from "./firebase"
import {
  collection, addDoc, query, where, serverTimestamp,
  deleteDoc, doc, updateDoc, onSnapshot,
} from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { timeAgo, formatFull } from "./utils"

const MAX_REC_SECS = 300 // 5-minute cap
const canRecord    =
  typeof MediaRecorder !== "undefined" &&
  typeof navigator?.mediaDevices?.getUserMedia === "function"

function fmtTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

function Journal({ entryC, user }) {
  const [entries, setEntries]   = useState([])
  const [text, setText]         = useState("")
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch]     = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  // Recording state machine: idle → recording → preview → (save) → idle
  const [recState, setRecState]         = useState("idle")
  const [audioBlob, setAudioBlob]       = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [recSecs, setRecSecs]           = useState(0)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [micError, setMicError]         = useState(false)
  const mediaRecRef = useRef(null)
  const chunksRef   = useRef([])
  const timerRef    = useRef(null)

  /* ── Real-time entry listener ── */
  useEffect(() => {
    const q    = query(collection(db, "entries"), where("uid", "==", user.uid))
    const unsub = onSnapshot(
      q,
      snapshot => {
        const loaded = snapshot.docs
          .map(d => ({
            id:        d.id,
            text:      d.data().text      ?? "",
            audioUrl:  d.data().audioUrl  ?? null,
            audioPath: d.data().audioPath ?? null,
            createdAt: d.data().createdAt?.toDate() ?? null,
          }))
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        setEntries(loaded)
        setLoading(false)
      },
      err => {
        console.error(err)
        setLoadError("Could not load entries. Check your connection and try again.")
        setLoading(false)
      }
    )
    return unsub
  }, [user.uid])

  /* ── Clean up recorder on unmount ── */
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      if (mediaRecRef.current?.state !== "inactive") {
        try { mediaRecRef.current.stop() } catch { /* ignore */ }
      }
    }
  }, [])

  /* ── Auto-stop at max duration ── */
  useEffect(() => {
    if (recSecs < MAX_REC_SECS) return
    clearInterval(timerRef.current)
    if (mediaRecRef.current?.state !== "inactive") {
      try { mediaRecRef.current.stop() } catch { /* ignore */ }
    }
  }, [recSecs])

  /* ── Recording controls ── */
  const startRecording = async () => {
    setMicError(false)
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecRef.current = recorder
      chunksRef.current   = []

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url  = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setPreviewUrl(url)
        setRecState("preview")
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start(250)
      setRecState("recording")
      setRecSecs(0)
      timerRef.current = setInterval(() => setRecSecs(s => s + 1), 1000)
    } catch (err) {
      console.error("Mic access denied:", err)
      setMicError(true)
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    if (mediaRecRef.current?.state !== "inactive") {
      mediaRecRef.current.stop()
    }
  }

  const discardRecording = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setAudioBlob(null)
    setPreviewUrl(null)
    setRecSecs(0)
    setRecState("idle")
  }

  /* ── Save entry (text + optional audio) ── */
  const addEntry = async () => {
    if (!text.trim() && !audioBlob) return
    setSaving(true)
    let audioUrl  = null
    let audioPath = null
    try {
      if (audioBlob) {
        setUploadingAudio(true)
        const ext  = audioBlob.type.includes("webm") ? "webm" : "mp4"
        audioPath  = `audio/${user.uid}/${Date.now()}.${ext}`
        const task = uploadBytesResumable(ref(storage, audioPath), audioBlob)
        await new Promise((resolve, reject) =>
          task.on("state_changed", null, reject, async () => {
            audioUrl = await getDownloadURL(task.snapshot.ref)
            resolve()
          })
        )
        setUploadingAudio(false)
      }

      await addDoc(collection(db, "entries"), {
        text: text.trim(),
        uid:  user.uid,
        ...(audioUrl && { audioUrl, audioPath }),
        createdAt: serverTimestamp(),
      })
      setText("")
      discardRecording()
    } catch (err) {
      console.error(err)
      if (audioUrl && audioPath) {
        // DB write failed — clean up the orphaned storage file
        try { await deleteObject(ref(storage, audioPath)) } catch { /* ignore */ }
      }
      setUploadingAudio(false)
    } finally {
      setSaving(false)
    }
  }

  const deleteEntry = async id => {
    const entry = entries.find(e => e.id === id)
    try {
      if (entry?.audioPath) {
        try { await deleteObject(ref(storage, entry.audioPath)) } catch { /* already gone */ }
      }
      await deleteDoc(doc(db, "entries", id))
    } catch (err) { console.error(err) }
  }

  const startEdit  = entry => { setEditingId(entry.id); setEditText(entry.text) }
  const cancelEdit = ()    => { setEditingId(null); setEditText("") }
  const saveEdit   = async () => {
    if (!editText.trim() || !editingId) return
    try {
      await updateDoc(doc(db, "entries", editingId), { text: editText.trim() })
      cancelEdit()
    } catch (err) { console.error(err) }
  }

  const exportCSV = () => {
    if (!entries.length) return
    const rows = [["Date", "Entry", "Has Audio"]]
    entries.forEach(e => {
      const date = e.createdAt ? formatFull(e.createdAt) : ""
      rows.push([`"${date}"`, `"${e.text.replace(/"/g, '""')}"`, e.audioUrl ? "yes" : "no"])
    })
    const csv  = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "journal-entries.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = search.trim()
    ? entries.filter(e => e.text.toLowerCase().includes(search.toLowerCase()))
    : entries

  const isBusy  = saving || uploadingAudio
  const canSave = !isBusy && (text.trim().length > 0 || audioBlob !== null)

  const metaText = loading
    ? "Loading your entries…"
    : entries.length === 0
      ? "No entries yet — start writing"
      : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} total`

  return (
    <div className="journal-container">
      <h2>Journal entry: #{entryC}</h2>
      <p className="journal-meta">{metaText}</p>

      <textarea
        className="journal-textarea"
        placeholder="What did you work on today? What did you learn?"
        rows={10}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addEntry() }}
      />
      <p className="journal-hint">Ctrl + Enter to save</p>

      {/* ── Voice recording ── */}
      {canRecord && (
        <div className="rec-controls">
          {recState === "idle" && (
            <button className="rec-btn" onClick={startRecording}>
              <svg className="rec-mic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="8"  y1="22" x2="16" y2="22" />
              </svg>
              Record voice note
            </button>
          )}

          {recState === "recording" && (
            <div className="rec-active">
              <span className="rec-dot" aria-hidden="true" />
              <span className="rec-timer" aria-live="polite">{fmtTime(recSecs)}</span>
              <span className="rec-limit">/ {fmtTime(MAX_REC_SECS)}</span>
              <button className="rec-stop-btn" onClick={stopRecording} aria-label="Stop recording">
                ■ Stop
              </button>
            </div>
          )}

          {recState === "preview" && (
            <div className="rec-preview">
              <span className="rec-preview-icon" aria-hidden="true">🎙</span>
              <audio controls src={previewUrl} className="rec-preview-audio" />
              <button className="rec-discard-btn" onClick={discardRecording} title="Discard recording" aria-label="Discard recording">
                ✕
              </button>
            </div>
          )}

          {micError && (
            <p className="rec-error">Microphone access denied — enable it in your browser settings.</p>
          )}
        </div>
      )}

      <div className="journal-actions">
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "0.65rem 2rem" }}
          onClick={addEntry}
          disabled={!canSave}
        >
          {uploadingAudio ? "Uploading audio…" : saving ? "Saving…" : "Save Entry"}
        </button>
      </div>

      {entries.length > 0 && (
        <div className="journal-toolbar">
          <input
            className="journal-search"
            type="search"
            placeholder="Search entries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-ghost-sm" onClick={exportCSV} title="Download all entries as CSV">
            ↓ Export CSV
          </button>
        </div>
      )}

      <div className="entries-list">
        {!loading && entries.length > 0 && (
          <h4 className="entries-heading">
            {search.trim()
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
              : `All entries (${entries.length})`}
          </h4>
        )}

        {loadError && <div className="entries-error">{loadError}</div>}

        {loading ? (
          <div className="entries-skeleton">
            <div className="skeleton-item" />
            <div className="skeleton-item" />
            <div className="skeleton-item" />
          </div>
        ) : (
          filtered.map(entry => (
            <div className={`entry-item${entry.audioUrl ? " entry-item--audio" : ""}`} key={entry.id}>
              {editingId === entry.id ? (
                <div className="entry-edit">
                  <textarea
                    className="entry-edit-textarea"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={4}
                    autoFocus
                    onKeyDown={e => { if (e.key === "Escape") cancelEdit() }}
                  />
                  <div className="entry-edit-actions">
                    <button className="btn-ghost-sm" onClick={cancelEdit}>Cancel</button>
                    <button
                      className="btn-primary"
                      style={{ width: "auto", padding: "0.4rem 1.1rem", fontSize: "0.82rem" }}
                      onClick={saveEdit}
                      disabled={!editText.trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="entry-item-body">
                  {entry.text && <p>{entry.text}</p>}
                  {entry.audioUrl && (
                    <div className="entry-audio">
                      <audio controls src={entry.audioUrl} className="entry-audio-player" />
                    </div>
                  )}
                  {entry.createdAt && (
                    <div className="entry-timestamp">
                      <span className="entry-time-relative" title={formatFull(entry.createdAt)}>
                        {timeAgo(entry.createdAt)}
                      </span>
                      {entry.audioUrl && <span className="entry-audio-chip">🎙 voice</span>}
                      <span className="entry-time-absolute">{formatFull(entry.createdAt)}</span>
                    </div>
                  )}
                </div>
              )}
              {editingId !== entry.id && (
                <div className="entry-actions">
                  <button className="entry-edit-btn" onClick={() => startEdit(entry)}
                    title="Edit entry" aria-label="Edit entry">✎</button>
                  <button className="entry-delete" onClick={() => deleteEntry(entry.id)}
                    title="Delete entry" aria-label="Delete entry">×</button>
                </div>
              )}
            </div>
          ))
        )}

        {!loading && search.trim() && filtered.length === 0 && (
          <p className="entries-no-results">No entries match your search.</p>
        )}
      </div>
    </div>
  )
}

export default Journal
