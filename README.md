# Anschreiben Pilot

AI-Anschreiben-Generator für den deutschsprachigen Markt (DACH), forked von
[vincanger/coverlettergpt](https://github.com/vincanger/coverlettergpt) (GPL-3.0).

Full spec and market research: `brain/projects/micro-saas-dach-spec-cover-letter-cv.md` and
`brain/projects/micro-saas-dach.md` in the wider workspace.

## Running it locally

After cloning this repo, you can run it locally by following these steps:

1. Install [Wasp](https://wasp.sh) — `npm install -g @wasp.sh/wasp-cli` (this project pins
   `wasp: "^0.15.0"` in `main.wasp`; the CLI has since moved to v0.25+, so check
   `wasp/docs/guides/legacy` if you hit a version mismatch).
2. Create a `.env.server` file in the root of the project
3. Copy the `env.server.example` file contents to `.env.server` and fill in your own API keys
   — not vince's, not anyone else's
4. Make sure you have a Database connected and running. Two options:
   - run `wasp start db` from the project root (needs Docker running locally)
   - or provision a Postgres database (e.g. on Render, which the rest of this workspace
     already uses) and paste the connection string as `DATABASE_URL` in `.env.server`
5. Run `wasp db migrate-dev`
6. Run `wasp start`
7. Go to `localhost:3000` in your browser (the Node server runs on port `3001`)

## What's different from the original coverlettergpt

- **German-first.** The cover-letter prompt (`src/server/actions.ts`) explicitly follows
  DIN 5008 German business-letter conventions when the job description is in German —
  formal Anrede/Grußformel, a Betreff line, Sie-register, no joke at the end. See the
  `DIN_5008_INSTRUCTIONS` constant.
- **No Bitcoin Lightning.** The original had a Lightning/Bolt11 sign-in and pay-per-use
  path tied to the original author's personal Alby wallet — irrelevant to this product's
  audience and removed entirely (auth, payment, and the `LnData`/`LnPayment` models).
- **UI translated to German** across the main flow (nav, the cover-letter form, login,
  profile, the inline-edit popover, and the dialogs).

## How it works (from the original author, still accurate for the parts that are unchanged)

- 🐝 [Wasp](https://wasp.sh) — full-stack framework: describe features in `main.wasp`, it
  glues together a React/Express/Prisma app
- 🎨 [Chakra UI](https://chakra-ui.com/) — the component library
- 🤖 [OpenAI](https://openai.com/) — GPT-4o / GPT-4o-mini for generation
- 💸 [Stripe](https://stripe.com/) — payments (still wired to the original author's Stripe
  product IDs — needs to be pointed at Saskia's own Stripe account before any real launch)

For the prompts and generation logic, see `src/server/actions.ts`. For the data model, see
`schema.prisma`.
