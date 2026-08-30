# LearnPath AI

AI-powered personalized learning path finder built with React, Node.js/Express, MongoDB, and OpenRouter.

## Features in this MVP

- Register/login with JWT
- Learner profile and learning goal
- OpenRouter-powered skill-gap analysis
- OpenRouter-powered personalized learning path generation
- Course/resource/project recommendations
- Milestones and prerequisites
- Roadmap progress tracking
- Task completion
- AI learning assistant
- Progress/risk analysis
- Basic adaptive rescheduling proposal
- Dashboard

## Architecture

React/Vite -> Express API -> OpenRouter + MongoDB

The OpenRouter key is server-side only.

## Setup

### 1. Server

```bash
cd server
npm install
copy .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
OPENROUTER_API_KEY=your_gemini_api_key
OPENROUTER_MODEL=gemini-3.7-flash
CLIENT_URL=http://localhost:5173
```

Then:

```bash
npm run dev
```

### 2. Client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

## Important

Do not commit `.env`.

If a OpenRouter API key or MongoDB password has been shared publicly or in a document, rotate it before using the project.

## Main API

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/profile
- POST /api/goals
- GET /api/goals
- POST /api/ai/generate-path
- POST /api/ai/chat
- POST /api/ai/analyze-progress
- POST /api/ai/reschedule
- GET /api/roadmaps
- GET /api/roadmaps/:id
- PATCH /api/tasks/:id

## Next improvements

- Real course/resource search integrations
- Streaming chat
- More granular skill graph
- Calendar integration
- Email reminders
- Production deployment
- Automated tests
