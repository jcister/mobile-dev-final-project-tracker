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
