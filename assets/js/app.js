(function () {
  const PAGE_SIZE = 24;

  const state = {
    all: [],
    filtered: [],
    query: "",
    category: "All",
    sort: "title-asc",
    page: 1,
  };

  const els = {
    grid: document.getElementById("grid"),
    search: document.getElementById("search"),
    pills: document.getElementById("category-pills"),
    sort: document.getElementById("sort"),
    resultInfo: document.getElementById("result-info"),
    count: document.getElementById("template-count"),
    pagination: document.getElementById("pagination"),
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // --- Client-side ZIP (store-only, no compression) -------------------------
  // Builds a template's ZIP in the browser from its files, so downloads work
  // on any static host without pre-built archives.
  const ZIP_MEMBER_FILES = ["index.html", "style.css", "meta.json", "thumbnail.svg"];

  const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function buildZip(entries) {
    const encoder = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    let centralSize = 0;
    for (const { name, bytes } of entries) {
      const nameBytes = encoder.encode(name);
      const crc = crc32(bytes);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true); // UTF-8 names
      local.setUint32(14, crc, true);
      local.setUint32(18, bytes.length, true);
      local.setUint32(22, bytes.length, true);
      local.setUint16(26, nameBytes.length, true);
      parts.push(local.buffer, nameBytes, bytes);

      const dir = new DataView(new ArrayBuffer(46));
      dir.setUint32(0, 0x02014b50, true);
      dir.setUint16(4, 20, true);
      dir.setUint16(6, 20, true);
      dir.setUint16(8, 0x0800, true);
      dir.setUint32(16, crc, true);
      dir.setUint32(20, bytes.length, true);
      dir.setUint32(24, bytes.length, true);
      dir.setUint16(28, nameBytes.length, true);
      dir.setUint32(42, offset, true);
      central.push(dir.buffer, nameBytes);
      centralSize += 46 + nameBytes.length;
      offset += 30 + nameBytes.length + bytes.length;
    }
    const eocd = new DataView(new ArrayBuffer(22));
    eocd.setUint32(0, 0x06054b50, true);
    eocd.setUint16(8, entries.length, true);
    eocd.setUint16(10, entries.length, true);
    eocd.setUint32(12, centralSize, true);
    eocd.setUint32(16, offset, true);
    return new Blob([...parts, ...central, eocd.buffer], { type: "application/zip" });
  }

  async function buildTemplateZip(t) {
    const base = t.path.slice(0, t.path.lastIndexOf("/") + 1);
    const entries = [];
    for (const name of ZIP_MEMBER_FILES) {
      try {
        const res = await fetch(base + name);
        if (!res.ok) continue;
        entries.push({ name: `${t.id}/${name}`, bytes: new Uint8Array(await res.arrayBuffer()) });
      } catch (_) {
        /* skip unavailable files */
      }
    }
    if (entries.length === 0) throw new Error("Template files could not be fetched");
    return buildZip(entries);
  }

  async function downloadTemplate(t, btn) {
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Preparing…";
    try {
      const blob = await buildTemplateZip(t);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${t.id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }
  window.__buildTemplateZip = buildTemplateZip; // exposed for testing
  // --------------------------------------------------------------------------

  function applyFilters() {
    const q = state.query.trim().toLowerCase();
    state.filtered = state.all.filter((t) => {
      const matchesCategory = state.category === "All" || t.category === state.category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [t.title, t.category, t.description, ...(t.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });

    state.filtered.sort((a, b) => {
      if (state.sort === "title-asc") return a.title.localeCompare(b.title);
      if (state.sort === "title-desc") return b.title.localeCompare(a.title);
      if (state.sort === "category") return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      return 0;
    });

    state.page = 1;
    render();
  }

  function renderPills() {
    const categories = ["All", ...new Set(state.all.map((t) => t.category))].sort((a, b) =>
      a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)
    );
    els.pills.innerHTML = categories
      .map(
        (cat) =>
          `<button class="pill ${cat === state.category ? "active" : ""}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
      )
      .join("");
  }

  function renderCards(pageItems) {
    if (pageItems.length === 0) {
      els.grid.innerHTML = `<div class="empty-state">No templates match your search. Try a different keyword or category.</div>`;
      return;
    }
    els.grid.innerHTML = pageItems
      .map(
        (t) => `
      <article class="card">
        <div class="thumb-wrap"><img src="${escapeHtml(t.thumbnail)}" alt="${escapeHtml(t.title)} preview" loading="lazy"></div>
        <div class="body">
          <div class="category-tag">${escapeHtml(t.category)}</div>
          <h3>${escapeHtml(t.title)}</h3>
          <p class="desc">${escapeHtml(t.description)}</p>
          <div class="tags">${(t.tags || []).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="actions">
            <a class="preview" href="${escapeHtml(t.path)}" target="_blank" rel="noopener">Preview</a>
            <button class="use download" data-id="${escapeHtml(t.id)}" type="button">Download ZIP</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  function renderPagination() {
    const total = state.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (totalPages <= 1) {
      els.pagination.innerHTML = "";
      return;
    }

    let html = `<button data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>&larr; Prev</button>`;
    html += `<span class="page-info">Page ${state.page} of ${totalPages}</span>`;
    html += `<button data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>Next &rarr;</button>`;
    els.pagination.innerHTML = html;
  }

  function render() {
    const total = state.filtered.length;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = state.filtered.slice(start, start + PAGE_SIZE);

    els.resultInfo.textContent =
      total === 0
        ? "0 templates found"
        : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} template${total === 1 ? "" : "s"}`;

    renderCards(pageItems);
    renderPagination();
  }

  function init(templates) {
    state.all = templates;
    els.count.textContent = `${templates.length} template${templates.length === 1 ? "" : "s"} available`;

    renderPills();
    applyFilters();

    els.search.addEventListener(
      "input",
      debounce((e) => {
        state.query = e.target.value;
        applyFilters();
      }, 150)
    );

    els.sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      applyFilters();
    });

    els.pills.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      renderPills();
      applyFilters();
    });

    els.grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button.download[data-id]");
      if (!btn) return;
      const t = state.all.find((x) => x.id === btn.dataset.id);
      if (t) downloadTemplate(t, btn);
    });

    els.pagination.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-page]");
      if (!btn || btn.disabled) return;
      state.page = Number(btn.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  fetch("data/templates.json")
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load templates.json (${res.status})`);
      return res.json();
    })
    .then(init)
    .catch((err) => {
      els.grid.innerHTML = `<div class="empty-state">Could not load templates. ${escapeHtml(
        err.message
      )}<br>If you opened this file directly, serve it over HTTP instead (e.g. <code>python3 -m http.server</code>).</div>`;
    });
})();
