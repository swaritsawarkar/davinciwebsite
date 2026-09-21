# DaVinci 027

NRL team website with a strategy field-notes page at `/season-plan`.

## Run

Node 22 or newer. Run `npm ci`, then `npm run dev`.
For production: `npm run build` and `npm start`.

## Deploy to Vercel

Import this repository, select Next.js, and use the repository root. No environment variables are needed.

## Content and motion

Original Funnel Display and Geist Mono fonts, palette, crew assets and hero scenes retained. The same variable fonts are bundled locally with their OFL licenses so builds do not depend on Google Fonts downloads. The home page includes a large animated blog doorway. Field notes cover shared-kit core cycles, proposed alliance task allocation and separate lift/grab servos. An interactive core-run walkthrough steps through placement, driver calls and proposed partner responsibilities. It is labelled as a concept, not an arena map or a live score. The four-core Starburst gate is explicitly pending rule verification; the two-core grabber remains an experiment.

Mouse cursor feedback is enabled for fine pointers, with a native cursor fallback. Reduced-motion preferences suppress animation. The homepage also retains its motion toggle.

## Checks

`npm run typecheck`

`node tests/hero-regression.cjs`
