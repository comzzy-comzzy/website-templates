const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "templates");

const categories = [
  "Agency", "Blog", "Corporate", "Event", "Fitness",
  "Nonprofit", "Photography", "Portfolio", "Restaurant", "Resume",
  "SaaS", "Shop", "Travel", "Consulting", "Crypto",
  "Education", "Fashion", "Finance", "Medical", "Real Estate"
];

const categoryNouns = {
  Agency: ["Forge", "Studio", "Collective", "Craft", "Vanguard", "Synergy", "Nexus", "Echo", "Atlas", "Pulse"],
  Blog: ["Inkwell", "Scroll", "Tome", "Journal", "Chronicle", "Log", "Notes", "Post", "Paper", "Slate"],
  Corporate: ["Atlas", "Apex", "Summit", "Global", "Beacon", "Capital", "Alliance", "Consortium", "Enterprise", "Crest"],
  Event: ["Summit", "Gather", "Meet", "Conflux", "Fest", "Gala", "Synergy", "Forum", "Nexus", "Pulse"],
  Fitness: ["Pulse", "Volt", "Iron", "Stamina", "Apex", "Kinetic", "Peak", "Pace", "Core", "Force"],
  Nonprofit: ["Haven", "Hope", "Unity", "Anchor", "Beacon", "Caring", "Nurture", "Heart", "Shield", "Path"],
  Photography: ["Aperture", "Lens", "Focus", "Shutter", "Aspect", "Frame", "Exposure", "Prism", "Lumen", "Glimmer"],
  Portfolio: ["Lumen", "Canvas", "Folio", "Grid", "Profile", "Craft", "Showcase", "Gallery", "Exhibit", "Identity"],
  Restaurant: ["Savor", "Taste", "Bistro", "Crave", "Bite", "Table", "Hearth", "Dine", "Plate", "Feast"],
  Resume: ["Brightline", "Profile", "Path", "Timeline", "Brief", "Summary", "Vibe", "Overview", "Focus", "Identity"],
  SaaS: ["Orbit", "Flow", "Sync", "Link", "Scale", "Cloud", "Engine", "Core", "Stack", "Grid"],
  Shop: ["Nook", "Vault", "Bazaar", "Cart", "Market", "Shelf", "Stall", "Store", "Depot", "Outlet"],
  Travel: ["Wanderly", "Voyage", "Journey", "Quest", "Odyssey", "Route", "Compass", "Trail", "Flight", "Venture"],
  Consulting: ["Strategy", "Advisory", "Insight", "Bridge", "Guide", "Mentor", "Beacon", "Compass", "Core", "Vertex"],
  Crypto: ["Chain", "Block", "Ledger", "Mint", "Token", "Vault", "Node", "Nexus", "Gas", "Ether"],
  Education: ["Academy", "Learn", "Class", "Syllabus", "Course", "Tutor", "Study", "Mind", "Brain", "Growth"],
  Fashion: ["Vogue", "Chic", "Thread", "Stitch", "Weave", "Loom", "Style", "Trend", "Couture", "Atelier"],
  Finance: ["Capital", "Flow", "Ledger", "Vault", "Asset", "Yield", "Equity", "Treasury", "Mint", "Secure"],
  Medical: ["Clinic", "Care", "Health", "Pulse", "Well", "Cure", "Heal", "Life", "Med", "Heart"],
  "Real Estate": ["Haven", "Hearth", "Manor", "Villa", "Palace", "Estate", "Dwelling", "Plot", "Key", "Land"]
};

const prefixes = [
  "Aero", "Apex", "Nova", "Lumen", "Vortex", "Quantum", "Prism", "Echo", "Atlas", "Summit",
  "Pulse", "Orbit", "Forge", "Haven", "Aperture", "Savor", "Brightline", "Wanderly", "Inkwell", "Nook",
  "Velocity", "Zenith", "Catalyst", "Eclipse", "Horizon", "Nebula", "Spectra", "Solstice", "Aurora", "Nimbus",
  "Beacon", "Stratus", "Vector", "Helix", "Synergy", "Tonic", "Verdant", "Ember", "Frost", "Glow",
  "Oasis", "Ridge", "Crest", "Tide", "Wave", "Stream", "Peak", "Spire", "Domain", "Key",
  "Focus", "Aspect", "Pixel", "Grid", "Frame", "Canvas", "Flow", "Shift", "Sync", "Link",
  "Core", "Nexus", "Node", "Hub", "Base", "Vault", "Shield", "Fortress", "Anchor", "Compass",
  "Map", "Route", "Path", "Trail", "Venture", "Quest", "Odyssey", "Voyage", "Journey", "Flight",
  "Launch", "Rocket", "Ignite", "Spark", "Fuse", "Blaze", "Beam", "Ray", "Glimmer", "Shine",
  "Bloom", "Sprout", "Forest", "Grove", "Valley", "Canyon", "Stone", "Rock", "Clay", "Steel"
];

const fontCombos = [
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">',
    body: "'Inter', sans-serif",
    heading: "'Outfit', sans-serif"
  },
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">',
    body: "'Plus Jakarta Sans', sans-serif",
    heading: "'Playfair Display', Georgia, serif"
  },
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Sora:wght@700;800&display=swap" rel="stylesheet">',
    body: "'Space Grotesk', sans-serif",
    heading: "'Sora', sans-serif"
  },
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">',
    body: "'Inter', sans-serif",
    heading: "'Syne', sans-serif"
  },
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">',
    body: "'DM Sans', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif"
  },
  {
    import: '<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet">',
    body: "'Lexend', sans-serif",
    heading: "'Bricolage Grotesque', sans-serif"
  }
];

const styles = ["neo-brutalist", "glassmorphism", "clean-premium", "editorial-warm"];

function makePalette(i) {
  const H = Math.round((i * 137.5) % 360);
  const isDark = i % 2 === 1;

  if (isDark) {
    return {
      bg: `hsl(${H}, 30%, 6%)`,
      surface: `hsl(${H}, 25%, 11%)`,
      text: `hsl(${H}, 10%, 93%)`,
      muted: `hsl(${H}, 12%, 65%)`,
      accent: `hsl(${H}, 80%, 60%)`,
      accent2: `hsl(${(H + 40) % 360}, 85%, 65%)`,
      border: `hsl(${H}, 20%, 18%)`,
      isDark: true
    };
  } else {
    return {
      bg: `hsl(${H}, 20%, 97%)`,
      surface: `#ffffff`,
      text: `hsl(${H}, 35%, 12%)`,
      muted: `hsl(${H}, 15%, 45%)`,
      accent: `hsl(${H}, 75%, 45%)`,
      accent2: `hsl(${(H + 40) % 360}, 75%, 55%)`,
      border: `hsl(${H}, 20%, 86%)`,
      isDark: false
    };
  }
}

// Generate unique HTML structure and content by Category and Layout Variant (0 to 4)
function getTemplateHtml(category, title, font, layoutVariant) {
  let navLinks = "";
  let heroSection = "";
  let contentSections = "";

  switch (category) {
    case "Agency":
    case "Consulting":
      navLinks = `<li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#about">About</a></li>`;
      break;
    case "Blog":
      navLinks = `<li><a href="#latest">Latest</a></li><li><a href="#popular">Popular</a></li><li><a href="#newsletter">Subscribe</a></li>`;
      break;
    case "SaaS":
    case "Finance":
    case "Crypto":
      navLinks = `<li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#faq">FAQ</a></li>`;
      break;
    default:
      navLinks = `<li><a href="#overview">Overview</a></li><li><a href="#details">Details</a></li><li><a href="#contact">Contact</a></li>`;
  }

  if (layoutVariant === 0) {
    heroSection = `
    <section class="hero layout-centered">
      <div class="wrap">
        <div class="badge">Classic Edition</div>
        <h1>Powering the future of <span>${category.toLowerCase()}</span>.</h1>
        <p>A classic, reliable approach to designing premium experiences for modern audiences globally.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#overview">Get Started</a>
          <a class="btn secondary" href="#details">Learn More</a>
        </div>
      </div>
    </section>`;

    contentSections = `
    <section id="overview" class="section-centered">
      <div class="wrap">
        <div class="heading"><h2>Our Pillars</h2><p>Designed for scalability and operational trust.</p></div>
        <div class="grid-3">
          <div class="card-item"><h3>01 / Integrity</h3><p>Consistent delivery aligned with business strategy and user research.</p></div>
          <div class="card-item"><h3>02 / Performance</h3><p>Optimized bundle sizes, quick load times, and fluid page transitions.</p></div>
          <div class="card-item"><h3>03 / Growth</h3><p>Flexible frameworks designed to adapt as your organization scales.</p></div>
        </div>
      </div>
    </section>
    <section id="details" class="section-centered details-alt">
      <div class="wrap">
        <div class="heading"><h2>Core Details</h2></div>
        <div class="grid-2">
          <div class="showcase-card"><div class="media-placeholder"></div><h3>Primary Operations</h3><p>We streamline operational flows for standard systems.</p></div>
          <div class="showcase-card"><div class="media-placeholder"></div><h3>Secondary Operations</h3><p>Comprehensive dashboard metrics and API integrations.</p></div>
        </div>
      </div>
    </section>`;

  } else if (layoutVariant === 1) {
    heroSection = `
    <section class="hero layout-split">
      <div class="wrap split-container">
        <div class="split-col text-col">
          <div class="badge">Modern Edition</div>
          <h1>Asymmetric layouts for <span>${category}</span> work.</h1>
          <p>We blend editorial style with robust modern grids to help you stand out in saturated markets.</p>
          <a class="btn primary" href="#work">Explore Assets</a>
        </div>
        <div class="split-col visual-col">
          <div class="hero-media-box">
            <div class="mock-browser">
              <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
              <div class="url-bar">https://api.${category.toLowerCase()}.io</div>
              <div class="mock-body"></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    contentSections = `
    <section id="features" class="section-split">
      <div class="wrap">
        <div class="heading"><h2>Core Features</h2></div>
        <div class="alternating-rows">
          <div class="alt-row">
            <div class="text-block"><h3>Automated Workflows</h3><p>Connect your tools and trigger actions automatically upon events.</p></div>
            <div class="media-block"><div class="media-box-fill"></div></div>
          </div>
          <div class="alt-row reverse">
            <div class="text-block"><h3>Real-Time Insights</h3><p>Monitor metrics directly in your visual console as they happen.</p></div>
            <div class="media-block"><div class="media-box-fill"></div></div>
          </div>
        </div>
      </div>
    </section>`;

  } else if (layoutVariant === 2) {
    heroSection = `
    <section class="hero layout-sidebar-hero">
      <div class="badge">Vertical Panel Edition</div>
      <h1>Efficient <span>${category}</span> interfaces.</h1>
      <p>By moving navigation to a persistent side panel, we maximize space for data-dense grids and visuals.</p>
      <a class="btn primary" href="#grid-section">See Layout</a>
    </section>`;

    contentSections = `
    <section id="grid-section" class="section-sidebar">
      <div class="heading"><h2>Data Density View</h2><p>Spacious visual containers for assets and metrics.</p></div>
      <div class="grid-3">
        <div class="card-item shadow-hover"><h3>System Status</h3><p>Operational at 99.98% uptime worldwide.</p></div>
        <div class="card-item shadow-hover"><h3>Database Nodes</h3><p>Distributed across 8 zones for safety.</p></div>
        <div class="card-item shadow-hover"><h3>Bandwidth usage</h3><p>Scale dynamically as API load increases.</p></div>
      </div>
      <div class="sidebar-large-card"><div class="media-placeholder-wide"></div></div>
    </section>`;

  } else if (layoutVariant === 3) {
    heroSection = `
    <section class="hero layout-asymmetric">
      <div class="wrap">
        <div class="editorial-intro">
          <div class="badge">Editorial Style</div>
          <h1>Crafting narratives in <span>${category.toLowerCase()} design</span>.</h1>
        </div>
        <div class="editorial-body">
          <p class="large-lead">We believe web design should read like a premium magazine. Open spacing, beautiful serif typography, and asymmetrical content block alignments.</p>
          <a class="btn primary" href="#stories">Read Our Stories</a>
        </div>
      </div>
    </section>`;

    contentSections = `
    <section id="stories" class="section-asymmetric">
      <div class="wrap">
        <div class="heading"><h2>Featured Chapters</h2></div>
        <div class="masonry-grid">
          <div class="masonry-item item-large">
            <div class="img-box"></div>
            <div class="meta"><span>Chapter 01</span><h3>The Minimalism Trend</h3></div>
          </div>
          <div class="masonry-item item-small">
            <div class="img-box"></div>
            <div class="meta"><span>Chapter 02</span><h3>Type Selection</h3></div>
          </div>
          <div class="masonry-item item-medium">
            <div class="img-box"></div>
            <div class="meta"><span>Chapter 03</span><h3>Balanced Contrast</h3></div>
          </div>
        </div>
      </div>
    </section>`;

  } else if (layoutVariant === 4) {
    heroSection = `
    <section class="hero layout-dashboard-hero">
      <div class="wrap">
        <div class="badge">Console Dashboard Edition</div>
        <h1>The central workspace for <span>${category}</span> operators.</h1>
        <p>A data-rich dashboard console built for developers, designers, and system architects.</p>
        <div class="console-box">
          <div class="console-header">
            <div class="dots"><span class="red"></span><span class="yellow"></span><span class="green"></span></div>
            <span class="title">terminal &mdash; comzzy@templates</span>
          </div>
          <div class="console-body">
            <p class="cmd">$ agy templates:list --category="${category.toLowerCase()}"</p>
            <p class="res">Found 50 unique templates matched with layout variants 0-4.</p>
            <p class="cmd">$ agy deploy --target=production</p>
            <p class="res success">✓ Deploy completed successfully to website-templates-khaki.vercel.app</p>
          </div>
        </div>
      </div>
    </section>`;

    contentSections = `
    <section id="widgets" class="section-dashboard">
      <div class="wrap">
        <div class="heading"><h2>Operational Widgets</h2></div>
        <div class="widgets-grid">
          <div class="widget-card">
            <div class="widget-header"><h4>System CPU</h4><span class="status-dot green"></span></div>
            <div class="widget-metric">12%</div>
            <p>Optimized workload distribution.</p>
          </div>
          <div class="widget-card">
            <div class="widget-header"><h4>Total Users</h4><span class="status-dot green"></span></div>
            <div class="widget-metric">48.2k</div>
            <p>+14% growth this month.</p>
          </div>
          <div class="widget-card">
            <div class="widget-header"><h4>API Latency</h4><span class="status-dot green"></span></div>
            <div class="widget-metric">42ms</div>
            <p>Edge response routing enabled.</p>
          </div>
        </div>
      </div>
    </section>`;
  }

  if (layoutVariant === 2) {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} &mdash; ${category}</title>
${font.import}
<link rel="stylesheet" href="style.css">
</head>
<body class="has-sidebar">
<header class="nav sidebar-nav">
  <div class="logo">${title}</div>
  <ul class="nav-links">
    ${navLinks}
  </ul>
  <a class="btn primary" href="#contact-footer">Contact</a>
</header>

<main class="sidebar-main-content">
  ${heroSection}
  ${contentSections}
  <footer id="contact-footer">
    <p>&copy; 2026 ${title}. Created with Website Templates.</p>
  </footer>
</main>
</body>
</html>`;
  } else if (layoutVariant === 4) {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} &mdash; ${category}</title>
${font.import}
<link rel="stylesheet" href="style.css">
</head>
<body class="floating-nav-body">
<header class="nav floating-nav">
  <div class="wrap float-wrap">
    <div class="logo">${title}</div>
    <ul class="nav-links">
      ${navLinks}
    </ul>
    <a class="btn primary" href="#contact-footer">Contact</a>
  </div>
</header>

<main>
  ${heroSection}
  ${contentSections}
</main>

<footer id="contact-footer">
  <div class="wrap">
    <p>&copy; 2026 ${title}. Created with Website Templates.</p>
  </div>
</footer>
</body>
</html>`;
  } else {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} &mdash; ${category}</title>
${font.import}
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="nav standard-nav">
  <div class="wrap">
    <div class="logo">${title}</div>
    <ul class="nav-links">
      ${navLinks}
    </ul>
    <a class="btn primary" href="#contact-footer">Contact</a>
  </div>
</header>

<main>
  ${heroSection}
  ${contentSections}
</main>

<footer id="contact-footer">
  <div class="wrap">
    <p>&copy; 2026 ${title}. Created with Website Templates.</p>
  </div>
</footer>
</body>
</html>`;
  }
}

// Generate the specific CSS variables and layout styling rules
function getTemplateCss(style, font, palette, layoutVariant, index) {
  const btnSubVariant = index % 3;
  const cardSubVariant = (index + 1) % 3;

  let css = `:root {
  --bg: ${palette.bg};
  --surface: ${palette.surface};
  --text: ${palette.text};
  --muted: ${palette.muted};
  --accent: ${palette.accent};
  --accent2: ${palette.accent2};
  --border: ${palette.border};
  font-size: 16px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: ${font.body};
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
.wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
h1, h2, h3, h4 { font-family: ${font.heading}; font-weight: 800; color: var(--text); }
span { color: var(--accent); }
p { color: var(--muted); }
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
}
.heading { margin-bottom: 48px; }
.heading h2 { font-size: 2rem; margin-bottom: 8px; }
.heading p { color: var(--muted); }
`;

  if (style === "neo-brutalist") {
    let btnCss = "";
    let cardCss = "";

    if (btnSubVariant === 0) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  border: 3px solid var(--text);
  box-shadow: 4px 4px 0 var(--text);
  transition: all 0.15s ease;
  text-transform: uppercase;
}
.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--text);
}
.btn.secondary {
  background: var(--surface);
  color: var(--text);
}
`;
    } else if (btnSubVariant === 1) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 14px 28px;
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  font-weight: 900;
  border: 4px solid var(--text);
  border-radius: 12px;
  box-shadow: 5px 5px 0 var(--accent);
  transition: all 0.1s ease;
  text-transform: uppercase;
}
.btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--accent);
}
.btn.secondary {
  background: var(--accent2);
  color: var(--text);
}
`;
    } else {
      btnCss = `
.btn {
  display: inline-block;
  padding: 10px 22px;
  background: var(--text);
  color: var(--bg);
  text-decoration: none;
  font-weight: 700;
  border: 2px solid var(--accent);
  border-radius: 4px;
  box-shadow: -4px 4px 0 var(--accent2);
  transition: all 0.2s ease;
}
.btn:hover {
  transform: translate(2px, -2px);
  box-shadow: -6px 6px 0 var(--accent2);
}
.btn.secondary {
  background: var(--accent);
  color: #fff;
}
`;
    }

    if (cardSubVariant === 0) {
      cardCss = `
.card-item {
  background: var(--surface);
  border: 3px solid var(--text);
  padding: 28px;
  box-shadow: 4px 4px 0 var(--text);
}
`;
    } else if (cardSubVariant === 1) {
      cardCss = `
.card-item {
  background: var(--surface);
  border: 3px dashed var(--text);
  padding: 24px;
  box-shadow: 6px 6px 0 var(--accent2);
}
`;
    } else {
      cardCss = `
.card-item {
  background: var(--surface);
  border: 4px double var(--text);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 6px 6px 0 var(--accent);
}
`;
    }

    css += btnCss + cardCss + `
.badge {
  background: var(--accent2);
  color: var(--text);
  border: 2px solid var(--text);
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0px;
}
.card-item h3 { font-size: 1.3rem; margin-bottom: 12px; text-transform: uppercase; }
.media-placeholder, .media-placeholder-wide, .media-box-fill, .img-box {
  background: var(--accent2);
  border: 3px solid var(--text);
  border-radius: 0px;
}
`;
  } else if (style === "glassmorphism") {
    let btnCss = "";
    let cardCss = "";

    if (btnSubVariant === 0) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 30px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.9; }
.btn.secondary {
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border: 1px solid var(--border);
}
`;
    } else if (btnSubVariant === 1) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px dashed var(--accent);
  transition: all 0.3s;
}
.btn:hover {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}
.btn.secondary {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
}
`;
    } else {
      btnCss = `
.btn {
  display: inline-block;
  padding: 11px 26px;
  border-radius: 16px 0px;
  background: linear-gradient(160deg, rgba(var(--accent), 0.1), rgba(var(--accent2), 0.2));
  border: 1.5px solid var(--accent2);
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.btn:hover {
  border-radius: 0px 16px;
  background: var(--accent2);
  color: #fff;
}
.btn.secondary {
  background: rgba(0,0,0,0.2);
  color: var(--text);
  border: 1px solid var(--border);
}
`;
    }

    if (cardSubVariant === 0) {
      cardCss = `
.card-item {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s, border-color 0.3s;
}
.card-item:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
`;
    } else if (cardSubVariant === 1) {
      cardCss = `
.card-item {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.02);
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
`;
    } else {
      cardCss = `
.card-item {
  background: linear-gradient(185deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 36px;
}
`;
    }

    css += btnCss + cardCss + `
.badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--accent);
}
.media-placeholder, .media-placeholder-wide, .media-box-fill, .img-box {
  background: linear-gradient(160deg, var(--accent), var(--accent2));
  border-radius: 12px;
  opacity: 0.8;
}
`;
  } else if (style === "clean-premium") {
    let btnCss = "";
    let cardCss = "";

    if (btnSubVariant === 0) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 11px 22px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s, transform 0.2s;
}
.btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
.btn.secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}
`;
    } else if (btnSubVariant === 1) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 12px 26px;
  border-radius: 50px;
  background: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.btn:hover {
  background: var(--accent);
  color: #fff;
}
.btn.secondary {
  border-color: var(--border);
  color: var(--muted);
}
`;
    } else {
      btnCss = `
.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  background: var(--text);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  transition: background-color 0.2s;
}
.btn:hover {
  background: var(--accent);
}
.btn.secondary {
  background: var(--surface);
  color: var(--text);
}
`;
    }

    if (cardSubVariant === 0) {
      cardCss = `
.card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}
.card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
`;
    } else if (cardSubVariant === 1) {
      cardCss = `
.card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.03);
}
`;
    } else {
      cardCss = `
.card-item {
  background: var(--surface);
  border-left: 4px solid var(--accent);
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-radius: 6px;
  padding: 24px;
}
`;
    }

    css += btnCss + cardCss + `
.badge {
  background: rgba(var(--accent), 0.1);
  color: var(--accent);
  border: 1px solid var(--border);
}
.media-placeholder, .media-placeholder-wide, .media-box-fill, .img-box {
  background: var(--border);
  border-radius: 8px;
}
`;
  } else if (style === "editorial-warm") {
    let btnCss = "";
    let cardCss = "";

    if (btnSubVariant === 0) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--text);
  color: var(--bg);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.9; }
.btn.secondary {
  background: transparent;
  color: var(--text);
  border-bottom: 2px solid var(--text);
}
`;
    } else if (btnSubVariant === 1) {
      btnCss = `
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: 1px solid var(--text);
  color: var(--text);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.25s;
}
.btn:hover {
  background: var(--text);
  color: var(--bg);
}
.btn.secondary {
  border-color: var(--border);
  color: var(--muted);
}
`;
    } else {
      btnCss = `
.btn {
  display: inline-block;
  padding: 0 0 4px 0;
  background: transparent;
  color: var(--text);
  border-bottom: 2px solid var(--accent);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  font-style: italic;
  transition: border-color 0.2s;
}
.btn:hover {
  border-color: var(--text);
}
.btn.secondary {
  border-bottom-color: var(--border);
}
`;
    }

    if (cardSubVariant === 0) {
      cardCss = `
.card-item {
  border-top: 2px solid var(--text);
  padding: 24px 0;
}
`;
    } else if (cardSubVariant === 1) {
      cardCss = `
.card-item {
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 28px;
}
`;
    } else {
      cardCss = `
.card-item {
  border-left: 2px solid var(--accent);
  padding: 16px 24px;
  background: transparent;
}
`;
    }

    css += btnCss + cardCss + `
.badge {
  border-bottom: 1px solid var(--accent);
  color: var(--text);
  font-style: italic;
  font-family: Georgia, serif;
}
.media-placeholder, .media-placeholder-wide, .media-box-fill, .img-box {
  background: var(--surface);
  border: 1px solid var(--border);
}
`;
  }

  // --- Layout 0: Centered Layout CSS ---
  if (layoutVariant === 0) {
    css += `
.layout-centered { padding: 110px 0 90px; text-align: center; }
.layout-centered h1 { font-size: 3.5rem; line-height: 1.15; margin-bottom: 20px; }
.layout-centered p { max-width: 600px; margin: 0 auto 32px; font-size: 1.15rem; }
.hero-actions { display: flex; gap: 16px; justify-content: center; }
.section-centered { padding: 84px 0; border-top: 1px solid var(--border); }
.section-centered.details-alt { background: var(--surface); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.media-placeholder { height: 160px; margin-bottom: 16px; }
.showcase-card { padding: 20px; background: var(--bg); border: 1px solid var(--border); }
.showcase-card h3 { margin: 12px 0 8px; }

header.standard-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.standard-nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.standard-nav .logo { font-size: 1.3rem; font-weight: 800; }
.standard-nav ul.nav-links { list-style: none; display: flex; gap: 24px; }
.standard-nav ul.nav-links a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 0.95rem; }
footer { text-align: center; padding: 48px 0; border-top: 1px solid var(--border); }

@media (max-width: 768px) {
  .layout-centered h1 { font-size: 2.4rem; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
}
`;
  }

  // --- Layout 1: Split Screen CSS ---
  else if (layoutVariant === 1) {
    css += `
.layout-split { padding: 90px 0; }
.split-container { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
.split-col h1 { font-size: 3.4rem; line-height: 1.15; margin-bottom: 24px; }
.split-col p { font-size: 1.1rem; margin-bottom: 32px; }
.hero-media-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.mock-browser { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; background: var(--bg); }
.mock-browser .dots { display: flex; gap: 6px; padding: 10px; background: var(--surface); border-bottom: 1px solid var(--border); }
.mock-browser .dots span { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.mock-browser .dots span.r { background: #ef4444; }
.mock-browser .dots span.y { background: #eab308; }
.mock-browser .dots span.g { background: #10b981; }
.mock-browser .url-bar { background: var(--bg); padding: 6px 12px; font-size: 0.75rem; text-align: center; border-bottom: 1px solid var(--border); font-family: monospace; color: var(--muted); }
.mock-browser .mock-body { height: 180px; background: linear-gradient(180deg, var(--surface), var(--bg)); }

.section-split { padding: 90px 0; border-top: 1px solid var(--border); background: var(--surface); }
.alternating-rows { display: flex; flex-direction: column; gap: 64px; }
.alt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.alt-row.reverse { direction: rtl; }
.alt-row.reverse .text-block { direction: ltr; }
.alt-row h3 { font-size: 1.8rem; margin-bottom: 12px; }
.media-box-fill { height: 260px; }

header.standard-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.standard-nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.standard-nav .logo { font-size: 1.3rem; font-weight: 800; }
.standard-nav ul.nav-links { list-style: none; display: flex; gap: 24px; }
.standard-nav ul.nav-links a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 0.95rem; }
footer { text-align: center; padding: 48px 0; border-top: 1px solid var(--border); }

@media (max-width: 768px) {
  .split-container, .alt-row { grid-template-columns: 1fr; gap: 32px; }
  .split-col h1 { font-size: 2.3rem; }
}
`;
  }

  // --- Layout 2: Left Sidebar Navigation CSS ---
  else if (layoutVariant === 2) {
    css += `
body.has-sidebar { display: flex; min-height: 100vh; }
header.sidebar-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
}
header.sidebar-nav .logo { font-size: 1.4rem; font-weight: 800; text-transform: uppercase; margin-bottom: 40px; }
header.sidebar-nav ul.nav-links { list-style: none; display: flex; flex-direction: column; gap: 20px; }
header.sidebar-nav ul.nav-links a { color: var(--text); text-decoration: none; font-weight: 600; }

main.sidebar-main-content {
  margin-left: 250px;
  flex-grow: 1;
  padding: 64px 48px;
  background: var(--bg);
}
.layout-sidebar-hero { padding: 60px 0 80px; max-width: 800px; }
.layout-sidebar-hero h1 { font-size: 3.2rem; line-height: 1.15; margin-bottom: 20px; }
.layout-sidebar-hero p { font-size: 1.15rem; margin-bottom: 30px; }

.section-sidebar { padding: 60px 0; border-top: 1px solid var(--border); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.sidebar-large-card { margin-top: 36px; }
.media-placeholder-wide { height: 260px; }

footer { margin-top: 80px; padding-top: 32px; border-top: 1px solid var(--border); text-align: center; color: var(--muted); }

@media (max-width: 1024px) {
  body.has-sidebar { flex-direction: column; }
  header.sidebar-nav { position: relative; width: 100%; border-right: none; border-bottom: 1px solid var(--border); height: auto; padding: 24px; flex-direction: row; align-items: center; }
  header.sidebar-nav .logo { margin-bottom: 0; }
  header.sidebar-nav ul.nav-links { flex-direction: row; gap: 16px; }
  main.sidebar-main-content { margin-left: 0; padding: 24px; }
}
@media (max-width: 768px) {
  header.sidebar-nav ul.nav-links { display: none; }
  .grid-3 { grid-template-columns: 1fr; }
}
`;
  }

  // --- Layout 3: Asymmetric Editorial CSS ---
  else if (layoutVariant === 3) {
    css += `
.layout-asymmetric { padding: 120px 0 80px; }
.layout-asymmetric h1 { font-size: 4rem; line-height: 1.05; letter-spacing: -1px; }
.editorial-intro { max-width: 780px; margin-bottom: 40px; }
.editorial-body { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 48px; align-items: flex-start; }
.large-lead { font-size: 1.35rem; line-height: 1.6; font-style: italic; }

.section-asymmetric { padding: 90px 0; border-top: 1px solid var(--border); }
.masonry-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; }
.masonry-item { display: flex; flex-direction: column; gap: 16px; }
.masonry-item.item-large .img-box { height: 380px; }
.masonry-item.item-small .img-box { height: 220px; }
.masonry-item.item-medium { grid-column: span 2; margin-top: 20px; }
.masonry-item.item-medium .img-box { height: 280px; }
.masonry-item .meta span { font-size: 0.8rem; text-transform: uppercase; color: var(--accent); font-weight: 600; }
.masonry-item h3 { font-size: 1.5rem; margin-top: 4px; }

header.standard-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.standard-nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.standard-nav .logo { font-size: 1.3rem; font-weight: 800; }
.standard-nav ul.nav-links { list-style: none; display: flex; gap: 24px; }
.standard-nav ul.nav-links a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 0.95rem; }
footer { text-align: center; padding: 48px 0; border-top: 1px solid var(--border); }

@media (max-width: 768px) {
  .layout-asymmetric h1 { font-size: 2.6rem; }
  .editorial-body, .masonry-grid { grid-template-columns: 1fr; }
  .masonry-item.item-medium { grid-column: span 1; }
  .masonry-item.item-large .img-box { height: 260px; }
}
`;
  }

  // --- Layout 4: Dashboard / Modern App CSS ---
  else if (layoutVariant === 4) {
    css += `
body.floating-nav-body { padding-top: 96px; }
header.floating-nav {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 960px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 99px;
  z-index: 100;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}
.float-wrap { display: flex; align-items: center; justify-content: space-between; height: 60px; width: 100%; padding: 0 20px; }
.floating-nav .logo { font-size: 1.25rem; font-weight: 800; }
.floating-nav ul.nav-links { list-style: none; display: flex; gap: 20px; }
.floating-nav ul.nav-links a { color: var(--text); text-decoration: none; font-size: 0.9rem; font-weight: 500; }

.layout-dashboard-hero { padding: 60px 0 80px; text-align: center; }
.layout-dashboard-hero h1 { font-size: 3.2rem; line-height: 1.15; margin-bottom: 20px; }
.layout-dashboard-hero p { max-width: 600px; margin: 0 auto 32px; }

.console-box {
  max-width: 720px;
  margin: 0 auto;
  background: #1e1e24;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  text-align: left;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}
.console-header {
  background: #16161a;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #2a2a30;
}
.console-header .dots { display: flex; gap: 6px; }
.console-header .dots span { width: 8px; height: 8px; border-radius: 50%; }
.console-header .dots .red { background: #ef4444; }
.console-header .dots .yellow { background: #eab308; }
.console-header .dots .green { background: #10b981; }
.console-header .title { font-size: 0.75rem; color: #a1a1aa; font-family: monospace; }
.console-body { padding: 18px; font-family: monospace; font-size: 0.85rem; line-height: 1.6; }
.console-body p.cmd { color: #f4f4f5; }
.console-body p.res { color: #a1a1aa; margin-bottom: 8px; }
.console-body p.success { color: #34d399; }

.section-dashboard { padding: 90px 0; border-top: 1px solid var(--border); background: var(--surface); }
.widgets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.widget-card { background: var(--bg); border: 1px solid var(--border); padding: 24px; border-radius: 12px; }
.widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.widget-header h4 { font-size: 0.95rem; text-transform: uppercase; color: var(--muted); }
.widget-header .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }
.widget-metric { font-size: 2.2rem; font-weight: 800; color: var(--text); margin-bottom: 6px; }

footer { text-align: center; padding: 48px 0; border-top: 1px solid var(--border); }

@media (max-width: 768px) {
  body.floating-nav-body { padding-top: 120px; }
  header.floating-nav { top: 10px; width: 95%; }
  .floating-nav ul.nav-links { display: none; }
  .layout-dashboard-hero h1 { font-size: 2.3rem; }
  .widgets-grid { grid-template-columns: 1fr; }
}
`;
  }

  return css;
}

function cleanId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function main() {
  console.log("Starting generation of 1000 structurally unique website templates...");

  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  let templatesCount = 0;
  const nameRegistry = new Set();

  for (let i = 0; i < 1000; i++) {
    const category = categories[i % categories.length];
    
    const prefix = prefixes[Math.floor(i / categoryNouns[category].length) % prefixes.length];
    const noun = categoryNouns[category][i % categoryNouns[category].length];
    
    let baseName = `${prefix} ${noun}`;
    let name = baseName;
    let nameCounter = 1;
    
    while (nameRegistry.has(name.toLowerCase())) {
      name = `${baseName} ${nameCounter++}`;
    }
    nameRegistry.add(name.toLowerCase());

    const id = cleanId(`${category.toLowerCase()}-${name}`);
    const title = name;

    const style = styles[i % styles.length];
    const font = fontCombos[i % fontCombos.length];
    const palette = makePalette(i);
    const layoutVariant = i % 5;

    const dir = path.join(TEMPLATES_DIR, id);
    fs.mkdirSync(dir, { recursive: true });

    const html = getTemplateHtml(category, title, font, layoutVariant);
    const css = getTemplateCss(style, font, palette, layoutVariant, i);
    
    const meta = {
      title: title,
      category: category,
      description: `Premium template for ${category.toLowerCase()} websites. Features a layout type ${layoutVariant} (${["Centered Classic", "Split Screen Modern", "Sidebar Navigation", "Asymmetric Editorial", "Dashboard Operator App"][layoutVariant]}) designed under a ${style.replace("-", " ")} design system.`,
      tags: [category.toLowerCase(), style, "figma design", "modern", "responsive", `layout-${layoutVariant}`]
    };

    fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
    fs.writeFileSync(path.join(dir, "index.html"), html + "\n");
    fs.writeFileSync(path.join(dir, "style.css"), css + "\n");

    templatesCount++;
  }

  console.log(`Successfully generated ${templatesCount} new templates in ${TEMPLATES_DIR}`);
}

main();
