# Mobile App Project Tracker & Kanban Monitor

> **Unofficial course tracker** for Mobile Application Development students under **Joshua M. Cister**.  
> *Notice: This application is not an official University of the Immaculate Conception (UIC) system. Developed using Google AI Studio and Antigravity (AI-assisted development).*

---

## 📱 Project Overview

This dashboard is a unified progress monitoring and academic audit system designed for Mobile Application Development teams. It synchronizes two distinct phases of project tracking into a single interactive progression matrix and Kanban workspace:

1. **Weeks 1–4 (Midterm Period)**:
   - Sourced from individual progress report submissions in Google Classroom.
   - Counted towards student midterm grades.
   - Includes document/PDF reports on ideation, wireframing, architecture, and scaffolding.
2. **Weeks 5–8 (Final Term Period)**:
   - Recorded exclusively for final term evaluation.
   - Directly integrated with weekly Google Form audit responses, active GitHub Project Kanban tickets, and repository commits.

---

## 🚀 Key Features

- **Unified Weeks 1–8 Progression Matrix**:
  - Pinned/sticky navigation with dual scroll containment and fixed column widths.
  - Granular column visibility manager (hide/show specific weeks or entire eras).
  - Density toggle (**Comfortable** vs. **Compact**) with fast week jump anchors.
  - Multi-author identification badges with author switching in the inspection drawer.
  - Color-coded semantic status chips (Done, In Progress, Blockers/Pending).
- **Public Student View**:
  - Read-only dashboard with filter by section (`BSIT 3A & CS`, `BSIT 3B`), search by student or app title.
  - Direct quick-action links to submit/update reports via Google Forms or visit the GitHub Organization.
- **Teacher / Admin Mode**:
  - Protected by an administrator passcode (`ADMIN_PASSWORD`).
  - Full management of teams, student rosters, custom Kanban boards, and manual audit logging.
  - Automated PDF batch report parser with AI fallback.
  - Oral Defense AI Advisor engine for evaluating team readiness and defense questions.
  - Real-time student preview mode.
- **Persistence**:
  - File-backed persistent storage (`server_data/tracker_store.json`) with instant client synchronization.

---

## 🔄 Data Ingestion, Synchronization & Deduplication

The tracker combines historical reports, Google Forms responses, and optional GitHub/Kanban updates. Data is normalized before it is displayed or saved so that naming differences do not create extra students or teams.

### Student identity matching

Student identity is resolved in this order:

1. Normalized email address (case-insensitive and trimmed).
2. Student ID.
3. Tokenized name comparison as a fallback.

Therefore, submissions such as `Ramos, Dave Noel T.` and another spelling of the same student are counted as one member when they use the same email address. Team member lists are also merged by email, so a changed name does not increase the team size.

### Audit and ticket deduplication

- An audit with the same record ID is considered the same record.
- Otherwise, audits are duplicates when they identify the same student and have the same timestamp.
- During a sync, incoming data updates the matching record instead of appending another row.
- Existing useful values such as summaries, commit links, and non-`None` blocker details are preserved when the incoming response is incomplete.
- Kanban cards are deduplicated by card ID, or by team, week, and assignee when no shared ID exists.
- Team names are normalized to canonical team IDs, preventing variations such as capitalization or common spelling differences from creating separate teams.

### Google Forms synchronization

The **Live Sync** action downloads the linked Google Sheet as CSV through `/api/forms/sync-live-sheet`. The server:

1. Detects common response columns such as email, week, student name, team, status, feature, and commit.
2. Converts each response into an audit record.
3. Normalizes the team name and maps the response status to `Done`, `In Progress`, `Review`, or `Backlog`.
4. Removes duplicate responses before returning the results.
5. Merges the results with existing audits and saves the updated shared state.

The application also supports a Google Apps Script webhook at `/api/webhooks/google-form` for receiving form-submit events. Automatic background sync runs every five minutes while an administrator is signed in. A valid Google Sheet must be shared so the server can read its CSV export.

### Data sources and scope

- **Weeks 1–4** use historical document/PDF reports.
- **Weeks 5–8** are the final-term dashboard scope and use Google Forms audits plus Kanban/GitHub data.
- Repeated submissions do not inflate readiness because the score uses distinct logged weeks and distinct completed weeks.

### Team readiness calculation

For final-term Weeks 5–8:

- Each logged week contributes 20 points.
- Each week containing a `Done` audit contributes up to 5 additional quality points.
- Scores are capped between 10% and 100%.
- Teams with all four final-term weeks completed remain at 100%; historical blocker notes do not reduce an already complete team.
- Incomplete teams with three or more distinct blocker messages receive a 10-point penalty.

This means a team can have many audit rows while still being counted correctly as one person per email and one completion milestone per week.

### Persistence, recovery, and reset

- Browser preferences and local fallback data are stored in `localStorage`.
- Shared audits, custom teams, team overrides, deleted team IDs, and Kanban cards are stored in `server_data/tracker_store.json`.
- On startup, the client loads shared server state and automatically cleans duplicate audits/cards.
- Administrators can use **Reset to Default** to clear local custom data and restore the seeded tracker dataset. This also resets the server store when an authenticated admin session is active.

---

## 🔗 Official Course Links

- **Student Progress Report Submission Form**:  
  [Google Form Progress Audit](https://docs.google.com/forms/d/1UpePK5pjkXIr67T3zpSHIVKRHRYucYzVKEcHJGAxSvE/edit)
- **GitHub Organization**:  
  [UIC-CCS-MOBILE-DEVELOPMENT-2026-2027](https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027)

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Radix UI (Popover, Checkbox, Tooltip)
- **Backend / Server**: Express 4, Node.js (`tsx`)
- **AI Integration**: Google Gen AI SDK (`@google/genai`) via Google AI Studio
- **Document Processing**: `pdf-parse`

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### 1. Installation

```bash
git clone https://github.com/your-username/mobile-dev-final-project-tracker.git
cd mobile-dev-final-project-tracker
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
ADMIN_PASSWORD=your_secure_admin_password
GEMINI_API_KEY=your_google_ai_studio_api_key_optional
```

*(Note: `GEMINI_API_KEY` is optional. The application includes a resilient local fallback engine for defense evaluations and report ingestion if an API key is not supplied).*

### 3. Running the Server

Start both the Express API and the Vite development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production & Deployment

To build and run in production:

```bash
npm run build
npm start
```

For detailed deployment guides on **Render**, **Railway**, and self-hosted VPS environments, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📄 Academic Policy & Grading Disclosure

- **Weeks 1–4**: Historical individual submissions from Google Classroom. Represents midterm project foundations and counted in midterm grading.
- **Weeks 5–8**: Live weekly Google Form responses and GitHub Kanban commits. Represents final-term deliverables and MVP completion.

---

## ⚖️ Disclaimers & Attribution

- This software is created for instructional tracking by **Joshua M. Cister**. It is not an official UIC portal or university-wide software.
- AI-assisted development powered by **Google AI Studio** and **Antigravity**.
