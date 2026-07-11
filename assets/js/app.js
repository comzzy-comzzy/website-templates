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
            <a class="use" href="${escapeHtml(t.path)}" target="_blank" rel="noopener">Use Template</a>
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
