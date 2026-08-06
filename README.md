# Miraego

AI trip planner. You give a destination, budget, style, and interests — it returns a structured day-by-day itinerary with budget breakdown, tips, and flight suggestions.

**Stack:** React + Vite frontend · Express backend · Clerk auth · Gemini (primary LLM) · Groq / OpenRouter (secondary) · MongoDB (connected; trips stored client-side for now)

```
├── frontend/   React 19 · Vite · Tailwind · React Router · Clerk
└── backend/    Express · Gemini / Groq / OpenRouter · schema validation · local fallback
```

---

## Setup

### Prerequisites

- Node.js 20+
- A [Clerk](https://clerk.com) publishable key
- A [Gemini](https://aistudio.google.com/apikey) API key (recommended)
- Optional: Groq or OpenRouter key for secondary LLM
- MongoDB Atlas URI (required at startup — see [Known limitations](#known-limitations))

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in at least:

| Variable | Required | Notes |
|----------|----------|--------|
| `MONGODB_URI` | Yes | Server exits if connection fails |
| `GEMINI_API_KEY` | Recommended | Primary itinerary model |
| `GROQ_API_KEY` or `OPENROUTER_API_KEY` | No | Secondary tier if Gemini fails |
| `PORT` | No | Defaults to `5001` |

```bash
npm run dev
```

Health check: `GET http://localhost:5001/api/health`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

App: http://localhost:5173  
Vite proxies `/api` → `http://localhost:5001`.

Sign in via Clerk, open the planner, generate a trip.

---

## AI usage

**What AI does**

- **One product feature:** `POST /api/trip` generates a full itinerary as structured JSON.
- Primary model: **Gemini** (`GEMINI_MODEL`, default `gemini-2.5-flash`) with JSON response mime type.
- If Gemini fails or is unset: **Groq** (preferred) or **OpenRouter**, same prompt + schema contract.
- Prompts live in `backend/src/prompts/tripPrompt.js`. Output is parsed, enriched, and validated against `backend/src/schemas/tripResponse.schema.js` before it reaches the client.

**What AI does not do**

- No streaming — the UI loader is progress UX, not token streaming.
- No image generation — Explore uses static Unsplash URLs.
- No server-side trip memory — saved trips and generation history live in `localStorage`.
- Flight rows are model suggestions (or deterministic placeholders on local fallback), not live GDS / airline APIs.
- Clerk gates the UI only; the trip API itself is not authenticated.

**AI-assisted development**

Cursor / AI tooling was used for scaffolding, iteration, and docs. Architecture choices (cascade, schema validation, local fallback, error sanitization) and product behavior were designed and verified in this codebase — not pasted as a single opaque demo.

---

## Failure handling

Most LLM demos stop at “call the API and hope.” Miraego treats generation as an unreliable dependency.

1. **Request validation** — Bad bodies fail fast with clear 400s (`tripRequest.schema.js`).
2. **Per-provider retry** — Each LLM tier retries once with exponential backoff + jitter (`LLM_RETRIES`, `LLM_BACKOFF_*`). Timeouts, 429s, 5xx, and parse/schema errors are retryable; auth/validation errors are not.
3. **Cascade** — Gemini → Groq/OpenRouter → **local deterministic generator**. The local path always produces schema-valid JSON so the product still returns a usable trip when providers are down or keys are missing.
4. **Strict output contract** — Markdown fences and prose are stripped (`jsonParser.js`); responses that don’t match the schema trigger retry / next tier instead of leaking half-parsed JSON to the UI.
5. **Safe errors** — `errorHandler.js` maps failures to public codes and copy (`userMessages.js`). Provider names and raw upstream payloads stay in server logs.
6. **Frontend** — Trip requests use a long timeout, one fetch retry, `AbortController` for superseded requests, retryable error UI (`ErrorState` / `InlineError`), and generation history that records successes and failures.

If every tier including local generation fails, the API returns **503** `TRIP_UNAVAILABLE`. In normal operation, cascade + local fallback means users still get a trip.

---

## Known limitations

- **MongoDB is required but unused for trip data** — connected at boot; no trip models. Persistence is browser `localStorage` (`gilora-saved-trips`, history, collections, settings). Share links won’t work across devices.
- **No backend auth on `/api/trip`** — anyone who can reach the API can generate.
- **Days capped at 21** on the API even when the form allows more; travel style / interest enums are mapped from richer UI options and can lose nuance.
- **Accommodation / transport preferences** are appended into the free-text prompt only — not first-class API fields.
- **Interactive map** is a stub (“coming soon”).
- **Pricing page** is marketing only — no billing.
- **Settings** (theme, currency prefs, etc.) are local; currency for generation follows the request payload, not a full preferences pipeline.
- **Brand naming** — product UI is **Miraego**; some packages, prompts, and storage keys still say **Gilora**.
- **Mobile** — dashboard is responsive (mobile nav, planner via modal); complex trip layouts are denser on small screens.

---

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm run dev` | API with nodemon |
| `backend/` | `npm start` | API without nodemon |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run lint` | oxlint |
