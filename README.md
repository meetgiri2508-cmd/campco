# CampusConnect Mumbai

A Vite + React + Tailwind prototype: internships & research board (with CV gate and
verified-company/professor posting), major-wise live chat with Q&A threads, clubs,
and a LinkedIn-style network.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Deploy to Vercel

**This is why you were getting NOT_FOUND before** — a single `.jsx` file isn't a
deployable project. This folder is a real project with a `package.json`, build step,
and entry point, so Vercel knows how to build and serve it.

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
cd campus-connect-app
vercel
```

Follow the prompts (link/create a project, accept defaults). Vercel auto-detects Vite:
- Build command: `npm run build`
- Output directory: `dist`

### Option B — GitHub + Vercel dashboard

```bash
cd campus-connect-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

Then in [vercel.com/new](https://vercel.com/new), import that repo. Vercel will
detect the Vite framework preset automatically — just click Deploy.

## Notes

- All data (profiles, opportunities, chat, clubs) is in-memory React state — it
  resets on page refresh. There's no backend yet.
- `src/App.jsx` is the entire app (single-file, per how it was built as a prototype).
