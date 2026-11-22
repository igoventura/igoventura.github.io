# igoventura.dev

Personal portfolio. Hand-written HTML, CSS and vanilla JS — no framework, no build
step, no dependencies, no tracking.

```
index.html      content — 90% of your edits happen here
styles.css      design tokens, layout, responsive rules
app.js          optional enhancements (nav, scroll-spy, counters, typewriter, copy)
assets/
  favicon.svg   terminal prompt icon
  avatar.svg    "IV" monogram — swap for a real photo whenever you like
```

## Run it

Double-click `index.html`, or serve it:

```powershell
python -m http.server 8000     # then open http://localhost:8000
```

No server is required. `app.js` is loaded as a classic script, not an ES module,
specifically so `file://` keeps working.

## Design

| Token | Value | Where |
|---|---|---|
| `--bg` | `#0b0f10` | `styles.css` → `:root` |
| `--accent` | `#3ddc97` | phosphor green — change this one line to re-theme |
| `--mono` | JetBrains Mono | falls back to system monospace |

Mobile-first. Breakpoints at 640 / 720 / 860 / 980 / 1000px. Motion is fully
disabled under `prefers-reduced-motion: reduce`, and the page is complete with
JavaScript switched off (the `.js` class gates every hiding rule).

## Editing

### Section map

| Section in `index.html` | Anchor |
|---|---|
| Hero (name, role typewriter) | top of `<main>` |
| Stats strip | `.stats-grid` — `data-count` is the target number |
| About + quick facts | `#about` |
| Now | `#now` |
| Projects | `#projects` — duplicate an `<article class="card">` to add one |
| Skills | `#skills` — one `.skill-group` per category |
| Experience + earlier roles + education/certs | `#experience` |
| Contact + social links | `#contact` |

Typewriter roles are the `roles` array at the top of block 6 in `app.js`.

### Amber TODO boxes

Anything with `class="todo"` is unfinished content — it renders as a dashed amber
box labelled `todo` so it cannot slip into production unnoticed. To find them all:

```powershell
Select-String -Path index.html -Pattern 'class="todo'
```

Fill them in, delete the elements, then optionally delete the `.todo` rules from
`styles.css` (section 18) so the styles can't come back.

### Before this goes live

- [ ] Every `class="todo"` element is gone
- [ ] Confirm the GitHub handle — `github.com/igoventura` is a **guess**, the
      LinkedIn URL is the verified one from the CV
- [ ] Your CV lists a mobile number. It is deliberately **not** on the page; if you
      ever add it, expect spam calls
- [ ] Replace the six placeholder project cards with real repos, or delete them.
      Empty project sections are worse than no project section
- [ ] Add the personal sentence in About — it's the part that proves a human
      wrote this
- [ ] Point `cat resume.pdf` and `download full CV` at a real file, or remove both
- [ ] If the employer on the page is current and non-obvious, a quick read of your
      employment agreement's public-posting clause is cheap insurance

## Deploy

Any static host. Pick one:

**Cloudflare Pages / Netlify** — connect the repo, no build command, output
directory `/`. Done.

**GitHub Pages** — put this in `.github/workflows/pages.yml`:

```yaml
name: pages
on:
  push: { branches: [main] }
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.out.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: . }
      - id: out
        uses: actions/deploy-pages@v4
```

**Any host, custom domain** — point `igoventura.dev` at the host, and the
`canonical` / `og:url` tags in `<head>` already match it. Add an SPF/DMARC record
at the registrar if you want mail sent *from* the domain to survive spam filters.

## Notes

- The stats are things countable from the CV (years, companies, certifications,
  spoken languages). Swap in GitHub stars if you link a real account.
- Print styles are included (`Ctrl+P` produces a clean single-column CV-ish document).
- `<html lang="en">`. If you add a Portuguese version, set `lang="pt-BR"` on that
  document and cross-link them with `<link rel="alternate" hreflang>`.
