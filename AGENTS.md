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
- Find unfinished content with `Select-String -Path index.html -Pattern 'class="todo'`.
  Each `.todo` renders as a visible amber box and must not ship.
- While any `.todo` is open, an `under construction` strip sits under the header:
  the `.construction` block in `index.html`, its rules in `styles.css` §18, and the
  `.construction` entry in the §24 print block. Remove all three with the last `.todo`.

## Hard constraints

- `app.js` is a **classic script with `defer`**, not an ES module — this is
  deliberate so `file://` works. No `type="module"`, no imports, no `fetch`, no
  syntax requiring transpilation.
- The inline `<script>` in `<head>` adds `html.js` and must stay there, before
  `styles.css`. All reveal-hiding CSS is scoped under `.js`; the page must remain
  complete and readable without that class.
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
| `index.html` | All content and markup; most edits happen here (515 lines) |
| `styles.css` | Numbered sections 1–24: tokens in `:root` (section 1), then reset → components → reduced motion → print |
| `app.js` | Numbered IIFEs 1–9: toast, nav, scroll-spy, reveal, counters, typewriter, copy, back-to-top, footer year |
| `assets/` | `favicon.svg`, `avatar.svg` (also referenced as `og:image`) |

- Re-theme by changing `--accent` in `styles.css: :root`. Other tokens (`--bg`,
  `--mono`, `--maxw`, `--nav-h`) live there too.
- Add a project by duplicating an `<article class="card">` inside `#projects`;
  add a skill category by duplicating a `.skill-group` inside `#skills`.
- Typewriter roles are the `roles` array in `app.js` block 6.
- Stats: `data-count` drives the animation, but the visible text is the real
  fallback — change both together. `data-format="k"` renders e.g. `1.2k`.
- Scroll-spy is derived from `.nav-menu a[href^="#"]`; a nav link only works if
  its target section exists and has the matching `id`.

## Content accuracy

- Never invent biographical facts, employers, dates, metrics, or project links.
  The seven `.todo` boxes mark exactly where real content is missing — ask rather
  than fabricate.
- `README.md` is the content/deploy guide but drifts from the code: it says 8
  TODO boxes (actual: 7) and still tells you to remove the Nimbus mention, which
  now survives only as an HTML comment about the external GitHub profile. Trust
  `grep` and the files over README prose.
- The `styles.css` header comment ("Alex Mercer") is leftover template text;
  ignore it when looking for ownership or naming.
