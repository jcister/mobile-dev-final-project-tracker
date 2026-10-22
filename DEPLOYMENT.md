# Deployment & Instructor Operations Guide
**Mobile Application Development Class Tracker (2026–2027)**
*Unofficial tracker for the Mobile Dev students of Joshua M. Cister. This is not an official UIC course system.*
*Built with Google AI Studio and Antigravity (AI-assisted development).*

---

## 1. System Overview

This application is built for two distinct audiences:
1. **Teacher / Admin Mode**:
   - Access is protected by an **Admin Passcode** (`ADMIN_PASSWORD`, default: `teacher2026`).
   - Unlocks full access to register/edit/delete student groups, log and audit weekly deliverables (Weeks 1 to 8), batch-ingest historical PDF reports (Weeks 1–4), sync with GitHub Kanban projects and repos, manage live cards, and run the AI Oral Defense Advisor.
   - Teachers can toggle **"Student Preview"** at any time to inspect exactly what students see.
2. **Student Mode (Default Public View)**:
   - When students visit your deployed URL, they are greeted by the **Weeks 1–8 Progress Matrix**.
   - Students can group by Team or view All Students, filter by section (`BSIT 3A & CS` or `BSIT 3B`), and search by project title or student name.
   - Clicking on any milestone displays the accomplishments summary, reported technical roadblocks, and direct Git commit verification links in a read-only drawer.
   - All management tabs (Teams, Kanban Boards, Blockers Radar) and action buttons (+ Add Team, Log Audit, Sync, Delete) are hidden from students.
3. **Shared Server-Side Persistence**:
   - All progress data, registered teams, overrides, and cards are persisted on the server disk under `server_data/tracker_store.json`.
   - Any updates you make as the instructor are instantly shared with all students who view the deployed page.

---

## 2. Recommended Deployment Options

### Option A: Render.com (Recommended Free / Low-friction)

1. Push your repository to your GitHub account (or organization).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your repository.
4. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `ADMIN_PASSWORD`: Your secret teacher passcode (e.g. `MySecureTeacherPass2026!`)
   - `GEMINI_API_KEY`: *(Optional)* Your Google AI Studio Gemini API key for automated PDF parsing & Defense AI evaluation.
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once deployed, Render gives you a public URL (e.g., `https://uic-mobile-dev-tracker.onrender.com`).
   - Share this exact URL with your students.
   - Students will automatically see the read-only Progress Matrix.
   - Click **Teacher Login** in the upper-right corner and enter your `ADMIN_PASSWORD` to unlock administrative controls.

---

### Option B: Railway.app

1. Go to [Railway](https://railway.app/) and create a **New Project** from GitHub repo.
2. Under Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Add Environment Variables:
   - `ADMIN_PASSWORD`: Your chosen passcode
   - `GEMINI_API_KEY`: Your Gemini API key
   - `NODE_ENV`: `production`
   - `PORT`: (Auto-provided by Railway)
4. Deploy and generate a domain.

---

### Option C: Google Cloud Run / Docker

If using Google Cloud Run or a Docker container:
1. Build the container or deploy via source repository:
   ```bash
   gcloud run deploy uic-mobile-tracker \
     --source . \
     --set-env-vars ADMIN_PASSWORD="your_password",GEMINI_API_KEY="your_key",NODE_ENV="production"
   ```
2. The server will bind to `0.0.0.0:$PORT` automatically.

---

### Option D: Local Network / Classroom Demo

You can also run the server on your local machine and share it on your classroom LAN:
1. Set `ADMIN_PASSWORD` in your `.env` file:
   ```env
   ADMIN_PASSWORD=teacher2026
   PORT=3000
   ```
2. Build and start:
   ```bash
   npm run build
   npm start
   ```
3. Find your local IP (e.g., `192.168.1.50`). Students on the same Wi-Fi network can visit `http://192.168.1.50:3000` to view their progress matrix.

---

## 3. Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | `teacher2026` | Passcode required to unlock Teacher / Admin mode. |
| `GOOGLE_SHEET_URL` | *(None)* | Optional static Google Sheet response link for 1-click & automatic background sync. |
| `GEMINI_API_KEY` | *(None)* | Enables Gemini AI for smart PDF progress report extraction and AI Oral Presentation Defense evaluation. |
| `PORT` | `3000` | HTTP listening port for the Express application server. |
| `NODE_ENV` | `development` | Set to `production` in production so Express serves the built `/dist` assets. |

---

## 4. Instructor Workflow & Tips

1. **First-Time Sign In**:
   - Visit the site and click **"Teacher Login"** in the top navigation bar.
   - Enter your passcode (`teacher2026` by default or your custom `ADMIN_PASSWORD`).
   - Check **"Remember on this browser"** so you stay authenticated on your teaching laptop.
2. **Adding & Updating Teams**:
   - Click **"+ Add Team"** to register student teams, member names, student IDs, and GitHub repo names.
   - Click any team card to edit members, update links, or remove dropped groups.
3. **Ingesting Weekly Reports**:
   - **Weeks 1–4**: Click **"Unify Reports"** to upload student PDF progress documents. The engine automatically parses deliverables and binds them into the matrix.
   - **Weeks 5–8**: Use **"Live Sync"** to pull GitHub issues directly from team repositories or connect your Google Sheets response link.
4. **Verifying What Students See**:
   - In the top navigation bar, click **"Student Preview"**.
   - The UI will immediately switch to the read-only student view so you can verify exactly what your class sees.
   - Click **"Exit Student Preview"** to return to Admin Mode.
