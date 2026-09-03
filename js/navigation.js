/* ===== SIDEBAR NAVIGATION — generated entirely from the registry ===== */

const Nav = (() => {
  let mode = "path";                 // "path" | "reference"
  const openSteps = new Set();       // no step expanded by default — chapters show labels only (undrilled)
  const openGroups = new Set();      // reference groups expanded by title
  const openLevels = new Set();         // all levels collapsed by default — sidebar shows chapter/level labels only (undrilled)

  const setMode = m => { mode = m; render(); };
  const getMode = () => mode;

  function openStep(n, exclusive) {
    if (exclusive) openSteps.clear();
    openSteps.add(Number(n));
  }
  function openGroup(name) { openGroups.add(name); }

  function render() {
    const nav  = document.getElementById("nav");
    const foot = document.getElementById("navFoot");
    document.querySelectorAll(".mode").forEach(b =>
      b.classList.toggle("on", b.dataset.mode === mode));

    nav.innerHTML = mode === "path" ? navPath() : navReference();
    nav.scrollTop = 0;   /* ensure first level (L1) is always visible at top — prevents scroll offset clipping */

    const cp = LMS.courseProgress();
    foot.innerHTML = mode === "path"
      ? `<b style="color:var(--g-700)">${cp.available}</b> of ${cp.total} visual lessons published`
      : `<b style="color:var(--g-700)">${LMS.allReferenceGroups().reduce((n, g) => n + g.topics.length, 0)}</b> reference sections`;
  }

  /* ---- LEVEL CURRICULUM (the single sidebar nav — holds every topic) ---- */
  function navPath() {
    const active = App.state.topicId;
    const selLevel = App.state.level;

    /* render a step's topics as plain rows — no level/section chrome, no roadmap nav link.
       Level 5 (AI-Powered Professional) gets 01-05 numbering + an AI badge; other levels stay clean. */
    function lessonRows(s, l5, startIdx) {
      const topics = LMS.stepTopics(s.step);
      return `
        ${topics.map((t, i) => {
          const n = startIdx + i;
          const num = String(n + 1).padStart(2, "0");
          const aiBadge = l5 ? `<span class="lvl-badge-mini ai">AI</span>` : "";
          return `<button class="topic ${t.id === active ? "active" : ""}" title="${esc(t.title)}" data-goto-topic="${esc(t.id)}">
            <span class="dot ${t.isCompleted ? "completed" : t.hasLesson ? "available" : ""}"></span>
            ${l5 ? `<span class="topic-num">${num}</span>` : ""}
            ${aiBadge}
            <span class="topic-title">${esc(t.title)}</span>
            ${t.isBookmarked ? `<span class="bm">${ICON.star}</span>` : ""}
          </button>`;
        }).join("")}`;
    }

    const levelsBlock = LMS.allLevels().map(lv => {
      const lp = LMS.levelProgress(lv.id);
      const steps = LMS.stepsOfLevel(lv.id);
      const isSel = selLevel === lv.id;        // selection only HIGHLIGHTS (.sel) — never forces open
      const isOpen = openLevels.has(lv.id);    // expansion controlled purely by the chevron toggle
      const n = steps.length;
      const isL5 = lv.id === "level-5";
      /* flat ordered topic list across the level, for 01..N numbering */
      const lvlTopics = [];
      steps.forEach(s => LMS.stepTopics(s.step).forEach(t => lvlTopics.push(t)));
      const status = lv.future ? "Coming Soon"
                  : (n ? `${n} Step${n>1?"s":""} · ${lp.total} Topics · ${lp.available} Lessons` : "Coming Soon");
      return `
      <div class="lvl ${isOpen ? "open" : ""} ${isSel ? "sel" : ""} lvl-${lv.color}">
        <button class="lvl-hd" type="button" data-toggle-level="${lv.id}" aria-expanded="${isOpen}" aria-label="Expand ${esc(lv.name)}">
          <span class="lvl-badge">L${lv.num}</span>
          <span class="lvl-meta">
            <span class="lvl-name">LEVEL ${lv.num} — ${esc(lv.name.toUpperCase())}</span>
            <span class="lvl-sub">${esc(lv.subtitle)}</span>
          </span>
          <span class="lvl-toggle" aria-hidden="true">${ICON.chevron}</span>
        </button>
        ${isOpen ? `
        <div class="lvl-body">
          <div class="lvl-stats"><span>${status}</span></div>
          ${steps.length ? steps.map(s => {
            const idx = lvlTopics.findIndex(t => t.id === (LMS.stepTopics(s.step)[0] && LMS.stepTopics(s.step)[0].id));
            if (isL5) {
              /* Level 5: each step IS one top-level topic — render it ONCE as a
                 clickable row. No module header, so no duplicate child row. */
              return `<div class="lvl-step lvl-step-flat">${lessonRows(s, isL5, idx)}</div>`;
            }
            return `<div class="lvl-step">
              <div class="lvl-mod" title="${esc(s.section)}"><span class="lvl-mod-name">${esc(s.levelLabel || s.section)}</span></div>
              ${lessonRows(s, isL5, idx)}
            </div>`;
          }).join("") : `<div class="lvl-future">Future Expert curriculum — coming soon.</div>`}
        </div>` : ""}
      </div>`;
    }).join("");

    const refLink = `
      <div class="nav-sec-label">MORE</div>
      <button class="nav-ref-link" data-goto-gallery title="Browse all topics in one grid">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        All Topics
      </button>
      <button class="nav-ref-link" data-goto-reference title="Open the Excel Reference library">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        Excel Reference
      </button>`;

    /* Level 5 BONUS — single pinned item, no per-topic list (avoids duplication) */
    const bonusLink = `
      <div class="nav-sec-label">LEARN • PRACTICE • BUILD</div>
      <button class="nav-bonus ${App.state.view === "bonus" ? "active" : ""}" data-goto-bonus title="Excel Dashboard Inspiration Wall">
        <span class="nav-bonus-star">★</span>
        <span class="nav-bonus-txt">Excel Dashboard<br>Inspiration Wall</span>
      </button>
      <button class="nav-bonus ${App.state.view === "templates" ? "active" : ""}" data-goto-templates title="Free Template Bundles (Excel • Word • PowerPoint)">
        <span class="nav-bonus-star">📦</span>
        <span class="nav-bonus-txt">Free Template<br>Bundles</span>
      </button>`;

    return levelsBlock + bonusLink + refLink;
  }

  /* ---- MODE B: Excel reference (preserved ribbon navigation, expandable) ---- */
  function navReference() {
    const active = App.state.topicId;
    /* group titles as required: EXCEL REFERENCE / ADVANCED EXCEL / MORE RESOURCES */
    const LABEL = {
      "Excel Reference": "EXCEL REFERENCE",
      "Advanced Excel": "ADVANCED EXCEL",
      "Dashboards": "DASHBOARDS",
      "Practice & Guidance": "MORE RESOURCES"
    };

    return LMS.allReferenceGroups().map(g => {
      const hasActive = g.topics.some(t => t.id === active);
      const isOpen = openGroups.has(g.group) || hasActive || g.group === "Excel Reference";
      const topics = g.topics.map(raw => LMS.getTopic(raw.id));
      const avail = topics.filter(t => t.hasLesson).length;

      return `
      <div class="nav-title">${esc(LABEL[g.group] || g.group.toUpperCase())}</div>
      <div class="step ${isOpen ? "open" : ""}">
        <button class="step-hd" data-toggle-group="${esc(g.group)}">
          <span class="step-num">${g.topics.length}</span>
          <span class="step-meta"><span class="step-name">${esc(g.group)}</span></span>
          <span class="step-count ${avail ? "has" : ""}">${avail} / ${g.topics.length}</span>
          ${ICON.chevron}
        </button>
        <div class="topics"><div class="topics-inner">
          ${topics.map(t => `
            <button class="topic ${t.id === active ? "active" : ""}" data-goto-topic="${esc(t.id)}" title="${esc(t.title)}">
              <span class="dot ${t.isCompleted ? "completed" : t.hasLesson ? "available" : ""}"></span>
              <span class="topic-title">${esc(t.title)}</span>
              ${t.isBookmarked ? `<span class="bm">${ICON.star}</span>` : ""}
            </button>`).join("")}
        </div></div>
      </div>`;
    }).join("");
  }

  return { render, setMode, getMode, openStep, openGroup, openSteps, openGroups, openLevels };
})();
