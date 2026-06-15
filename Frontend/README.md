# CommuteIQ — React + Vite + TailwindCSS

Production-quality conversion of the CommuteIQ prototype into a full React application.

## Tech Stack

- React 19 + TypeScript
- Vite 8 + @tailwindcss/vite (v4)
- React Router v7
- Framer Motion (page transitions, modal animations)
- Lucide React (icons)
- Anthropic Claude API (live AI Copilot)
- localStorage (auth persistence)

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Landing Page | No |
| `/journey` | Plan Journey | Yes |
| `/strategies` | ABCD Strategy Engine | Yes |
| `/strategy-details` | Comfort Strategy Detail | No |
| `/travel-insights` | Travel Insights | Yes |
| `/leave-later` | Leave Later Simulator | No |
| `/carpool` | Smart Last-Mile & Carpool | No |
| `/copilot` | AI Commute Copilot | No |

## Features

- Full auth modal (Sign In / Create Account) with ESC, click-outside, Enter key
- Avatar profile menu with dropdown after login
- Protected routes open auth modal then redirect
- Page stepper: vertical on desktop (right rail), horizontal on mobile (bottom bar)
- Animated route map with dashed path animation
- Live Claude API chat in AI Copilot page
- Responsive down to 320px
