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
| `--bg` | `#181926` | `styles.css` → `:root` (Catppuccin Macchiato "Crust") |
| `--accent` | `#8aadf4` | Catppuccin Blue — change this one line to re-theme |
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

### Placeholder copy

There are no `.todo` markers left. The `under construction` strip above the page
is still there on purpose — the experience entries are missing the numbers that
would make them worth reading. When that copy is final, delete the `.construction`
block in `index.html` together with its rules in `styles.css` (section 18) and the
`.construction` entry in the print block (section 24).

### Before this goes live

- [x] No placeholder copy left — every `.todo` box is gone
- [ ] Under-construction strip removed once the experience numbers are written
      (see "Placeholder copy" above for the three pieces to delete)
- [x] GitHub handle confirmed against the API — `github.com/igoventura`, 31 public repos
- [x] Your CV's mobile number is **not** on the page. If you ever add it, expect spam calls
- [x] Project cards are six real public repositories, not placeholders
- [x] About ends with the personal line (cooking, dancing, videogames)
- [ ] Experience entries stop at scope: no metrics were invented. Add real numbers
      per role when you have them (latency, cost, incidents avoided, fleet scale,
      team size)
- [ ] Both CV download links were removed because they pointed at `#`. To bring one
      back, drop `resume.pdf` in the repo root and re-add the anchor
- [ ] Your GitHub profile still advertises an employer you left (`company` says
      `@nimbusitconsult`, bio says ".NET Developer at ESX & Founder at Nimbus IT
      Consult"). The page omits it; fix the profile separately
- [ ] `hireable: true` is set on GitHub while this page says "coffee chats". Pick one
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
