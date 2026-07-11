#!/usr/bin/env node
/**
 * Figma-to-HTML/CSS Template Importer
 * 
 * Fetches a design file via the Figma REST API, parses frames and layout trees,
 * converts Figma Auto Layout configuration to modern CSS Flexbox, and outputs
 * structured templates to the templates/ directory.
 * 
 * Usage:
 *   export FIGMA_TOKEN="your_figma_personal_access_token"
 *   node scripts/figma-to-html.js <figma_file_key>
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "templates");

// Colors mapper
function parseFigmaColor(color, opacity = 1) {
  if (!color) return "transparent";
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = opacity !== undefined ? opacity : (color.a !== undefined ? color.a : 1);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Extract background styling
function getBackgroundStyle(node) {
  if (!node.fills || node.fills.length === 0) return "background: transparent;";
  const solidFill = node.fills.find(f => f.type === "SOLID" && f.visible !== false);
  if (solidFill) {
    return `background-color: ${parseFigmaColor(solidFill.color, solidFill.opacity)};`;
  }
  const gradientFill = node.fills.find(f => f.type.startsWith("GRADIENT") && f.visible !== false);
  if (gradientFill) {
    // Basic gradient fallback
    return `background: linear-gradient(135deg, var(--accent), var(--accent2));`;
  }
  return "";
}

// Convert Auto Layout config to Flexbox CSS
function getLayoutStyles(node) {
  let css = "";
  if (node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL") {
    css += `  display: flex;\n`;
    css += `  flex-direction: ${node.layoutMode === "HORIZONTAL" ? "row" : "column"};\n`;
    
    // Spacing (gap)
    if (node.itemSpacing !== undefined) {
      css += `  gap: ${node.itemSpacing}px;\n`;
    }
    
    // Alignment mapping
    if (node.primaryAxisAlignItems) {
      const align = {
        "MIN": "flex-start",
        "CENTER": "center",
        "MAX": "flex-end",
        "SPACE_BETWEEN": "space-between"
      }[node.primaryAxisAlignItems] || "flex-start";
      css += `  justify-content: ${align};\n`;
    }
    if (node.counterAxisAlignItems) {
      const align = {
        "MIN": "flex-start",
        "CENTER": "center",
        "MAX": "flex-end"
      }[node.counterAxisAlignItems] || "stretch";
      css += `  align-items: ${align};\n`;
    }
  } else {
    css += `  position: relative;\n`;
  }

  // Padding
  const pt = node.paddingTop || 0;
  const pr = node.paddingRight || 0;
  const pb = node.paddingBottom || 0;
  const pl = node.paddingLeft || 0;
  if (pt || pr || pb || pl) {
    css += `  padding: ${pt}px ${pr}px ${pb}px ${pl}px;\n`;
  }

  // Sizing
  if (node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox;
    if (node.layoutGrow === 1) {
      css += `  flex-grow: 1;\n`;
    } else {
      if (width && !node.layoutMode) css += `  width: ${Math.round(width)}px;\n`;
      if (height && !node.layoutMode) css += `  height: ${Math.round(height)}px;\n`;
    }
  }

  // Corners
  if (node.cornerRadius) {
    css += `  border-radius: ${node.cornerRadius}px;\n`;
  }

  // Strokes (Border)
  if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
    const solidStroke = node.strokes.find(s => s.type === "SOLID");
    if (solidStroke) {
      css += `  border: ${node.strokeWeight}px solid ${parseFigmaColor(solidStroke.color, solidStroke.opacity)};\n`;
    }
  }

  return css;
}

// Map text properties
function getTextStyles(node) {
  let css = "";
  if (!node.style) return css;

  const s = node.style;
  if (s.fontFamily) css += `  font-family: "${s.fontFamily}", sans-serif;\n`;
  if (s.fontSize) css += `  font-size: ${s.fontSize}px;\n`;
  if (s.fontWeight) css += `  font-weight: ${s.fontWeight};\n`;
  if (s.lineHeightPx) css += `  line-height: ${Math.round(s.lineHeightPx) / (s.fontSize || 16)};\n`;
  if (s.textAlignHorizontal) {
    css += `  text-align: ${s.textAlignHorizontal.toLowerCase()};\n`;
  }

  // Text color
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills.find(f => f.type === "SOLID");
    if (fill) {
      css += `  color: ${parseFigmaColor(fill.color, fill.opacity)};\n`;
    }
  }

  return css;
}

// Escape helper
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Generate CSS class names based on layer name or ID
function cleanClassName(name, id) {
  let cleaned = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (!cleaned || /^[0-9]/.test(cleaned)) {
    cleaned = `layer-${cleaned || id.replace(/:/g, "-")}`;
  }
  return cleaned;
}

// Main compiler visitor
function compileNode(node, classes, stylesMap) {
  const cName = cleanClassName(node.name, node.id);
  let html = "";
  let cssRule = "";

  if (node.type === "TEXT") {
    cssRule = getTextStyles(node);
    stylesMap.set(cName, (stylesMap.get(cName) || "") + cssRule);
    html = `<p class="${cName}">${escapeHtml(node.characters)}</p>`;
  } else if (node.type === "FRAME" || node.type === "GROUP" || node.type === "INSTANCE" || node.type === "COMPONENT") {
    cssRule = getLayoutStyles(node) + getBackgroundStyle(node);
    stylesMap.set(cName, (stylesMap.get(cName) || "") + cssRule);

    let childrenHtml = "";
    if (node.children) {
      for (const child of node.children) {
        if (child.visible !== false) {
          childrenHtml += "  " + compileNode(child, classes, stylesMap).replace(/\n/g, "\n  ") + "\n";
        }
      }
    }

    const tag = node.name.toLowerCase().includes("header") ? "header" 
              : node.name.toLowerCase().includes("footer") ? "footer" 
              : node.name.toLowerCase().includes("section") ? "section" : "div";

    html = `<${tag} class="${cName}">\n${childrenHtml}</${tag}>`;
  } else {
    // Fallback for shapes/rectangles/vectors
    cssRule = getLayoutStyles(node) + getBackgroundStyle(node);
    stylesMap.set(cName, (stylesMap.get(cName) || "") + cssRule);
    html = `<div class="${cName}"></div>`;
  }

  return html;
}

async function fetchFigmaFile(fileKey, token) {
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const response = await fetch(url, {
    headers: { "X-Figma-Token": token }
  });
  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  const fileKey = process.argv[2];
  const token = process.env.FIGMA_TOKEN;

  if (!fileKey) {
    console.error("Error: Please provide a Figma File Key.\nUsage: node scripts/figma-to-html.js <file_key>");
    process.exit(1);
  }

  if (!token) {
    console.error("Error: FIGMA_TOKEN environment variable is not set.\nGenerate a personal access token at figma.com/settings and export it:\n  export FIGMA_TOKEN=\"your_token\"");
    process.exit(1);
  }

  console.log(`Connecting to Figma API to fetch file: ${fileKey}...`);
  try {
    const data = await fetchFigmaFile(fileKey, token);
    console.log(`File fetched: "${data.name}"`);

    // We scan pages (Canvases)
    const pages = data.document.children.filter(c => c.type === "CANVAS");
    let convertedCount = 0;

    for (const page of pages) {
      console.log(`Processing Page: "${page.name}"`);
      
      // Find top level frames
      const frames = page.children.filter(c => c.type === "FRAME");
      for (const frame of frames) {
        const templateId = `figma-${fileKey.toLowerCase()}-${cleanClassName(frame.name, frame.id)}`;
        const templateDir = path.join(TEMPLATES_DIR, templateId);
        
        console.log(`  -> Converting Frame: "${frame.name}" into template ID "${templateId}"`);
        
        const stylesMap = new Map();
        const bodyHtml = compileNode(frame, [], stylesMap);

        // Build style.css
        let cssContent = `/* Styles generated from Figma Page: "${page.name}", Frame: "${frame.name}" */\n\n`;
        cssContent += `* { box-sizing: border-box; margin: 0; padding: 0; }\n`;
        cssContent += `body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  background-color: #fafafa;\n  color: #333;\n  line-height: 1.5;\n}\n\n`;

        for (const [cName, rules] of stylesMap.entries()) {
          cssContent += `.${cName} {\n${rules}}\n\n`;
        }

        // Build index.html
        const htmlContent = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(frame.name)} &mdash; Figma Imported</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
${bodyHtml}
</body>
</html>
`;

        // Write meta.json
        const metaContent = {
          title: `${frame.name} (Figma)`,
          category: page.name || "Figma Import",
          description: `Template imported directly from Figma design frame "${frame.name}" using Auto Layout parser rules.`,
          tags: ["figma design", "figma-import", cleanClassName(page.name, "page")]
        };

        fs.mkdirSync(templateDir, { recursive: true });
        fs.writeFileSync(path.join(templateDir, "index.html"), htmlContent);
        fs.writeFileSync(path.join(templateDir, "style.css"), cssContent);
        fs.writeFileSync(path.join(templateDir, "meta.json"), JSON.stringify(metaContent, null, 2) + "\n");
        convertedCount++;
      }
    }

    console.log(`\nImport complete! Converted ${convertedCount} frames from Figma into templates.`);
    console.log("To update your templates list, run:\n  node scripts/generate-manifest.js");

  } catch (error) {
    console.error("Conversion failed:", error.message);
    process.exit(1);
  }
}

main();
