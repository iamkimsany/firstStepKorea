# FirstStep Korea 🇰🇷

> 헤이영 for international students

AI agent that guides international students through their first weeks in Korea.

## Setup

1. Clone repo
2. `npm install`
3. Add `OPENAI_API_KEY` to `.env.local` (see `.env.example`)
4. `npm run dev`

Optional: set `OPENAI_MODEL` to a vision-capable model (defaults to `gpt-4o`).

## Features

- Personalized onboarding by visa type
- University-specific checklists
- AI chat in any language
- Korean document photo analysis

## Tech Stack

Next.js 14, TypeScript, Tailwind, OpenAI API

## Deploy (Vercel)

Set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) in project Environment Variables.
