# AGENTS.md

Hand-written static portfolio for igoventura.dev: HTML + CSS + vanilla JS, no
framework, no build step, no package manager, no tests. Deployed by GitHub Pages
on every push to `main`.

## Verify

- Nothing to install, build, lint, or typecheck. Do not introduce Node, a bundler,
  or a test runner unless explicitly asked.
- Preview: open `index.html` directly, or `python -m http.server 8000`.
- Manual check before committing: page works with JS disabled, at ~360px and
  desktop widths, with `prefers-reduced-motion: reduce`, and in print preview.
- No `.todo` markers left. The `under construction` strip stays on purpose while
  the experience numbers are missing: the `.construction` block in `index.html`,
  its rules in `styles.css` §18, and the `.construction` entry in the §25 print
  block. Remove all three when the copy is final.
- Don't reintroduce placeholder copy, and don't invent facts to fill a gap.

## Hard constraints

- `app.js` is a **classic script with `defer`**, not an ES module — this is
  deliberate so `file://` works. No `type="module"`, no imports, no `fetch`, no
  syntax requiring transpilation.
- The inline `<script>` in `<head>` sets the env flags — `html.js`, plus
  `html.local` / `html.remote` from `location` — and must stay there, before
  `styles.css`. All reveal-hiding CSS is scoped under `.js`; the page must remain
  complete and readable without those classes. Hiding is always opt-in via a
  class the script adds, never via `:not()`, so a JS-off visitor sees everything.
- Every block in `app.js` is optional and null-guarded. Keep new behavior
  progressive: bail out cleanly when its DOM node is absent, and respect
  `prefers-reduced-motion` (see `reduced()` at the top).
- `.gitattributes` enforces LF (`* text=auto eol=lf`). On this Windows checkout,
  avoid committing CRLF or whole-file line-ending rewrites.
- Pushing to `main` publishes the entire repo root (`.github/workflows/pages.yml`
  uploads `path: .`) — there is no staging or build filter. Anything committed is
  public; use `*.local` / `notes/` (already gitignored) for WIP.
- The Google Fonts link is intentional; the system-mono fallback keeps the page
  usable offline and over `file://`. Don't "fix" it by vendoring assets unasked.
- Keep `canonical` / `og:url` (`https://igoventura.dev/`) in sync if the domain
  changes. No analytics or trackers — the README advertises "no tracking".

## Layout

| File | Role |
|---|---|
| `index.html` | All content and markup; most edits happen here (533 lines) |
| `styles.css` | Numbered sections 1–25: tokens in `:root` (section 1), then reset → components → env flag → reduced motion → print |
| `app.js` | Numbered IIFEs 1–9: toast, nav, scroll-spy, reveal, counters, typewriter, copy, back-to-top, footer year |
| `assets/` | `favicon.svg`, `avatar.svg` (also referenced as `og:image`) |

- Re-theme by changing `--accent` in `styles.css: :root`. Other tokens (`--bg`,
  `--mono`, `--maxw`, `--nav-h`) live there too.
- Add a project by duplicating an `<article class="card">` inside `#projects`;
  add a skill category by duplicating a `.skill-group` inside `#skills`.
- Keep a block out of the deployed site by tagging it `data-local-only`: the
  env flag in `<head>` hides those nodes under `html.remote` (see `styles.css`
  §23). Tag the section, its `<li>` in `.nav-menu` and any button that points at
  it, or the nav entry and hero CTA scroll to nothing. `#projects` is tagged
  this way until its copy is signed off — drop the three attributes to publish.
  `?local=1` / `?local=0` override the address check. This is presentation
  only: the markup is still served, so anything genuinely private has to stay
  out of the repo entirely.
- Typewriter roles are the `roles` array in `app.js` block 6.
- Stats: `data-count` drives the animation, but the visible text is the real
  fallback — change both together. `data-format="k"` renders e.g. `1.2k`.
- Scroll-spy is derived from `.nav-menu a[href^="#"]`; a nav link only works if
  its target section exists and has the matching `id`.

## Content accuracy

- Never invent biographical facts, employers, dates, metrics, or project links.
  The experience entries stop at scope on purpose: the numbers only Igo has were
  left out rather than guessed. Ask rather than fabricate.
- `README.md` is the content/deploy guide and can drift from the code; trust
  `grep` and the files over its prose.
- The `styles.css` header comment ("Alex Mercer") is leftover template text;
  ignore it when looking for ownership or naming.
