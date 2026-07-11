# website-templates

A browsable catalog of full website templates. Users search/filter the gallery
and open a template to preview or use it. Built with plain HTML/CSS/JS and a
small Node script — no build step, no framework, and it's designed to scale
from a handful of templates up to ~1,000.

## Running locally

Serve the folder over HTTP (the picker fetches `data/templates.json`, which
`fetch()` can't read from a `file://` URL):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## How it's organized

```
index.html              picker gallery (search, category filter, sort, pagination)
assets/css/style.css    picker UI styles
assets/js/app.js        picker UI logic (fetches data/templates.json)
data/templates.json     generated catalog — do not hand-edit, regenerate it (see below)
downloads/<id>.zip      generated per-template ZIP archives (the "Download ZIP" button)
templates/<id>/         one folder per template
  meta.json               title, category, description, tags
  index.html              the actual template, self-contained
  style.css               the template's styles
  thumbnail.svg           card thumbnail (auto-generated if missing)
scripts/generate-manifest.js   scans templates/, writes data/templates.json + downloads/*.zip
```

Each template card offers **Preview** (opens the live template) and **Download
ZIP** (a ready-to-use archive of the template's files that anyone can unzip,
edit, and host anywhere).

## Adding a new template

Scaling to hundreds or thousands of templates is just repeating this:

1. Create `templates/<your-template-id>/`.
2. Add `meta.json`:
   ```json
   {
     "title": "Your Template Name",
     "category": "Portfolio",
     "description": "One sentence describing the template.",
     "tags": ["tag1", "tag2"]
   }
   ```
3. Add a self-contained `index.html` (+ `style.css`, images, etc.) — this is
   the real site a user gets when they pick the template.
4. (Optional) Add `thumbnail.svg`/`.png` yourself, or leave it out — the
   generator script auto-creates a placeholder thumbnail from the title and
   category.
5. Regenerate the catalog:
   ```bash
   node scripts/generate-manifest.js
   ```

The picker UI reads only `data/templates.json`, so it never needs to change
as templates are added — it already handles search, filtering by category,
sorting, and pagination for any number of entries. The generator also
rebuilds each template's ZIP in `downloads/` (requires `python3`, used only
at build time).

## Notes

- `data/templates.json` and `downloads/*.zip` are generated — re-run the
  script after adding, removing, or editing template folders instead of
  editing them by hand.
- Folders in `templates/` missing `meta.json` or `index.html` are skipped
  (with a warning) by the generator, so partially-added templates won't break
  the catalog.
