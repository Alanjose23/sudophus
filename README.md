# Sudophus

A personal development journal built for software practitioners who understand that the craft of programming requires perpetual relearning. Named after Sisyphus of Greek mythology — not as a warning, but as a reframe. The boulder always comes back down. The difference is that Sisyphus left no record. You will.

---

## Overview

Sudophus is a web application for documenting the ongoing process of learning and building in software development. It provides a structured environment for recording journal entries, managing projects, and following learning pathways — not as a productivity tool, but as an instrument of accountability to one's own curiosity.

The application is built on React 19 with React Router, backed by Firebase (Firestore, Authentication, and Storage).

---

## Features

### Journal
A freeform entry system tied to the authenticated user's account. Entries are timestamped, persisted to Firestore, and update in real time. Supports text entries, voice notes (recorded in-browser, up to 5 minutes, stored in Firebase Storage), inline editing, search, and CSV export.

### Projects
A project management layer that binds session entries to specific builds. Each project exposes:

- **Session log** — freeform work entries tied to the project
- **Streak tracker** — consecutive days with at least one recorded session
- **Progress bar** — completion percentage against a user-defined session target, colour-coded by stage
- **Screenshots** — image uploads attached to the project

Projects can be created with a title, description, target session count, and tags, and can be starred to surface priority work.

### Learning pathways
Curated developer roadmaps (frontend, backend, and more) with per-topic progress tracking. The active pathway drives project suggestions on the dashboard.

### Dashboard
Profile overview with journal/project stats, pathway progress, quick navigation, and project suggestions matched to the active pathway.

### Authentication
Email and password authentication via Firebase Auth, including in-app registration and password reset. Session state is managed reactively through `onAuthStateChanged`. All data is scoped to the authenticated user's UID and enforced server-side by security rules.

---

## Technical Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Routing | React Router 7 |
| Build tool | Vite 7 |
| Backend / database | Firebase Firestore |
| Authentication | Firebase Auth |
| File storage | Firebase Storage |
| Testing framework | Vitest 4 (tooling configured; suite not yet written) |
| Linter | ESLint 9 |

---

## Project Structure

```
src/
├── main.jsx               # Entry point; mounts BrowserRouter
├── App.jsx                # Routes, auth listener, home screen, shared header
├── App.css                # Global layout, header, home screen, shared components
├── firebase.js            # Firebase initialisation from env vars; exports db, auth, storage
├── journal.jsx / .css     # Journal view; text + voice entries, search, CSV export
├── login.jsx / .css       # Sign-up, sign-in, and password-reset flows
├── project.jsx / .css     # Project list, detail view, sessions, screenshots
├── roadmap.jsx / .css     # Learning pathways and topic progress
├── roadmapData.js         # Pathway/topic definitions
├── projectSuggestions.js  # Curated project ideas per pathway
├── dashboard.jsx          # Profile, stats, quick links, suggestions
├── about.jsx              # About page
├── quotes.js              # Curated quote collection
├── utils.js               # timeAgo, formatFull, calcStreak, progress + error helpers
└── index.css              # Base styles
```

Routes: `/` (home), `/journal`, `/projects`, `/learning`, `/dashboard`, `/about`, `/login`. Authenticated routes render the login card in place when signed out, preserving the requested URL through sign-in.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Firebase project with Firestore, Authentication (Email/Password), and Storage enabled

### Installation

```bash
git clone <repository-url>
cd sudophus
npm install
```

### Configuration

Copy `.env.example` to `.env` and supply your Firebase project credentials:

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
```

### Security rules

Firestore and Storage rules live in `firestore.rules` and `storage.rules`. Deploy them with the Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

The build also emits `dist/404.html` (a copy of `index.html`) so client-side routes resolve on GitHub Pages. Deployment to GitHub Pages runs automatically from `main` via `.github/workflows/deploy.yml`; the workflow expects the `VITE_*` values above as repository secrets.

---

## Data Model

### `users` collection (document ID = auth UID)

| Field | Type | Description |
|---|---|---|
| `username` | string | Display name chosen at sign-up |
| `email` | string | Account email |
| `activePathway` | string | Selected learning pathway ID |
| `progress` | map | Per-pathway topic progress |
| `createdAt` | Timestamp | Account creation time |

### `entries` collection

| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID of the owning user |
| `text` | string | Entry content |
| `projectId` | string \| null | Associated project ID, or absent for general entries |
| `audioUrl` / `audioPath` | string | Voice note download URL and storage path (optional) |
| `createdAt` | Timestamp | Server-side creation timestamp |

### `projects` collection

| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID of the owning user |
| `title` | string | Project name |
| `description` | string | Optional project description |
| `target` | number | Target number of work sessions |
| `tags` | string[] | Categorisation tags |
| `starred` | boolean | Whether the project is starred |
| `screenshots` | array | Uploaded screenshot metadata |
| `createdAt` | Timestamp | Server-side creation timestamp |

---

## Streak Calculation

A streak is the number of consecutive local calendar days on which at least one work session was recorded, counting backward from today. If no session exists for today, the count begins from yesterday, preserving the streak through the current day. A gap of two or more days without a session resets the count to zero.

---

## License

See [LICENSE](LICENSE).

---

*"One must imagine Sisyphus happy." — Albert Camus*
