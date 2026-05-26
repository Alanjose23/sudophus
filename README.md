# Sudophus

A personal development journal built for software practitioners who understand that the craft of programming requires perpetual relearning. Named after Sisyphus of Greek mythology — not as a warning, but as a reframe. The boulder always comes back down. The difference is that Sisyphus left no record. You will.

---

## Overview

Sudophus is a full-stack web application designed to document the ongoing process of learning and building in software development. It provides a structured environment for recording journal entries, managing projects, and tracking progress over time — not as a productivity tool, but as an instrument of accountability to one's own curiosity.

The application is built on React 19 and Firebase, with Firestore as the persistence layer and Firebase Authentication for user identity.

---

## Features

### Journal
A freeform entry system tied to the authenticated user's account. Every entry is timestamped, persisted to Firestore, and immediately available on subsequent sessions. The journal is designed for unfiltered, honest documentation of the day's work — the bugs that took three days, the concept that finally clicked, the session where nothing went right.

### Projects
A project management layer that binds journal entries to specific builds. Each project exposes:

- **Session log** — freeform work entries tied to the project, recorded in Firestore under the authenticated user's account
- **Streak tracker** — consecutive days on which at least one session was recorded, calculated in real time from entry timestamps
- **Progress bar** — a self-adjusting completion indicator expressed as a percentage of logged sessions against a user-defined target, with colour coding that reflects the current stage of work

Projects can be created with a title, description, target session count, and tags. They can be starred to surface priority work.

### Authentication
Email and password authentication via Firebase Auth. New users may register directly within the application. Session state is managed reactively through `onAuthStateChanged`, requiring no page reload on sign-in or sign-out. Journal entries and projects are scoped strictly to the authenticated user's UID.

### Quotes
A rotating selection of curated quotations from writers, scientists, and thinkers who understood that the work is never finished — and that this is precisely the point. The quote displayed on the home screen refreshes on demand.

### About
An embedded page that contextualises the project's name, philosophy, and purpose, accessible via the hero image on the home screen.

---

## Technical Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool | Vite 7 |
| Backend / database | Firebase Firestore |
| Authentication | Firebase Auth |
| Testing framework | Vitest 4 |
| Testing utilities | @testing-library/react, @testing-library/jest-dom |
| Test environment | jsdom |
| Linter | ESLint 9 |

---

## Project Structure

```
src/
├── App.jsx              # Root component; navigation state, auth listener
├── App.css              # Global layout, header, home screen, shared components
├── firebase.js          # Firebase initialisation; exports db and auth
├── journal.jsx          # Journal view; Firestore read/write for user entries
├── journal.css
├── login.jsx            # Authentication view; sign-up and sign-in flows
├── login.css
├── project.jsx          # Project list, detail view, create form, session logging
├── project.css
├── projectHelpers.js    # calcStreak, progressPct, progressColor utilities
├── about.jsx            # About page with staggered entrance animations
├── about.css
├── quotes.js            # Curated quote collection (98 entries)
└── test-setup.js        # @testing-library/jest-dom setup
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Firebase project with Firestore and Authentication (Email/Password) enabled

### Installation

```bash
git clone <repository-url>
cd Sudophus1
npm install
```

### Configuration

Create a `.env` file in the project root and supply your Firebase project credentials:

```
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```

Update `src/firebase.js` to read these values from `import.meta.env` if not already configured.

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

### Tests

```bash
npm test          # watch mode
npm run test:run  # single run, CI-appropriate
```

The test suite currently comprises 95 tests across 5 test files, covering unit tests for helper functions, component rendering, user interaction flows, Firestore integration (mocked), and Firebase Auth state.

---

## Data Model

### `entries` collection

| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID of the owning user |
| `text` | string | Entry content |
| `projectId` | string \| null | Associated project ID, or null for general entries |
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
| `createdAt` | Timestamp | Server-side creation timestamp |

---

## Streak Calculation

A streak is defined as the number of consecutive calendar days (UTC) on which at least one work session was recorded, counting backward from today. If no session exists for today, the count begins from yesterday, preserving the streak through the current day. A gap of two or more days without a session resets the count to zero.

---

## License

See [LICENSE](LICENSE).

---

*"One must imagine Sisyphus happy." — Albert Camus*
