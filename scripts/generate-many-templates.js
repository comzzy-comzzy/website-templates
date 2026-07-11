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

// Generate the specific HTML and CSS based on category & design style
function getTemplateContent(category, title, style, font, palette) {
  let navLinks = "";
  let heroContent = "";
  let mainContent = "";

  switch (category) {
    case "Agency":
      navLinks = `<li><a href="#services">Services</a></li>
      <li><a href="#work">Work</a></li>
      <li><a href="#about">About</a></li>`;
      heroContent = `
      <div class="badge">Creative Studio</div>
      <h1>We design digital experiences that <span>matter.</span></h1>
      <p>Transforming complex ideas into simple, beautiful, and intuitive products for world-class brands.</p>
      <a class="btn primary" href="#work">Explore Work</a>`;
      mainContent = `
      <section id="services">
        <div class="wrap">
          <div class="heading"><h2>Our Services</h2><p>Tailored solutions for modern brands</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Brand Strategy</h3><p>Defining your unique voice, positioning, and long-term values.</p></div>
            <div class="card-item"><h3>UX/UI Design</h3><p>Crafting stunning user interfaces with a focus on functional beauty.</p></div>
            <div class="card-item"><h3>Development</h3><p>Building fast, accessible, and scalable web solutions using modern tech.</p></div>
          </div>
        </div>
      </section>
      <section id="work">
        <div class="wrap">
          <div class="heading"><h2>Featured Work</h2><p>A selection of our latest client collaborations</p></div>
          <div class="grid-2">
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Alpha Platform</h3><p>FinTech Web App</p></div></div>
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Solstice Brand</h3><p>Visual Identity</p></div></div>
          </div>
        </div>
      </section>`;
      break;

    case "Blog":
      navLinks = `<li><a href="#latest">Latest</a></li>
      <li><a href="#popular">Popular</a></li>
      <li><a href="#newsletter">Subscribe</a></li>`;
      heroContent = `
      <div class="badge">Insights &amp; Stories</div>
      <h1>Thoughts on design, <span>technology</span>, and culture.</h1>
      <p>A collection of articles, essays, and resources updated weekly by our editorial team.</p>
      <a class="btn primary" href="#latest">Read Latest Articles</a>`;
      mainContent = `
      <section id="latest">
        <div class="wrap">
          <div class="heading"><h2>Latest Articles</h2></div>
          <div class="grid-3">
            <div class="card-item"><div class="media-box small"></div><h3>The Future of Minimal Design</h3><p>Exploring how typography and whitespace define modern interfaces.</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>Mastering CSS Grid</h3><p>A deep dive into advanced grid patterns and alignment tricks.</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>AI in Design Workflows</h3><p>How generative AI is changing the speed and scope of product design.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Corporate":
      navLinks = `<li><a href="#solutions">Solutions</a></li>
      <li><a href="#about">About Us</a></li>
      <li><a href="#contact">Contact</a></li>`;
      heroContent = `
      <div class="badge">Enterprise Solutions</div>
      <h1>Accelerate your business with <span>intelligent systems.</span></h1>
      <p>We provide infrastructure, security, and integration consulting for fast-growing global corporations.</p>
      <a class="btn primary" href="#solutions">See Our Solutions</a>`;
      mainContent = `
      <section id="solutions">
        <div class="wrap">
          <div class="heading"><h2>Our Solutions</h2><p>Scale efficiently and securely</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Cloud Infrastructure</h3><p>Secure migrations and automated cluster orchestration.</p></div>
            <div class="card-item"><h3>Cybersecurity</h3><p>Comprehensive threat modeling, auditing, and compliance.</p></div>
            <div class="card-item"><h3>Data Analytics</h3><p>Custom analytics pipelines for real-time business metrics.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Event":
      navLinks = `<li><a href="#schedule">Schedule</a></li>
      <li><a href="#speakers">Speakers</a></li>
      <li><a href="#tickets">Get Tickets</a></li>`;
      heroContent = `
      <div class="badge">Annual Conference &mdash; Oct 15-17</div>
      <h1>The premier event for <span>creative thinkers.</span></h1>
      <p>Three days of talks, workshops, and networking with industry leaders in design and technology.</p>
      <a class="btn primary" href="#tickets">Register Now</a>`;
      mainContent = `
      <section id="speakers">
        <div class="wrap">
          <div class="heading"><h2>Featured Speakers</h2><p>Hear from industry leaders</p></div>
          <div class="grid-3">
            <div class="card-item"><div class="avatar"></div><h3>Dr. Jane Doe</h3><p>AI Architect at FutureTech</p></div>
            <div class="card-item"><div class="avatar"></div><h3>John Smith</h3><p>Design Lead at CreativeCo</p></div>
            <div class="card-item"><div class="avatar"></div><h3>Alice Johnson</h3><p>Founder of StartupLabs</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Fitness":
      navLinks = `<li><a href="#classes">Classes</a></li>
      <li><a href="#trainers">Trainers</a></li>
      <li><a href="#pricing">Membership</a></li>`;
      heroContent = `
      <div class="badge">Transform Your Body</div>
      <h1>Push your limits, <span>reach your goals.</span></h1>
      <p>High-intensity workouts, expert personal trainers, and premium gym amenities to accelerate your progress.</p>
      <a class="btn primary" href="#classes">View Classes</a>`;
      mainContent = `
      <section id="classes">
        <div class="wrap">
          <div class="heading"><h2>Class Schedule</h2><p>Workouts that match your schedule</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>HIIT Training</h3><p>High-intensity interval sessions designed to burn fat and build stamina.</p></div>
            <div class="card-item"><h3>Strength &amp; Conditioning</h3><p>Focus on compound lifts, core strength, and muscular endurance.</p></div>
            <div class="card-item"><h3>Yoga &amp; Mobility</h3><p>Improve flexibility, balance, and mental clarity with expert guides.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Nonprofit":
      navLinks = `<li><a href="#mission">Our Mission</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#donate">Donate</a></li>`;
      heroContent = `
      <div class="badge">Join the Cause</div>
      <h1>Building a sustainable <span>future for all.</span></h1>
      <p>We work with global communities to provide clean water, education, and reforestation programs.</p>
      <a class="btn primary" href="#donate">Support Our Mission</a>`;
      mainContent = `
      <section id="projects">
        <div class="wrap">
          <div class="heading"><h2>Active Projects</h2><p>Where your donations go</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Clean Water Initiative</h3><p>Installing water filtration units in remote villages.</p></div>
            <div class="card-item"><h3>Community Schools</h3><p>Building schools and providing learning resources for children.</p></div>
            <div class="card-item"><h3>Reforestation Project</h3><p>Planting over 100,000 native trees to recover local biomes.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Photography":
      navLinks = `<li><a href="#portfolio">Portfolio</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#booking">Book Session</a></li>`;
      heroContent = `
      <div class="badge">Visual Storytelling</div>
      <h1>Capturing moments that <span>tell stories.</span></h1>
      <p>Editorial, portrait, and landscape photography characterized by natural light and minimal styling.</p>
      <a class="btn primary" href="#portfolio">View Portfolio</a>`;
      mainContent = `
      <section id="portfolio">
        <div class="wrap">
          <div class="heading"><h2>Featured Work</h2></div>
          <div class="grid-2">
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Urban Architecture</h3><p>Tokyo Series</p></div></div>
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Desert Solitude</h3><p>Arizona Series</p></div></div>
          </div>
        </div>
      </section>`;
      break;

    case "Portfolio":
      navLinks = `<li><a href="#projects">Projects</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#contact">Contact</a></li>`;
      heroContent = `
      <div class="badge">UX/UI Designer &mdash; Developer</div>
      <h1>Hi, I'm ${title.split(" ")[0]} &mdash; <span>creating digital interfaces.</span></h1>
      <p>I build clean, accessible, and fast web experiences with special attention to micro-details.</p>
      <a class="btn primary" href="#projects">See Projects</a>`;
      mainContent = `
      <section id="projects">
        <div class="wrap">
          <div class="heading"><h2>Selected Projects</h2></div>
          <div class="grid-3">
            <div class="card-item"><h3>Design System</h3><p>Built a token-based system for a multi-product enterprise.</p></div>
            <div class="card-item"><h3>FinTech Dashboard</h3><p>Redesigned financial analytics graphs for better usability.</p></div>
            <div class="card-item"><h3>Mobile App</h3><p>Created wireframes and interactive prototypes for travel platform.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Restaurant":
      navLinks = `<li><a href="#menu">Menu</a></li>
      <li><a href="#reservations">Reservations</a></li>
      <li><a href="#about">About</a></li>`;
      heroContent = `
      <div class="badge">Modern Bistro</div>
      <h1>Flavors that feel <span>like home.</span></h1>
      <p>Fresh, locally-sourced ingredients prepared with care by our kitchen team. Book your table today.</p>
      <a class="btn primary" href="#reservations">Book a Table</a>`;
      mainContent = `
      <section id="menu">
        <div class="wrap">
          <div class="heading"><h2>Seasonal Menu</h2><p>Fresh items updated monthly</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Pan-Seared Salmon</h3><p>Served with wild asparagus, garlic baby potatoes, and dill oil.</p></div>
            <div class="card-item"><h3>Truffle Gnocchi</h3><p>Handmade potato gnocchi, black truffle cream, and wild mushrooms.</p></div>
            <div class="card-item"><h3>Citrus Tart</h3><p>Meyer lemon curd, light toasted meringue, and graham crust.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Resume":
      navLinks = `<li><a href="#experience">Experience</a></li>
      <li><a href="#education">Education</a></li>
      <li><a href="#skills">Skills</a></li>`;
      heroContent = `
      <div class="badge">Senior Product Engineer</div>
      <h1>Building scalable <span>frontends for scale.</span></h1>
      <p>Expertise in React, CSS architecture, web performance, and technical team leadership.</p>
      <a class="btn primary" href="mailto:hello@example.com">Contact Me</a>`;
      mainContent = `
      <section id="experience">
        <div class="wrap">
          <div class="heading"><h2>Work Experience</h2></div>
          <div class="timeline">
            <div class="timeline-item"><h4>Lead Frontend Engineer</h4><p>GlobalTech &mdash; 2024 - Present</p><p>Led a team of 6 engineers rebuilding the core web application from scratch, improving bundle sizes by 40%.</p></div>
            <div class="timeline-item"><h4>Senior UI Developer</h4><p>DesignFlow &mdash; 2022 - 2024</p><p>Designed and built a modular component library used by 30+ internal developer teams.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "SaaS":
      navLinks = `<li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
      <li><a href="#faq">FAQ</a></li>`;
      heroContent = `
      <div class="badge">Next-Gen Workspace</div>
      <h1>Unify your projects, <span>docs, and team.</span></h1>
      <p>One workspace for all your planning, task tracking, and team collaboration. Move faster, together.</p>
      <a class="btn primary" href="#pricing">Get Started Free</a>`;
      mainContent = `
      <section id="features">
        <div class="wrap">
          <div class="heading"><h2>Powerful Features</h2><p>Designed to supercharge productivity</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Task Kanban</h3><p>Organize and prioritize tasks in a visual board format.</p></div>
            <div class="card-item"><h3>Real-Time Chat</h3><p>Communicate directly inside cards and documents.</p></div>
            <div class="card-item"><h3>Automations</h3><p>Set custom triggers to automate status updates and alerts.</p></div>
          </div>
        </div>
      </section>
      <section id="pricing">
        <div class="wrap">
          <div class="heading"><h2>Simple Pricing</h2><p>No hidden fees, upgrade anytime</p></div>
          <div class="grid-3">
            <div class="pricing-card"><h3>Starter</h3><h4>$0</h4><p>Up to 5 team members</p><a class="btn" href="#">Get Started</a></div>
            <div class="pricing-card featured"><h3>Pro</h3><h4>$15</h4><p>Unlimited projects &amp; tools</p><a class="btn primary" href="#">Start Trial</a></div>
            <div class="pricing-card"><h3>Enterprise</h3><h4>Custom</h4><p>Dedicated server &amp; SSO</p><a class="btn" href="#">Contact Us</a></div>
          </div>
        </div>
      </section>`;
      break;

    case "Shop":
      navLinks = `<li><a href="#products">Products</a></li>
      <li><a href="#categories">Categories</a></li>
      <li><a href="#sale">Sale</a></li>`;
      heroContent = `
      <div class="badge">Summer Collection</div>
      <h1>Minimalist apparel for <span>everyday comfort.</span></h1>
      <p>High-quality sustainable materials styled into wardrobe essentials that last a lifetime.</p>
      <a class="btn primary" href="#products">Shop All Products</a>`;
      mainContent = `
      <section id="products">
        <div class="wrap">
          <div class="heading"><h2>Featured Products</h2></div>
          <div class="grid-3">
            <div class="product-card"><div class="media-box"></div><h3>Organic Cotton Tee</h3><span>$32.00</span></div>
            <div class="product-card"><div class="media-box"></div><h3>Recycled Linen Shirt</h3><span>$68.00</span></div>
            <div class="product-card"><div class="media-box"></div><h3>Everyday Canvas Tote</h3><span>$24.00</span></div>
          </div>
        </div>
      </section>`;
      break;

    case "Travel":
      navLinks = `<li><a href="#destinations">Destinations</a></li>
      <li><a href="#tours">Tours</a></li>
      <li><a href="#reviews">Reviews</a></li>`;
      heroContent = `
      <div class="badge">Adventure Awaits</div>
      <h1>Explore the world's <span>hidden paths.</span></h1>
      <p>Curated boutique travel packages, eco-tours, and adventure guides in untouched natural reserves.</p>
      <a class="btn primary" href="#destinations">Discover Destinations</a>`;
      mainContent = `
      <section id="destinations">
        <div class="wrap">
          <div class="heading"><h2>Popular Destinations</h2><p>Voted best spots for 2026</p></div>
          <div class="grid-3">
            <div class="card-item"><div class="media-box small"></div><h3>Kyoto Temples</h3><p>Japan &mdash; Cultural exploration</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>Amalfi Coast</h3><p>Italy &mdash; Ocean views and bistro dining</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>Patagonia Trails</h3><p>Chile &mdash; Mountain hiking expeditions</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Consulting":
      navLinks = `<li><a href="#services">Services</a></li>
      <li><a href="#cases">Case Studies</a></li>
      <li><a href="#contact">Contact</a></li>`;
      heroContent = `
      <div class="badge">Business Strategy</div>
      <h1>Transform your business <span>operations &amp; scale.</span></h1>
      <p>We provide operational consulting, financial planning, and technology advice for companies going public.</p>
      <a class="btn primary" href="#contact">Free Consultation</a>`;
      mainContent = `
      <section id="services">
        <div class="wrap">
          <div class="heading"><h2>Our Practices</h2></div>
          <div class="grid-3">
            <div class="card-item"><h3>Growth Strategy</h3><p>Identify new revenue sources and optimize market positioning.</p></div>
            <div class="card-item"><h3>Operational Efficiency</h3><p>Automating workflows and trimming operational overhead.</p></div>
            <div class="card-item"><h3>M&amp;A Integration</h3><p>Guiding smooth consolidations and mergers of technology stacks.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Crypto":
      navLinks = `<li><a href="#protocol">Protocol</a></li>
      <li><a href="#roadmap">Roadmap</a></li>
      <li><a href="#community">Community</a></li>`;
      heroContent = `
      <div class="badge">Decentralized Finance</div>
      <h1>The liquidity layer for <span>autonomous web3.</span></h1>
      <p>High-yield liquid staking, sub-second settlement times, and zero-knowledge privacy guarantees.</p>
      <a class="btn primary" href="#protocol">Launch Application</a>`;
      mainContent = `
      <section id="protocol">
        <div class="wrap">
          <div class="heading"><h2>Key Features</h2><p>Designed for multi-chain security</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Sub-Second Finality</h3><p>Settlement in under 800ms using proof-of-stake consensus.</p></div>
            <div class="card-item"><h3>Secure Vaults</h3><p>Multi-signature custody contracts audited by top agencies.</p></div>
            <div class="card-item"><h3>Zero Knowledge</h3><p>Private transfers using advanced zk-SNARK mathematics.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Education":
      navLinks = `<li><a href="#courses">Courses</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>`;
      heroContent = `
      <div class="badge">Online Academy</div>
      <h1>Learn advanced coding <span>from scratch.</span></h1>
      <p>Detailed modules, downloadable resources, and live weekly Q&amp;A calls with professional instructors.</p>
      <a class="btn primary" href="#courses">Browse Courses</a>`;
      mainContent = `
      <section id="courses">
        <div class="wrap">
          <div class="heading"><h2>Featured Courses</h2></div>
          <div class="grid-3">
            <div class="card-item"><h3>Node.js Backend Architecture</h3><p>Build scalable microservices and robust API layers.</p></div>
            <div class="card-item"><h3>Advanced CSS Layouts</h3><p>Flexbox, Grid, container queries, and beautiful typography.</p></div>
            <div class="card-item"><h3>Fullstack React &amp; Next.js</h3><p>Server components, routing, and deployment orchestration.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Fashion":
      navLinks = `<li><a href="#runway">Runway</a></li>
      <li><a href="#collection">Collection</a></li>
      <li><a href="#atelier">Atelier</a></li>`;
      heroContent = `
      <div class="badge">Autumn Runway 2026</div>
      <h1>Re-imagining sustainable <span>luxury tailoring.</span></h1>
      <p>Minimalist silhouettes, recycled organic fibers, and ethical construction in local design ateliers.</p>
      <a class="btn primary" href="#collection">Explore Collection</a>`;
      mainContent = `
      <section id="collection">
        <div class="wrap">
          <div class="heading"><h2>Atelier Collection</h2></div>
          <div class="grid-2">
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Linen Trench Coat</h3><p>Loose fit organic linen</p></div></div>
            <div class="work-card"><div class="media-box"></div><div class="body"><h3>Pleated Wool Trousers</h3><p>Recycled merino wool blend</p></div></div>
          </div>
        </div>
      </section>`;
      break;

    case "Finance":
      navLinks = `<li><a href="#benefits">Benefits</a></li>
      <li><a href="#security">Security</a></li>
      <li><a href="#app">Download</a></li>`;
      heroContent = `
      <div class="badge">Wealth Management</div>
      <h1>Intelligent investing, <span>simplified.</span></h1>
      <p>Automated index investing, smart tax-loss harvesting, and dedicated wealth advisors in one app.</p>
      <a class="btn primary" href="#app">Open an Account</a>`;
      mainContent = `
      <section id="benefits">
        <div class="wrap">
          <div class="heading"><h2>Why Choose Us</h2><p>Smart wealth building for modern investors</p></div>
          <div class="grid-3">
            <div class="card-item"><h3>Low Fees</h3><p>Keep more of your returns with our industry-low 0.25% fee structure.</p></div>
            <div class="card-item"><h3>Automated Harvest</h3><p>Smart algorithms dynamically offset capital gains taxes.</p></div>
            <div class="card-item"><h3>Secure Custody</h3><p>SIPC-protected accounts insured up to $500,000.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Medical":
      navLinks = `<li><a href="#specialties">Specialties</a></li>
      <li><a href="#doctors">Our Staff</a></li>
      <li><a href="#booking">Book Appointment</a></li>`;
      heroContent = `
      <div class="badge">Modern Clinic</div>
      <h1>Providing compassionate, <span>advanced healthcare.</span></h1>
      <p>State-of-the-art diagnostic equipment, resident specialists, and family health programs.</p>
      <a class="btn primary" href="#booking">Schedule a Visit</a>`;
      mainContent = `
      <section id="specialties">
        <div class="wrap">
          <div class="heading"><h2>Our Specialties</h2></div>
          <div class="grid-3">
            <div class="card-item"><h3>Family Medicine</h3><p>Comprehensive primary care for patients of all ages.</p></div>
            <div class="card-item"><h3>Cardiology</h3><p>Advanced diagnostic testing, heart health monitoring, and wellness planning.</p></div>
            <div class="card-item"><h3>Pediatrics</h3><p>Child development check-ups, vaccines, and specialized pediatric care.</p></div>
          </div>
        </div>
      </section>`;
      break;

    case "Real Estate":
      navLinks = `<li><a href="#listings">Properties</a></li>
      <li><a href="#agents">Our Agents</a></li>
      <li><a href="#contact">Contact</a></li>`;
      heroContent = `
      <div class="badge">Find Your Home</div>
      <h1>Modern spaces made for <span>mindful living.</span></h1>
      <p>Browse our hand-picked collection of modern townhomes, luxury villas, and smart urban apartments.</p>
      <a class="btn primary" href="#listings">Search Listings</a>`;
      mainContent = `
      <section id="listings">
        <div class="wrap">
          <div class="heading"><h2>Featured Listings</h2></div>
          <div class="grid-3">
            <div class="card-item"><div class="media-box small"></div><h3>Nova Villa</h3><p>$1,450,000 &mdash; 4 Bed, 3 Bath</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>Lumen Loft</h3><p>$850,000 &mdash; 2 Bed, 2 Bath</p></div>
            <div class="card-item"><div class="media-box small"></div><h3>Summit Townhome</h3><p>$1,200,000 &mdash; 3 Bed, 2.5 Bath</p></div>
          </div>
        </div>
      </section>`;
      break;
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} &mdash; ${category}</title>
${font.import}
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="nav">
  <div class="wrap">
    <div class="logo">${title}</div>
    <ul>
      ${navLinks}
    </ul>
    <a class="btn primary" href="#contact-footer">Contact</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    ${heroContent}
  </div>
</section>

${mainContent}

<footer id="contact-footer">
  <div class="wrap">
    <p>&copy; 2026 ${title}. Created with Website Templates.</p>
  </div>
</footer>
</body>
</html>`;

  // Define Layout-specific CSS rules
  let styleCss = `:root {
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
h1, h2, h3, h4 { font-family: ${font.heading}; font-weight: 700; color: var(--text); }
span { color: var(--accent); }
`;

  // Append Navigation Styling
  if (style === "neo-brutalist") {
    styleCss += `
header.nav { border-bottom: 3px solid var(--text); background: var(--surface); }
.nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 80px; }
.nav .logo { font-size: 1.4rem; font-weight: 800; text-transform: uppercase; }
.nav ul { list-style: none; display: flex; gap: 24px; }
.nav a { color: var(--text); text-decoration: none; font-weight: 600; }
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--accent);
  color: var(--bg);
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
.hero { padding: 96px 0 80px; }
.hero h1 { font-size: 3.6rem; line-height: 1.1; margin-bottom: 24px; text-transform: uppercase; }
.hero p { max-width: 600px; font-size: 1.1rem; color: var(--muted); margin-bottom: 32px; }
.badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--accent2);
  color: var(--text);
  border: 2px solid var(--text);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 18px;
}
section { padding: 80px 0; border-top: 3px solid var(--text); }
.heading { margin-bottom: 48px; }
.heading h2 { font-size: 2.2rem; text-transform: uppercase; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.card-item {
  background: var(--surface);
  border: 3px solid var(--text);
  padding: 28px;
  box-shadow: 4px 4px 0 var(--text);
}
.card-item h3 { font-size: 1.4rem; margin-bottom: 12px; text-transform: uppercase; }
.card-item p { color: var(--muted); }
.work-card {
  background: var(--surface);
  border: 3px solid var(--text);
  box-shadow: 5px 5px 0 var(--text);
}
.work-card .media-box { height: 220px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-bottom: 3px solid var(--text); }
.work-card .body { padding: 20px; }
.timeline { border-left: 3px solid var(--text); padding-left: 24px; }
.timeline-item { margin-bottom: 32px; position: relative; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -33px;
  top: 6px;
  width: 14px;
  height: 14px;
  background: var(--accent);
  border: 3px solid var(--text);
  border-radius: 50%;
}
.pricing-card {
  background: var(--surface);
  border: 3px solid var(--text);
  padding: 32px;
  text-align: center;
  box-shadow: 4px 4px 0 var(--text);
}
.pricing-card.featured {
  background: var(--accent2);
}
.pricing-card h3 { font-size: 1.5rem; text-transform: uppercase; }
.pricing-card h4 { font-size: 2.4rem; margin: 12px 0; }
.avatar { width: 80px; height: 80px; background: var(--accent); border: 3px solid var(--text); border-radius: 50%; margin-bottom: 16px; }
footer { padding: 48px 0; border-top: 3px solid var(--text); background: var(--surface); text-align: center; font-weight: bold; }
@media (max-width: 768px) {
  .nav ul { display: none; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.5rem; }
}
`;
  } else if (style === "glassmorphism") {
    styleCss += `
header.nav {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  z-index: 100;
}
.nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.nav .logo { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.5px; }
.nav ul { list-style: none; display: flex; gap: 28px; }
.nav a { color: var(--muted); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
.nav a:hover { color: var(--text); }
.btn {
  display: inline-block;
  padding: 10px 20px;
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
.hero { padding: 120px 0 100px; text-align: center; }
.hero h1 { font-size: 3.5rem; line-height: 1.15; margin-bottom: 24px; font-weight: 800; letter-spacing: -1px; }
.hero p { max-width: 620px; font-size: 1.15rem; color: var(--muted); margin: 0 auto 36px; }
.badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}
section { padding: 90px 0; border-top: 1px solid var(--border); }
.heading { text-align: center; max-width: 600px; margin: 0 auto 56px; }
.heading h2 { font-size: 2rem; margin-bottom: 12px; }
.heading p { color: var(--muted); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
.card-item {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.card-item:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
.card-item h3 { font-size: 1.3rem; margin-bottom: 12px; }
.card-item p { color: var(--muted); font-size: 0.95rem; }
.work-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.work-card:hover { transform: translateY(-4px); }
.work-card .media-box { height: 220px; background: linear-gradient(160deg, var(--accent), var(--accent2)); }
.work-card .body { padding: 24px; }
.timeline { border-left: 1px dashed var(--border); padding-left: 28px; }
.timeline-item { margin-bottom: 32px; position: relative; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -33px;
  top: 8px;
  width: 9px;
  height: 9px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
}
.pricing-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 36px 28px;
  text-align: center;
  transition: transform 0.3s;
}
.pricing-card:hover { transform: translateY(-4px); }
.pricing-card.featured {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--accent);
}
.pricing-card h3 { font-size: 1.3rem; margin-bottom: 8px; }
.pricing-card h4 { font-size: 2.8rem; font-weight: 800; margin: 16px 0; }
.avatar { width: 80px; height: 80px; background: var(--accent); border-radius: 50%; margin: 0 auto 16px; opacity: 0.85; }
footer { padding: 48px 0; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.9rem; }
@media (max-width: 768px) {
  .nav ul { display: none; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.5rem; }
}
`;
  } else if (style === "clean-premium") {
    styleCss += `
header.nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.nav .logo { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.5px; }
.nav ul { list-style: none; display: flex; gap: 30px; }
.nav a { color: var(--muted); text-decoration: none; font-size: 0.92rem; font-weight: 500; transition: color 0.2s; }
.nav a:hover { color: var(--text); }
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.btn:hover { filter: brightness(1.1); }
.hero { padding: 110px 0 90px; }
.hero h1 { font-size: 3.2rem; line-height: 1.2; margin-bottom: 20px; font-weight: 800; }
.hero p { max-width: 580px; font-size: 1.1rem; color: var(--muted); margin-bottom: 32px; }
.badge {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(var(--accent), 0.1);
  color: var(--accent);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
}
section { padding: 84px 0; border-top: 1px solid var(--border); }
.heading { margin-bottom: 48px; }
.heading h2 { font-size: 1.85rem; margin-bottom: 8px; }
.heading p { color: var(--muted); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}
.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
}
.card-item h3 { font-size: 1.25rem; margin-bottom: 10px; }
.card-item p { color: var(--muted); font-size: 0.95rem; }
.work-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s;
}
.work-card:hover { transform: translateY(-4px); }
.work-card .media-box { height: 200px; background: linear-gradient(135deg, var(--accent), var(--accent2)); }
.work-card .body { padding: 20px; }
.timeline { border-left: 2px solid var(--border); padding-left: 24px; }
.timeline-item { margin-bottom: 28px; position: relative; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -29px;
  top: 8px;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
}
.pricing-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  transition: transform 0.3s;
}
.pricing-card.featured {
  border-color: var(--accent);
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
}
.pricing-card h3 { font-size: 1.2rem; }
.pricing-card h4 { font-size: 2.5rem; margin: 12px 0; }
.avatar { width: 80px; height: 80px; background: var(--border); border-radius: 50%; margin: 0 auto 16px; }
footer { padding: 48px 0; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.88rem; }
@media (max-width: 768px) {
  .nav ul { display: none; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.3rem; }
}
`;
  } else if (style === "editorial-warm") {
    styleCss += `
header.nav { border-bottom: 1px solid var(--border); }
.nav .wrap { display: flex; align-items: center; justify-content: space-between; height: 80px; }
.nav .logo { font-size: 1.3rem; font-family: ${font.heading}; font-weight: 700; }
.nav ul { list-style: none; display: flex; gap: 32px; }
.nav a { color: var(--text); text-decoration: none; font-size: 0.95rem; font-family: ${font.heading}; }
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--text);
  color: var(--bg);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: ${font.heading};
  font-weight: 600;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.9; }
.hero { padding: 130px 0 100px; max-width: 800px; }
.hero h1 { font-size: 3.4rem; font-weight: 600; line-height: 1.15; margin-bottom: 24px; letter-spacing: -0.5px; }
.hero p { font-size: 1.2rem; color: var(--muted); line-height: 1.7; margin-bottom: 36px; }
.badge {
  display: inline-block;
  padding: 4px 0;
  border-bottom: 1px solid var(--accent);
  color: var(--text);
  font-size: 0.9rem;
  font-family: ${font.heading};
  font-style: italic;
  margin-bottom: 24px;
}
section { padding: 96px 0; border-top: 1px solid var(--border); }
.heading { margin-bottom: 56px; }
.heading h2 { font-size: 2rem; font-family: ${font.heading}; font-weight: 600; margin-bottom: 12px; }
.heading p { color: var(--muted); font-size: 1.05rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
.card-item {
  border-top: 2px solid var(--text);
  padding: 24px 0;
}
.card-item h3 { font-size: 1.3rem; margin-bottom: 12px; font-weight: 600; }
.card-item p { color: var(--muted); font-size: 0.98rem; }
.work-card {
  border: 1px solid var(--border);
  background: var(--surface);
}
.work-card .media-box { height: 240px; background: linear-gradient(135deg, var(--accent), var(--accent2)); opacity: 0.95; }
.work-card .body { padding: 24px; }
.timeline { border-left: 1px solid var(--text); padding-left: 28px; }
.timeline-item { margin-bottom: 36px; position: relative; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -32px;
  top: 9px;
  width: 7px;
  height: 7px;
  background: var(--text);
  border-radius: 50%;
}
.pricing-card {
  border: 1px solid var(--border);
  padding: 40px 24px;
  text-align: center;
}
.pricing-card.featured {
  border-color: var(--text);
  background: var(--surface);
}
.pricing-card h3 { font-size: 1.25rem; font-family: ${font.heading}; }
.pricing-card h4 { font-size: 2.6rem; font-weight: 600; margin: 16px 0; }
.avatar { width: 80px; height: 80px; background: var(--border); border-radius: 50%; margin: 0 auto 16px; }
footer { padding: 64px 0; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.92rem; }
@media (max-width: 768px) {
  .nav ul { display: none; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.4rem; }
}
`;
  }

  return { html, css: styleCss };
}

function cleanId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function main() {
  console.log("Starting generation of 500 website templates...");

  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  // Create list of 500 unique template definitions
  let templatesCount = 0;
  const nameRegistry = new Set();

  for (let i = 0; i < 500; i++) {
    // Determine category
    const category = categories[i % categories.length];
    
    // Choose prefix and noun
    const prefix = prefixes[Math.floor(i / categoryNouns[category].length) % prefixes.length];
    const noun = categoryNouns[category][i % categoryNouns[category].length];
    
    let baseName = `${prefix} ${noun}`;
    let name = baseName;
    let nameCounter = 1;
    
    // De-duplicate name
    while (nameRegistry.has(name.toLowerCase())) {
      name = `${baseName} ${nameCounter++}`;
    }
    nameRegistry.add(name.toLowerCase());

    const id = cleanId(`${category.toLowerCase()}-${name}`);
    const title = name;

    const style = styles[i % styles.length];
    const font = fontCombos[i % fontCombos.length];
    const palette = makePalette(i);

    const dir = path.join(TEMPLATES_DIR, id);
    fs.mkdirSync(dir, { recursive: true });

    const content = getTemplateContent(category, title, style, font, palette);
    
    // Write meta.json
    const meta = {
      title: title,
      category: category,
      description: `Premium ${style.replace("-", " ")} style template for ${category.toLowerCase()} websites featuring a beautiful color scheme and optimized layout.`,
      tags: [category.toLowerCase(), style, "figma design", "modern", "responsive", cleanId(prefix)]
    };

    fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
    fs.writeFileSync(path.join(dir, "index.html"), content.html + "\n");
    fs.writeFileSync(path.join(dir, "style.css"), content.css + "\n");

    templatesCount++;
  }

  console.log(`Successfully generated ${templatesCount} new templates in ${TEMPLATES_DIR}`);
}

main();
