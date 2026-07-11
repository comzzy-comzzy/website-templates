#!/usr/bin/env node
/**
 * Scans templates/*, reads each folder's meta.json, auto-generates a
 * placeholder thumbnail.svg for any template missing one, and writes
 * the aggregated catalog to data/templates.json.
 *
 * Usage: node scripts/generate-manifest.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "templates");
const OUTPUT_FILE = path.join(ROOT, "data", "templates.json");

const PALETTES = [
  ["#6366f1", "#8b5cf6"],
  ["#0ea5e9", "#22d3ee"],
  ["#f97316", "#f43f5e"],
  ["#10b981", "#84cc16"],
  ["#ec4899", "#f472b6"],
  ["#eab308", "#f97316"],
  ["#14b8a6", "#0ea5e9"],
  ["#8b5cf6", "#ec4899"],
  ["#ef4444", "#f97316"],
  ["#3b82f6", "#6366f1"],
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }[c]));
}

function makeThumbnailSvg(title, category) {
  const [c1, c2] = PALETTES[hashString(category || title) % PALETTES.length];
  const safeTitle = escapeXml(title || "Untitled");
  const safeCategory = escapeXml((category || "").toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="320" fill="url(#g)"/>
  <rect x="24" y="24" width="120" height="14" rx="7" fill="rgba(255,255,255,0.85)"/>
  <text x="24" y="180" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">${safeTitle}</text>
  <text x="24" y="210" font-family="Arial, sans-serif" font-size="14" letter-spacing="2" fill="rgba(255,255,255,0.85)">${safeCategory}</text>
</svg>`;
}

function main() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error(`No templates directory found at ${TEMPLATES_DIR}`);
    process.exit(1);
  }

  const ids = fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const catalog = [];
  let skipped = 0;

  for (const id of ids) {
    const dir = path.join(TEMPLATES_DIR, id);
    const metaPath = path.join(dir, "meta.json");
    const indexPath = path.join(dir, "index.html");

    if (!fs.existsSync(metaPath) || !fs.existsSync(indexPath)) {
      console.warn(`Skipping "${id}": missing meta.json or index.html`);
      skipped++;
      continue;
    }

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (err) {
      console.warn(`Skipping "${id}": invalid meta.json (${err.message})`);
      skipped++;
      continue;
    }

    const thumbPath = path.join(dir, "thumbnail.svg");
    if (!fs.existsSync(thumbPath)) {
      fs.writeFileSync(thumbPath, makeThumbnailSvg(meta.title, meta.category));
    }

    catalog.push({
      id,
      title: meta.title || id,
      category: meta.category || "Uncategorized",
      description: meta.description || "",
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      thumbnail: `templates/${id}/thumbnail.svg`,
      path: `templates/${id}/index.html`,
    });
  }

  catalog.sort((a, b) => a.title.localeCompare(b.title));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2) + "\n");

  console.log(`Wrote ${catalog.length} template(s) to ${path.relative(ROOT, OUTPUT_FILE)}`);
  if (skipped) console.log(`Skipped ${skipped} folder(s) due to missing/invalid files.`);
}

main();
