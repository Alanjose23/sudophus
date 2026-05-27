import { useState, useEffect } from 'react'
import "./journal.css"
import { db } from "./firebase"
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { timeAgo, formatFull } from "./utils"

function Journal({ entryC, user }) {
  const [entries, setEntries] = useState([])
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, "entries"), where("uid", "==", user.uid))
        const snapshot = await getDocs(q)
        const loaded = snapshot.docs
          .map(d => ({
            id: d.id,
            text: d.data().text,
            createdAt: d.data().createdAt?.toDate() ?? null,
          }))
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        setEntries(loaded)
      } catch (err) {
        console.error(err)
        setLoadError("Could not load entries. Check your connection and try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [user.uid])

  const addEntry = async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      const docRef = await addDoc(collection(db, "entries"), {
        text,
        uid: user.uid,
        createdAt: serverTimestamp(),
      })
      setEntries(prev => [{ id: docRef.id, text, createdAt: new Date() }, ...prev])
      setText("")
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteEntry = async (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    try {
      await deleteDoc(doc(db, "entries", id))
    } catch (err) {
      console.error(err)
    }
  }

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
        onChange={(e) => setText(e.target.value)}
      />

      <div className="journal-actions">
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "0.65rem 2rem" }}
          onClick={addEntry}
          disabled={saving || !text.trim()}
        >
          {saving ? "Saving…" : "Save Entry"}
        </button>
      </div>

      <div className="entries-list">
        {!loading && entries.length > 0 && (
          <h4 className="entries-heading">All entries ({entries.length})</h4>
        )}

        {loadError && (
          <div className="entries-error">{loadError}</div>
        )}

        {loading ? (
          <div className="entries-skeleton">
            <div className="skeleton-item" />
            <div className="skeleton-item" />
            <div className="skeleton-item" />
          </div>
        ) : (
          entries.map((entry) => (
            <div className="entry-item" key={entry.id}>
              <div className="entry-item-body">
                <p>{entry.text}</p>
                {entry.createdAt && (
                  <div className="entry-timestamp">
                    <span
                      className="entry-time-relative"
                      title={formatFull(entry.createdAt)}
                    >
                      {timeAgo(entry.createdAt)}
                    </span>
                    <span className="entry-time-absolute">
                      {formatFull(entry.createdAt)}
                    </span>
                  </div>
                )}
              </div>
              <button
                className="entry-delete"
                onClick={() => deleteEntry(entry.id)}
                title="Delete entry"
                aria-label="Delete entry"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Journal
