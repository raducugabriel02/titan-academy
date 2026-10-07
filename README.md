# 🏋️ Titan Academy

**A complete fitness web app** — workout tracker, nutrition journal, and progress analytics, built with Next.js and Supabase.

**🌐 Live demo: [titan-academy-green.vercel.app](https://titan-academy-green.vercel.app)** — installable on your phone as a PWA.

![Titan Academy — home page](docs/home.png)

## ✨ Features

### 🔐 Authentication
- **Email and password** accounts (sign-up, login, password reset by email)
- **Google login** (OAuth via Supabase, with account picker)
- Protected routes via middleware — personal pages require authentication

### 📊 Dashboard
- Daily summary: today's workouts, total volume, calories consumed vs. target
- Current-month stats and quick access to all sections

### 💪 Workout tracker
- **Per-set logging** (reps + weight for each set), with automatic merging of identical sets
- **Active session from a plan**: pick the day's plan and the app guides you exercise by exercise, with checkmarks, auto-advance, and a final summary
- **Personal record (PR) detection** on save
- Smart prefill: selecting an exercise shows what you did "last time"
- Full history with inline editing

### 📈 Per-exercise progress
- **Estimated 1RM** (Epley formula) calculated from every session
- Custom SVG chart with 3 metrics: max weight, e1RM, and volume
- Full session history for the selected exercise

### 🥗 Nutrition
- **TDEE calculation** (Mifflin-St Jeor formula) and personalized macro targets based on goal (cut / maintain / bulk)
- Daily journal: calories, protein, carbs, fat, water
- Calorie progress ring and weekly chart
- Manually editable targets

### 📚 Exercise catalog
- Over 50 exercises with **demonstration photos**, step-by-step instructions, execution tips, and video
- Filter by muscle group, search, log directly from the exercise page

### 👤 Profile
- Personal data (weight, height, age, goal), **auto-calculated BMI**, avatar uploaded to Supabase Storage

### 📱 PWA
- Installable on your phone (manifest + service worker + icons) — behaves like a native app

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Auth | Supabase Auth — email/password + Google OAuth (PKCE flow with server-side callback) |

## 🗄️ Database structure

| Table | Content |
|---|---|
| `profiles` | User data: name, weight, height, age, gender, goal |
| `exercises` | Exercise catalog: name, slug, muscle group, equipment, instructions, tips |
| `workouts` | Workout logs: exercise, sets, reps, weight, notes, date |
| `nutrition` | Daily journal: calories, macros, water, notes |

Plus a Storage bucket (`avatars`) for profile pictures. All tables use **Row Level Security** — each user only sees their own data.

## 🚀 Running locally

**1. Clone and install:**

```bash
git clone https://github.com/raducugabriel02/titan-academy.git
cd titan-academy
npm install
```

**2. Set up Supabase** — create a project on [supabase.com](https://supabase.com) and add the keys to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

**3. Seed the exercise catalog:**

```bash
npx ts-node scripts/seed.ts
```

**4. Start the dev server:**

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

> Google login also requires an OAuth Client ID in Google Cloud Console, connected to Supabase (Authentication → Providers → Google).

## 🧩 Implementation details

- **Hand-drawn SVG charts** — no charting libraries; the calorie ring and progress chart are custom components.
- **Server-side OAuth callback** (`app/auth/callback/route.ts`) — exchanges the PKCE code for a session on the server, then redirects; session cookies are managed with `@supabase/ssr`.
- **Local calendar days** (`lib/dates.ts`) — all day-based calculations use the user's local timezone, not UTC, so the journal doesn't "jump" days at midnight.
- **Workout session persists** in `localStorage` — if you close the page mid-workout, you pick up where you left off.
- **Identical consecutive sets are merged** on save (3 sets of 10×60kg become a single `3×10×60` row), keeping the history clean.
