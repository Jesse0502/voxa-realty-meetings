# VoxaRealty — Client

React/Vite dashboard + marketing site for VoxaRealty: lets real estate
agents configure their AI phone receptionist, review calls, and manage
contacts. Talks to the FastAPI backend in the companion repo,
**voxa_server** (`VITE_SERVER_URL`).

## 1. Prerequisites

- Node.js (any recent LTS — no `engines` constraint is pinned in
  `package.json`)
- A package manager — see the note below before picking one
- The Server repo running locally (or a deployed URL to point at)

**Package manager note**: this repo has four lockfiles committed
(`pnpm-lock.yaml`, `bun.lock`, `bun.lockb`, `package-lock.json`) from
switching tools over time. `pnpm-lock.yaml` is the most recently updated,
so **use pnpm** unless told otherwise. Don't run install with a different
package manager without regenerating just that one lockfile — mixing them
causes drift.

## 2. Setup

```bash
cd Client
pnpm install
cp .env.example .env        # then fill in real values, see section 3
pnpm dev                    # starts Vite on http://localhost:8080
```

Other scripts: `pnpm build` (production build to `dist/`), `pnpm preview`
(preview the build), `pnpm test` / `pnpm test:watch` (Vitest), `pnpm lint`.

`server.js` + `pnpm start` is a minimal static file server (Node's
built-in `http`, no framework) for serving the built `dist/` in
production with SPA fallback routing — not used in local dev.

## 3. Environment variables

Copy `.env.example` to `.env`. All variables are prefixed `VITE_` and get
inlined into the client bundle at build time by Vite — none of these are
secrets, they're just environment-specific config (a Google OAuth client ID
is meant to be public; Stripe *Payment Link* URLs are public checkout
pages, not API keys).

| Variable | Used for |
|---|---|
| `VITE_SERVER_URL` | Base URL of the FastAPI backend. `http://localhost:8000` for local dev against a locally-running Server. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for the Sheets/Calendar "Connect" flows (`@react-oauth/google`). Must be from the same Google Cloud project as the server's `GOOGLE_CLIENT_ID`, with `http://localhost:8080` added to Authorized JavaScript origins for local dev. |
| `VITE_STARTER_PAYMENT_LINK`, `VITE_GROWTH_PAYMENT_LINK`, `VITE_PRO_PAYMENT_LINK`, `VITE_EARLY_ACCESS_PAYMENT_LINK` | Stripe Payment Link URLs per subscription tier, used on the pricing/onboarding pages. |
| `VITE_BASIC_PAYMENT_LINK` | Referenced in `src/pages/OnboardingPage.tsx` but **missing from the live `.env`** — falls back to an empty string (`?? ""`) rather than crashing. Add it if a "basic" tier payment link exists. |

I left the real `Client/.env` untouched — `.env.example` is a new file with
placeholder values for onboarding, not a copy of production config.

## 4. Architecture

```
src/
  main.tsx              — entry point: Redux Provider + GoogleOAuthProvider
  App.tsx                — BrowserRouter + all top-level routes
  pages/
    LandingPage, BestAiReceptionistPage, VoiceLibraryPage, ...  — marketing/SEO pages
    OnboardingPage.tsx     — signup + plan selection (Stripe Payment Links)
    login/Index.tsx         — login
    dashboard/Index.tsx      — authenticated shell: sidebar/nav + section switch
  components/
    CallsSection.tsx         — call list, detail sheet, recording playback
    AssistantSection.tsx      — prompt/first-line config, knowledge bases
                                (Google Sheets connector, Property Listings)
    ContactsSection.tsx        — contacts CRUD + per-contact call history
    ProfileSection.tsx          — account/subscription management
    ui/                          — shadcn/ui primitives (Radix-based)
  store/                    — Redux Toolkit slices: auth, assistant, calls,
                              contacts, profile — each owns its own
                              createAsyncThunk calls against the Server API
  hooks/
    use-call-recording.ts     — fetches a fresh signed recording URL per
                                call (VAPI recording URLs are short-lived
                                and require server-side auth, so this can't
                                just read a stored URL — see below)
```

### Auth & data loading

JWT stored in Redux (`authSlice`) after login/onboarding, sent as
`Authorization: Bearer <token>` on every subsequent request. `GET /auth/me`
(`fetchCurrentUser`) is the main bootstrap call on dashboard load — it
returns the user, their assistant config, calls, stats, and contacts in one
response; `dashboard/Index.tsx` fires it and fans the result out into the
various slices.

### Call recordings

VAPI recently locked down recording URLs behind their own API-key auth, so
the dashboard can't just play `call.recordingUrl` directly anymore. Instead,
selecting a call triggers `useCallRecordingUrl` (`hooks/use-call-recording.ts`),
which calls `GET /calls/{id}/recording-url` on the Server (authenticated
with our own JWT), which in turn calls VAPI server-side and returns a
fresh, short-lived signed URL for the `<audio>` element to load.

### Assistant configuration / knowledge bases

`AssistantSection.tsx` edits `Assistant.prompt`/`firstMessage` directly, plus
a `knowledge_bases` array — an open-ended list of `{ type, ... }` entries
rather than fixed fields, mirrored by the same loose shape on the backend.
Today that's used for two source types: `google_sheets` (match callers by
phone number, pull row data into the prompt) and `property_listings` (a
listings-site URL; the server scrapes it and caches the result — on save,
and periodically in the background via a scheduled job — and calls just
read that cache, never scraping live). Because saving knowledge bases
replaces the whole array server-side, the component always merges by
`type` before saving (`upsertKnowledgeBase`/`removeKnowledgeBaseType`) so
configuring one source never wipes out another.
