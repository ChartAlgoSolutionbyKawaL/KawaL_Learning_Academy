/* ==========================================================================
   EXCEL DASHBOARD INSPIRATION WALL — Level 5 BONUS feature
   A pinned-paper / handwritten inspiration wall of 20 real Excel dashboards.
   Fully additive: does NOT touch official LMS progress, navigation for the
   five Level-5 topics, lessons, or any other product.

   State (viewed / downloaded / bookmarked) is kept in a SEPARATE localStorage
   key so it can never affect LMS.courseProgress() / completion %.
   ========================================================================== */

const Bonus = (() => {
  const KEY = "excelMastery.bonusWall.v1";
  const AI_PROMPT = "Analyze this Excel dashboard as a senior business analyst. " +
    "Explain its business purpose, target audience, KPIs, data structure, " +
    "visualizations, filters and decision-making value. Identify what works, " +
    "what is weak, and recommend practical improvements. Then suggest how AI " +
    "can make this dashboard more intelligent and useful.";

  let state = load();
  let filter = "all";
  let query = "";
  let modalId = null;          // currently open dashboard id in the study modal
  let lightId = null;          // currently open dashboard id in the full-size lightbox
  let zoom = 1;                // lightbox zoom level

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign({ viewed: {}, downloaded: {}, bookmarked: {} }, JSON.parse(raw));
    } catch (e) {}
    return { viewed: {}, downloaded: {}, bookmarked: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  const get = id => DASHBOARDS.find(d => d.id === id);
  const isViewed = id => !!state.viewed[id];
  const isDownloaded = id => !!state.downloaded[id];
  const isBookmarked = id => !!state.bookmarked[id];

  function markViewed(id) { if (!state.viewed[id]) { state.viewed[id] = Date.now(); save(); } }
  function markDownloaded(id) { state.downloaded[id] = Date.now(); save(); }
  function toggleBookmark(id) {
    if (state.bookmarked[id]) delete state.bookmarked[id];
    else state.bookmarked[id] = Date.now();
    save();
    return !!state.bookmarked[id];
  }

  /* counts for the progress strip — bonus only, never official progress */
  const stats = () => ({
    viewed: Object.keys(state.viewed).length,
    downloaded: Object.keys(state.downloaded).length,
    bookmarked: Object.keys(state.bookmarked).length,
    total: DASHBOARDS.length
  });

  /* ----- filtering + search ----- */
  function visible() {
    const q = query.trim().toLowerCase();
    return DASHBOARDS.filter(d => {
      if (filter !== "all" && d.filter !== filter) return false;
      if (q) {
        const hay = (d.title + " " + d.category + " " + d.desc + " " + (d.tags || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function setFilter(f) { filter = f; }
  function setQuery(q) { query = q; }

  /* cards are white pinned posters; category colour is only an accent (pin + label + hover).
     Tiny rotation (<=1deg) + subtle vertical offset give an editorial "arranged" feel. */
  const ROT = [-0.7, 0.6, -0.5, 0.8, -0.6, 0.4, -0.8, 0.5, -0.4, 0.7, -0.6, 0.5, -0.7, 0.6, -0.5, 0.8, -0.4, 0.6, -0.7, 0.5];
  const PINS = ["top", "tl", "tr", "top"];
  const NOTE_LABELS = ["Look here →", "KPI focus", "Great layout", "Study this chart", "Ask AI", "Clean design", "Real data →"];
  const cardStyle = i => {
    const r = ROT[i % ROT.length];
    const pin = PINS[i % PINS.length];
    return `style="--rot:${r}deg" data-pin="${pin}"`;
  };

  /* natural preview aspect ratios (width/height) so each card box fits its
     real dashboard with no crop and no blank margin. Computed from the trimmed
     exports in resources/excel-dashboard-previews/. */
  const PREVIEW_RATIO = {
    "kpi-dashboard": 1915/1304, "financial-dashboard": 1985/1407, "project-management-dashboard": 1980/1399,
    "health-and-safety-dashboard": 1883/1353, "supply-chain-dashboard": 1991/1424, "call-center-dashboard": 1691/858,
    "sales-dashboard": 1984/1403, "inventory-dashboard": 1950/2731, "marketing-dashboard": 1983/1406,
    "ceo-dashboard": 1982/1676, "ecommerce-dashboard": 1889/1325, "okr-dashboard": 1985/1404,
    "recruitment-dashboard": 1624/1151, "seo-dashboard": 1984/1388, "saas-dashboard": 1986/1379,
    "social-media-metrics-dashboard": 1987/1404, "weekly-status-dashboard": 1985/1405, "personal-budget-dashboard": 973/676,
    "hr-dashboard": 1950/2870, "performance-dashboard": 2000/1374, "corporate-dashboard-infographic": 1821/1093
  };
  const previewRatio = d => PREVIEW_RATIO[d.id] || (4/3);

  /* ----- render the whole bonus view ----- */
  function render() {
    const s = stats();
    const filters = DASHBOARD_FILTERS.map(f =>
      `<button class="dw-f ${f.id === filter ? "on" : ""}" data-dw-filter="${f.id}">${esc(f.label)}</button>`).join("");

    const cards = visible().map((d, i) => cardHTML(d, DASHBOARDS.indexOf(d))).join("");

    return `
    <div class="dw-studio">

      ${newsPanel(s)}

      <div class="dw-wall-col">
        <div class="dw-controls">
          <div class="dw-filters" id="dwFilters">${filters}</div>
          <div class="dw-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input id="dwSearch" type="text" placeholder="Search the dashboard wall…" value="${esc(query)}" autocomplete="off" spellcheck="false">
          </div>
        </div>

        <div class="dw-board" id="dwBoard">
          ${cards || `<div class="dw-empty">No dashboards match your filter / search.</div>`}
        </div>

        ${statusStrip(s)}
      </div>
    </div>

    ${overlayPlaceholders()}`;
  }

  /* Overlays (modal + lightbox) are mounted at <body> level so NOTHING in the
     scrolling page (sticky newspaper panel, sticky bars) can paint over them.
     render() emits placeholders; App calls mountOverlays() right after. */
  function overlayPlaceholders() {
    return `<div id="dwModalSlot"></div><div id="dwLightboxSlot"></div>`;
  }
  function mountOverlays() {
    let slot = document.getElementById("dwModalSlot");
    if (slot) { slot.outerHTML = modalHTML(); }
    slot = document.getElementById("dwLightboxSlot");
    if (slot) { slot.outerHTML = lightboxHTML(); }
  }

  /* ----- LEFT NEWSPAPER / LEARNING PANEL (editorial, inside main body) ----- */
  function newsPanel(s) {
    return `
    <aside class="dw-news" aria-label="Dashboard learning notes">
      <div class="dw-news-mast">
        <div class="dw-news-kicker">RESOLVRPRO · LEARNING ACADEMY</div>
        <h2 class="dw-news-h">EXCEL DASHBOARD<br>INSPIRATION WALL</h2>
        <p class="dw-news-sub">21 real-world Excel dashboards. Explore • Inspect • Download • Learn</p>
        <p class="dw-news-quote">“Don't copy the dashboard. Understand the thinking behind it.”</p>
        <div class="dw-progress dw-progress--news" title="Bonus exploration only — never affects official course progress">
          <div class="dw-pill"><b>${s.total}</b> DASHBOARDS</div>
          <div class="dw-pill"><b>${s.viewed}</b> EXPLORED</div>
          <div class="dw-pill"><b>${s.downloaded}</b> DOWNLOADED</div>
          <div class="dw-pill"><b>${s.bookmarked}</b> BOOKMARKED</div>
        </div>
      </div>

      ${howToUse()}
      ${whatYouLearn()}
      ${aiLabNote()}
      ${challengeNote()}

      <div class="dw-licence">External dashboard resources are provided for learning and inspiration. Please review the original resource provider's licensing and usage terms before redistributing or commercially using any template.</div>
    </aside>`;
  }

  /* large pinned "how to use" intro note */
  function howToUse() {
    return `
    <section class="dw-news-sec">
      <div class="dw-pn-h">HOW TO USE THIS WALL</div>
      <ol class="dw-pn-list">
        <li><b>01 — PICK A DASHBOARD</b><span>Choose a business use case that interests you.</span></li>
        <li><b>02 — LOOK BEFORE YOU DOWNLOAD</b><span>Study the KPI hierarchy, charts and layout.</span></li>
        <li><b>03 — ASK WHY</b><span>Why were these KPIs selected? Why was this chart used?</span></li>
        <li><b>04 — DOWNLOAD &amp; EXPLORE</b><span>Open the actual Excel workbook.</span></li>
        <li><b>05 — REVERSE ENGINEER</b><span>Find the data → formulas → KPIs → charts.</span></li>
        <li><b>06 — USE AI</b><span>Ask AI to explain, critique and improve the dashboard.</span></li>
      </ol>
      <div class="dw-formula">DATA → KPI → VISUAL → INSIGHT → ACTION</div>
    </section>`;
  }

  /* WHAT YOU WILL LEARN — concise outcomes checklist */
  function whatYouLearn() {
    const items = [
      "KPI design and metric hierarchy",
      "Different dashboard layouts and styles",
      "Business use cases across industries",
      "Data → Insight → Decision flow",
      "How to communicate information visually",
      "How AI can improve dashboards"
    ];
    return `
    <section class="dw-news-sec">
      <div class="dw-pn-h">WHAT YOU WILL LEARN</div>
      <ul class="dw-learn-list">
        ${items.map(t => `<li>${ICON.check || "✓"} ${esc(t)}</li>`).join("")}
      </ul>
    </section>`;
  }

  function cardHTML(d, i) {
    const bm = isBookmarked(d.id);
    const labels = [NOTE_LABELS[i % NOTE_LABELS.length], NOTE_LABELS[(i + 3) % NOTE_LABELS.length]];
    return `
    <article class="dw-paper ${isViewed(d.id) ? "seen" : ""}" ${cardStyle(i)} data-cat="${esc((d.category||"").toLowerCase())}" data-dw-id="${d.id}">
      <span class="dw-pin" data-cat="${esc((d.category||"").toLowerCase())}"></span>
      <button class="dw-bm ${bm ? "on" : ""}" data-dw-bm="${d.id}" title="Bookmark this dashboard" aria-label="Bookmark">${ICON.star}</button>
      <div class="dw-paper-top">
        <span class="dw-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="dw-cat">${esc(d.category)}</span>
      </div>
      <div class="dw-imgwrap" style="aspect-ratio:${previewRatio(d).toFixed(4)}">
        <span class="dw-sheet">PREVIEW · ${esc(d.sheet || "Dashboard")}</span>
        ${d.updated ? `<span class="dw-updated">UPDATED</span>` : ""}
        <img class="dw-img" src="${esc(LMS.assetUrl(d.preview))}" alt="${esc(d.title)} preview" loading="lazy"
             onerror="this.parentNode.classList.add('imgerr');this.replaceWith(Object.assign(document.createElement('div'),{className:'dw-imgmiss',textContent:'EXCEL PREVIEW UNAVAILABLE'}));">
        ${isViewed(d.id) ? `<span class="dw-seen">EXPLORED</span>` : ""}
      </div>
      <div class="dw-paper-body">
        <h3 class="dw-title-sm">${esc(d.title)}</h3>
        <p class="dw-learn">“${esc(d.learn)}”</p>
        <span class="dw-tag">${esc(labels[0])}</span>
      </div>
      <div class="dw-actions">
        <button class="dw-btn dw-explore" data-dw-open="${d.id}">EXPLORE</button>
        <button class="dw-btn dw-dl" data-dw-dl="${d.id}">DOWNLOAD</button>
      </div>
    </article>`;
  }

  /* ----- study modal: two-column STUDY DESK (dashboard LEFT, learning RIGHT) ----- */
  function modalHTML() {
    const d = modalId ? get(modalId) : null;
    if (!d) return `<div class="dw-modal" id="dwModal" hidden></div>`;
    const idx = DASHBOARDS.indexOf(d);
    const study = (d.study || []).map((s, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b> — ${esc(s)}</li>`).join("");
    return `
    <div class="dw-modal on" id="dwModal">
      <div class="dw-modal-scrim" data-dw-close></div>
      <div class="dw-modal-card" role="dialog" aria-modal="true">
        <button class="dw-modal-x" data-dw-close aria-label="Close">${ICON.close || "✕"}</button>
        <div class="dw-modal-pin"></div>
        <div class="dw-modal-head">
          <span class="dw-num">${String(idx + 1).padStart(2, "0")}</span>
          <div>
            <h2>${esc(d.title)} ${d.updated ? `<span class="dw-updated dw-updated--lg">UPDATED</span>` : ""}</h2>
            <div class="dw-cat">${esc(d.category)}</div>
          </div>
          <button class="dw-bm big ${isBookmarked(d.id) ? "on" : ""}" data-dw-bm="${d.id}" title="Bookmark">${ICON.star}</button>
        </div>

        <div class="dw-modal-body">
        <div class="dw-modal-grid">
          <div class="dw-modal-left">
            <div class="dw-modal-imgwrap">
              <img class="dw-modal-img" src="${esc(LMS.assetUrl(d.preview))}" alt="${esc(d.title)} preview"
                   data-dw-zoom="${d.id}" title="Open full preview"
                   onerror="this.parentNode.classList.add('imgerr');this.outerHTML='<div class=\\'dw-imgmiss\\'>EXCEL PREVIEW UNAVAILABLE</div>';">
              ${isViewed(d.id) ? `<span class="dw-seen">EXPLORED</span>` : ""}
              <span class="dw-zoom-hint">🔍 Click to enlarge</span>
            </div>
          </div>
          <div class="dw-modal-right">
            <div class="dw-sec"><span class="dw-sec-h">CATEGORY</span>${esc(d.category)}</div>
            <div class="dw-sec"><span class="dw-sec-h">WHAT TO STUDY</span><ul class="dw-study">${study}</ul></div>
            <div class="dw-sec"><span class="dw-sec-h">BUSINESS QUESTION</span>“${esc(d.desc)}”</div>
            <div class="dw-sec"><span class="dw-sec-h">LOOK FOR</span>
              <ol class="dw-look">
                <li>KPI cards</li><li>trend charts</li><li>comparisons</li><li>filters</li><li>visual hierarchy</li>
              </ol>
            </div>
            <div class="dw-sec dw-file"><span class="dw-sec-h">WORKBOOK</span>${esc(d.file.split("/").pop())}</div>
          </div>
        </div>
        </div>

        <div class="dw-modal-nav">
          <button class="dw-btn ghost" data-dw-prev>← Previous</button>
          <button class="dw-btn dw-dl big" data-dw-dl="${d.id}">DOWNLOAD EXCEL</button>
          <button class="dw-btn ghost" data-dw-next>Next →</button>
        </div>
        <div class="dw-modal-foot">Use the dashboard as a study object — then give the workbook to AI to explain, critique and improve it.</div>
      </div>
    </div>`;
  }

  /* ----- full-size preview lightbox (spec §8) ----- */
  function lightboxHTML() {
    const d = lightId ? get(lightId) : null;
    if (!d) return `<div class="dw-lightbox" id="dwLightbox" hidden></div>`;
    const list = visible();
    const idx = list.findIndex(x => x.id === d.id);
    return `
    <div class="dw-lightbox on" id="dwLightbox">
      <div class="dw-light-scrim" data-dw-light-close></div>
      <div class="dw-light-card" role="dialog" aria-modal="true">
        <div class="dw-light-bar">
          <div class="dw-light-title">${esc(d.title)} <span class="dw-light-src">ACTUAL EXCEL · ${esc(d.sheet || "Dashboard")}</span></div>
          <div class="dw-light-tools">
            <button class="dw-lbtn" data-dw-light-zoom="out" aria-label="Zoom out">−</button>
            <span class="dw-light-zv">${Math.round(zoom * 100)}%</span>
            <button class="dw-lbtn" data-dw-light-zoom="in" aria-label="Zoom in">+</button>
            <button class="dw-lbtn" data-dw-light-zoom="fit" aria-label="Fit to screen">FIT</button>
            <button class="dw-lbtn" data-dw-light-prev aria-label="Previous dashboard">←</button>
            <button class="dw-lbtn" data-dw-light-next aria-label="Next dashboard">→</button>
            <button class="dw-lbtn dw-lclose" data-dw-light-close aria-label="Close">✕</button>
          </div>
        </div>
        <div class="dw-light-stage" data-dw-light-stage>
          <img class="dw-light-img" src="${esc(LMS.assetUrl(d.preview))}" alt="${esc(d.title)} preview"
               style="transform:scale(${zoom})"
               onerror="this.parentNode.classList.add('imgerr');this.outerHTML='<div class=\\'dw-imgmiss\\'>EXCEL PREVIEW UNAVAILABLE</div>';">
        </div>
        <div class="dw-light-foot">${idx + 1} / ${list.length} · ${esc(d.title)} — real Excel render, not a redrawn graphic.</div>
      </div>
    </div>`;
  }

  /* ----- AI Lab + Challenge pinned notes ----- */
  function aiLabNote() {
    return `
    <div class="dw-pinnote dw-ai" style="--paper:cream;--rot:1.1deg">
      <span class="dw-pin"></span>
      <div class="dw-pn-h dw-ai-h">🤖 AI DASHBOARD LAB</div>
      <div class="dw-ai-sub">“DON'T JUST LOOK. ASK AI.”</div>
      <ol class="dw-ai-list">
        <li>Explain the dashboard structure.</li>
        <li>Identify the business audience.</li>
        <li>Identify all major KPIs.</li>
        <li>Explain what each chart is communicating.</li>
        <li>Identify the likely source data.</li>
        <li>Identify formulas / calculations.</li>
        <li>Identify weak or unnecessary visuals.</li>
        <li>Recommend improvements.</li>
        <li>Suggest additional KPIs.</li>
        <li>Rewrite the dashboard for an executive audience.</li>
        <li>Generate the business story from the data.</li>
        <li>Suggest actions management should take.</li>
      </ol>
      <button class="dw-btn dw-copy" data-dw-copy-ai>${ICON.copy || "⧉"} COPY AI PROMPT</button>
    </div>`;
  }
  function challengeNote() {
    return `
    <div class="dw-pinnote dw-ch" style="--paper:cream;--rot:-1.3deg">
      <span class="dw-pin"></span>
      <div class="dw-pn-h dw-ch-h">🎯 BONUS CHALLENGE</div>
      <p class="dw-ch-lead">Choose ANY ONE of the 21 dashboards. Then answer:</p>
      <ol class="dw-ch-list">
        <li>Who is the user?</li>
        <li>What business problem does it solve?</li>
        <li>What are the top 5 KPIs?</li>
        <li>What should the user notice first?</li>
        <li>Which visual communicates the story best?</li>
        <li>What would you remove?</li>
        <li>What would you add?</li>
        <li>How would AI improve it?</li>
        <li>What decision should this dashboard enable?</li>
        <li>Build your own improved version.</li>
      </ol>
      <button class="dw-btn dw-start" data-dw-challenge>START CHALLENGE</button>
    </div>`;
  }

  /* ----- public actions used by App.bind() ----- */
  function openModal(id) { modalId = id; markViewed(id); }
  function closeModal() { modalId = null; }
  function openLightbox(id) { lightId = id; zoom = 1; markViewed(id); }
  function closeLightbox() { lightId = null; }
  function setZoom(v) { zoom = Math.max(0.25, Math.min(4, +(v.toFixed(2)))); }
  function getZoom() { return zoom; }
  function step(dir) {
    const list = visible();
    const cur = modalId ? list.findIndex(d => d.id === modalId) : -1;
    if (cur === -1) { modalId = list[0] && list[0].id; }
    else { const n = (cur + dir + list.length) % list.length; modalId = list[n].id; }
    if (modalId) markViewed(modalId);
    // keep the lightbox in sync if it is open
    if (lightId && cur !== -1) {
      const li = list.findIndex(d => d.id === lightId);
      const n = (li + dir + list.length) % list.length;
      lightId = list[n].id;
    }
  }

  /* board + progress fragments (used by app.js for in-place refresh) */
  function boardHTML() {
    const cards = visible().map((d, i) => cardHTML(d, DASHBOARDS.indexOf(d))).join("");
    return cards || `<div class="dw-empty">No dashboards match your filter / search.</div>`;
  }
  function filtersHTML() {
    return DASHBOARD_FILTERS.map(f =>
      `<button class="dw-f ${f.id === filter ? "on" : ""}" data-dw-filter="${f.id}">${esc(f.label)}</button>`).join("");
  }
  function progressHTML() {
    const s = stats();
    return `
      <div class="dw-pill"><b>${s.total}</b> DASHBOARDS</div>
      <div class="dw-pill"><b>${s.viewed}</b> EXPLORED</div>
      <div class="dw-pill"><b>${s.downloaded}</b> DOWNLOADED</div>
      <div class="dw-pill"><b>${s.bookmarked}</b> BOOKMARKED</div>`;
  }

  /* bottom gallery status strip (spec §13) */
  function statusStrip(s) {
    return `
    <div class="dw-status">
      <div class="dw-status-pills">
        <span class="dw-sp">👁 ${s.total} DASHBOARDS</span>
        <span class="dw-sp">🔎 ${s.viewed} EXPLORED</span>
        <span class="dw-sp">⬇ ${s.downloaded} DOWNLOADED</span>
        <span class="dw-sp">🔖 ${s.bookmarked} BOOKMARKED</span>
      </div>
      <div class="dw-status-tag">Keep exploring • Keep learning! ★</div>
    </div>`;
  }

  return {
    render, openModal, closeModal, openLightbox, closeLightbox, setZoom, getZoom, step, setFilter, setQuery, markDownloaded, toggleBookmark,
    isBookmarked, isViewed, isDownloaded, stats, get, visible, boardHTML, filtersHTML, progressHTML, modalHTML, lightboxHTML, mountOverlays,
    AI_PROMPT
  };
})();

/* export the render entry the app calls for view === "bonus" */
function renderBonusWall() { return Bonus.render(); }
