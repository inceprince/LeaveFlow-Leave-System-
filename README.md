# LeaveFlow

LeaveFlow is a full-stack employee leave management system built with React and Vite. It runs entirely in the browser — all data is persisted in **localStorage** through a mock API layer, so no backend or database is required to run the app.

## Live Demo

**Employee login**
- Email: `employee@rockpaperscissors.studio`
- Password: `Demo@123`

**Admin / Manager login**
- Email: `admin@rockpaperscissors.studio`
- Password: `Demo@123`

> Credentials are pre-filled on the login page — just click **Sign In**.

---

## Overview

| Role | Capabilities |
|------|-------------|
| Employee | Apply for leaves, view history, track status, update profile, change password |
| Manager | Review pending requests, approve/reject with comments, filter all leaves, browse employees |

The app uses a client-side mock API (`src/services/api.js`) backed by localStorage that mirrors a real Axios response shape. Switching to a real backend requires only replacing the service functions with actual `axios` calls.

---

## Features

### Employee Module

- **Leave Application** — Apply for Casual, Privilege, or Half-Day (First/Second Half) leave
- **Overlap Prevention** — UI blocks dates already covered by existing, non-rejected leaves
- **Duration Display** — Automatically calculates and shows the number of days selected
- **Leave Calendar** — Color-coded calendar view (green = Approved, amber = Pending, red = Rejected)
- **Leave History** — Card grid showing all applications with status badge and manager comments
- **Leave Stats** — Summary cards: Total, Approved, Rejected, Pending counts
- **Attendance Dashboard** — Monthly attendance rate (SVG ring chart), recent 10-day log
- **Team Directory** — Browse all team members, search by name/role/location, filter by department
- **Announcements** — Company-wide announcements with category filters and per-card AI Summary
- **Profile Page** — Update name, email, phone, department
- **Change Password** — Inline password update with validation
- **Dark / Light Mode** — Theme toggle persisted via React context
- **Responsive Design** — Full mobile layout with horizontal stat scroll and sub-tab navigation

### Admin / Manager Module

- **Sidebar Navigation** — Persistent sidebar with live counts per section
- **Pending Requests** — Table of all PENDING leaves; dropdown to approve or reject
- **Comment Modal** — Add an optional comment when approving, required when rejecting
- **All Leaves** — View every leave record with collapsible filter panel
- **Filters** — Search by employee name, month, year, and leave type; apply or clear all
- **Users Section** — List of all employees with search; click any row to open leave history modal
- **Leave History Modal** — Shows full leave history for a selected employee with total days
- **Change Password** — Password update modal accessible from sidebar footer
- **Refresh** — Manual data refresh with last-updated timestamp indicator

---

## AI Feature

`src/services/aiService.js` provides the **AI Summary** button on every announcement card.

- If `VITE_GEMINI_API_KEY` is set in `.env`, it calls the **Google Gemini 1.5 Flash** API and returns 3 bullet-point summaries.
- If no API key is configured, it falls back to a local **extractive summarizer** that scores sentences by term frequency and picks the top 3 — no API call needed.

Both paths produce the same UI output.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| HTTP Client | Axios (mock layer, no real calls by default) |
| Icons | Lucide React |
| Calendar | react-calendar |
| AI | Google Gemini 1.5 Flash  |


---

## Project Structure

```
src/
  assets/            Static images (logo)
  components/
    Announcements.js        Company announcements with AI summary
    AttendanceDashboard.js  Monthly attendance stats and log
    EnhancedCalendar.js     Leave calendar with color-coded overlays
    TeamDirectory.js        Searchable/filterable team member grid
    ThemeToggle.js          Light/dark mode toggle button
  contexts/
    ThemeContext.js          Global theme state (light/dark)
  data/
    mockData.js             Static seed data: announcements, team, attendance
  hooks/
    useRealTimeLeaves.js    Custom hook to fetch and cache the current user's leaves
    useRealTimeUpdates.js   Polling hook (unused in current build)
  pages/
    Login.js               Shared login page for employees and admins
    UserSignup.js          Employee registration
    ForgotPassword.js      Password recovery flow
    UserDashboard.js       Employee dashboard (leave form, calendar, history, tabs)
    AdminDashboard.js      Manager dashboard (sidebar, tables, modals)
    Profile.js             Profile info and password change
  services/
    api.js                 Mock API backed by localStorage
    aiService.js           Gemini AI / extractive announcement summarizer
  index.css              Global styles + Tailwind directives
  index.js               React entry point
  App.js                 Router with role-based private routes
public/                  Static public assets
dist/                    Production build output
Dockerfile               Multi-stage Docker build (Node → Nginx)
```

---

## Routes

### Frontend Routes

| Path | Description | Protected |
|------|-------------|-----------|
| `/` | Redirects to `/login` | No |
| `/login` | Employee login | No |
| `/admin/login` | Manager login (same component) | No |
| `/signup` | Employee registration | No |
| `/forgot-password` | Password reset request | No |
| `/dashboard` | Employee dashboard | Yes (USER) |
| `/profile` | Employee profile & password | Yes (USER) |
| `/admin` | Redirects to `/admin/dashboard` | No |
| `/admin/dashboard` | Manager dashboard | Yes (MANAGER) |

Route protection is handled by the `PrivateRoute` wrapper in `App.js`, which reads `token` and `role` from localStorage.

---

## Mock API

`src/services/api.js` is a pure-frontend mock that stores all data in three localStorage keys:

| Key | Contents |
|-----|----------|
| `lf_leaves` | All leave records |
| `lf_extra_users` | Users created via signup |
| `lf_init` | Initialization flag (seed data runs once) |

### Seed data

**7 users** (1 manager, 6 employees) and **9 leave records** are seeded on first load.

### Exported services

```
authService    — login, register
userService    — applyLeave, getMyLeaves, updateProfile, changePassword, forgotPassword
managerService — getPendingLeaves, getAllLeaves, filterLeavesEnhanced,
                 approveLeave, rejectLeave, getAllUsers, getUserLeaves
```

All functions return `{ data: ... }` to match Axios response shape so call-sites work unchanged if replaced with real HTTP calls.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install and run

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd "Employee Dashboard"

# 2. Install dependencies
npm install

# 3. (Optional) Create .env for AI summarization
echo VITE_GEMINI_API_KEY=your_key_here > .env

# 4. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for AI announcement summaries. Omit to use the offline extractive fallback. |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |

---

## Docker Deployment

The included `Dockerfile` uses a two-stage build:

1. **Build stage** — Node 18 Alpine installs dependencies and runs `vite build`
2. **Production stage** — Nginx Alpine serves the static output with SPA routing, asset caching, and security headers

```bash
# Build the image
docker build -t leaveflow .

# Run on port 8080
docker run -p 8080:80 leaveflow
```

The Nginx config handles client-side routing (`try_files $uri /index.html`), 1-year cache headers for static assets, and the following security headers: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`.

---

## Evaluation Criteria

| Criteria | Weight |
|----------|--------|
| React Fundamentals | 25% |
| Code Quality | 20% |
| UI/UX | 20% |
| AI Feature | 15% |
| State Management | 10% |
| Documentation | 5% |
| Creativity | 5% |

---

## Notes

- All data is stored in the browser's localStorage. Clearing site data resets the app to seed state.
- The mock API introduces realistic artificial delays (200–600 ms) to simulate network latency.
- The admin and employee login share the same `Login` component; the page detects the route (`/admin/login` vs `/login`) to switch mode and pre-fill the correct demo credentials.
- Half-day leaves auto-lock the End Date field and require a session selection (First Half / Second Half). Two people can hold opposite sessions on the same day.
