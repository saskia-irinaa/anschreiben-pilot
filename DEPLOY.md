# Deploying Anschreiben Pilot to Render

This repo is a Wasp app (`main.wasp` names it `CoverLetterGPT`, branded as
"Anschreiben Pilot"). Wasp's own one-command deploy targets are Fly.io and Railway,
but Saskia already runs `batch-video-creator` and `sofia-and-sea-video` on Render, so
this doc uses Render instead.

Three files are prepared in this repo root for that:

- `Dockerfile` - the exact, unedited output of `wasp dockerfile` (Wasp 0.15.0). Builds
  the Node/Prisma server.
- `render.yaml` - a Render Blueprint: server (Docker), client (static site), and a
  managed Postgres database, wired together.
- This file.

**Fixed 2026-09-23.** The `Dockerfile` now builds `.wasp/build` itself, inside Docker,
as its own first stage — Render (or anyone) can build straight from the repo as pushed,
no pre-build step needed. What changed and how it was checked, for the record:

`wasp dockerfile` originally printed the Dockerfile that `wasp build` writes to
`.wasp/build/Dockerfile`, meant to be built with `.wasp/build` itself as the context
(that's where `wasp build` also puts `server/`, `sdk/`, `db/`, and copies of `src/`).
`.wasp/` is gitignored and doesn't exist in the repo as pushed — so a plain Render
Blueprint build would have failed immediately at `COPY server .wasp/build/server`.

The fix: a new first stage (`wasp-build`) in `Dockerfile` installs Wasp 0.15.0 (pinned
to match `main.wasp`'s `wasp: { version: "^0.15.0" }` — if that version ever changes,
this stage needs to change with it) and runs `wasp build` itself, producing
`.wasp/build/` and `.wasp/out/sdk` inside the image build. The rest of the file is
Wasp's own generated Dockerfile, unedited except that every `COPY` now pulls from that
`wasp-build` stage (`COPY --from=wasp-build ...`) instead of expecting the paths to
already exist in the build context.

**Verified without a live `docker build`** (no Docker available in this environment):
ran `wasp build` locally with the pinned CLI and confirmed every path the new stage
copies from — `.wasp/build/server`, `.wasp/build/db/schema.prisma`, `.wasp/out/sdk`,
`src/`, `package.json`, `package-lock.json` — actually exists after a real build, byte
for byte where it mattered (`.wasp/out/sdk` and `.wasp/build/sdk` diffed identical).
**Still not verified: an actual `docker build` run.** The Dockerfile mechanics
(multi-stage, `COPY --from`) are standard and the paths are confirmed real, but nobody
has watched this specific build finish end to end. Do that once, watching the logs,
before trusting it for a real deploy.

## Step by step

1. **This is already on GitHub and merged to `main`** (`saskia-irinaa/anschreiben-pilot`).
2. **In Render: New > Blueprint.** Connect the GitHub repo, branch `main`. Render reads
   `render.yaml` and proposes: a Postgres
   database (`anschreiben-pilot-db`), a web service (`anschreiben-pilot-server`), and
   a static site (`anschreiben-pilot-client`).
3. **Fill in the server's env vars** (all marked `sync: false` in `render.yaml`, so
   Render will prompt for them and never store real values in the file):

   | Var | Where to get it |
   |---|---|
   | `OPENAI_API_KEY` | https://platform.openai.com/api-keys - create a new key for this app specifically, don't reuse another project's key (per her "never cross-charge" rule). |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console > APIs & Services > Credentials > OAuth client ID (type: Web application). Add the deployed server's callback URL (`https://<server-domain>/auth/google/callback` - confirm exact path against Wasp's Google auth docs) to "Authorized redirect URIs" once the server's Render URL or custom domain is known. |
   | `SENDGRID_API_KEY` | https://app.sendgrid.com/settings/api_keys. Note `main.wasp` currently sends from `noreply@anschreibenpilot.de`, which is marked in the code as a placeholder - she needs a domain she actually controls with SendGrid sender verification set up before this can send real mail. |
   | `STRIPE_KEY` | https://dashboard.stripe.com/apikeys (use the **live** secret key only when ready for real payments; use a **test** key until then). |
   | `PRODUCT_PRICE_ID` / `PRODUCT_CREDITS_PRICE_ID` | **Stop - these still hold the original coverlettergpt template author's Stripe product/price IDs.** PROJECT.json flags this explicitly: "still uses vince's original US Stripe product IDs and USD pricing." Real payments will charge against someone else's Stripe products until Saskia creates her own Products/Prices in her own Stripe dashboard (in EUR, DACH pricing) and swaps these IDs. Do not go live on Stripe before this is fixed. |
   | `WASP_WEB_CLIENT_URL` | The client static site's Render URL (or custom domain), once Render assigns it. |
   | `WASP_SERVER_URL` | The server web service's own Render URL (or custom domain). |

   `DATABASE_URL` is wired automatically from the Blueprint's Postgres database - don't
   set it by hand.

4. **Fill in the client's env var**: `REACT_APP_API_URL` = the server's public URL
   (same value as `WASP_SERVER_URL` above). This is baked into the static bundle at
   build time, so changing it later means a rebuild, not just an env var flip.
5. **Run the Prisma migrations against the Render Postgres database** the first time
   (the server's Docker image runs migrations as part of `start-production`, per the
   generated Dockerfile's `ENTRYPOINT`, but confirm this actually fires against a real
   Postgres instance - PROJECT.json notes "No live Postgres tested yet"). Watch the
   first deploy's logs for migration errors before assuming it worked.
6. **Custom domain.** PROJECT.json says the domain name itself is still undecided
   (`anschreibenpilot.de`/`.com` are free and reserved as the working choice, but
   Saskia wanted something more creative and hasn't registered anything). Once she
   picks and registers one:
   - In Render, add the custom domain to the **client** static site (that's what
     visitors hit) and add a second custom domain or subdomain (e.g. `api.<domain>`)
     to the **server** web service.
   - Point the domain's DNS at Render per Render's own custom-domain instructions
     (a CNAME to the Render-provided hostname, or Render's "Add A/AAAA record"
     option for an apex domain).
   - Update `WASP_WEB_CLIENT_URL`, `WASP_SERVER_URL`, and `REACT_APP_API_URL` to the
     real domain, and update the Google OAuth redirect URI to match.
   - Update `main.wasp`'s hardcoded `og:url` / `og:image` meta tags (currently
     `https://anschreibenpilot.de`) if the final domain differs.

## What's still open after this (from PROJECT.json)

- Stripe product IDs are the template author's, not Saskia's (see table above).
- No live Postgres has been exercised end-to-end yet - first real deploy is also the
  first real test of the migrations.
- Privacy policy needs real GDPR legal review before handling real user data - this
  app will hold German/EU users' personal data on a US-based host (Render).
- SendGrid sender domain is a placeholder.
- Several client pages are still untranslated to German (JobsPage, CheckoutPage,
  CoverLetterPage, legal pages).
