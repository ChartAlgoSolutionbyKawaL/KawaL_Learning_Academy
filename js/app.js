/* ===== APP ROUTER / CONTROLLER =====
   Views: dashboard | step | topic | reference | bookmarks
   Routing is data-driven via topic IDs from the registry. */

/* Learning Academy products — parent-level navigation. Excel Mastery is the only
   ACTIVE track; the other five are "coming soon" and render a polished in-shell
   Coming Soon state (no broken pages, no second nav system).
   Declared at module scope so renderProductComingSoon() (in dashboard.js) can read it. */
const PRODUCTS = [
  { id:"excel",      name:"Excel Mastery",   status:"active", color:"g",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/><path d="M13 13h4M13 16h4M13 10h1" opacity=".7"/></svg>',
    blurb:"A practical Excel learning path from fundamentals through reporting, visualization and automation." },
  { id:"powerbi",    name:"Power BI",        status:"soon",   color:"b",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M12 15l-4 5h8z"/><circle cx="12" cy="21" r="1"/></svg>',
    blurb:"A practical Power BI learning path covering:", points:["Data Modeling","Power Query","DAX","Dashboards"] },
  { id:"sql",        name:"SQL",             status:"soon",   color:"t",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
    blurb:"Query and manage data like a pro:", points:["SELECT & JOINs","Aggregations","Window Functions","Stored Procedures"] },
  { id:"data",       name:"Data Analytics",  status:"soon",   color:"p",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-8"/></svg>',
    blurb:"Turn raw data into decisions:", points:["Exploratory Analysis","Visual Storytelling","Statistics Basics","Insight Reporting"] },
  { id:"auto",       name:"Automation",      status:"soon",   color:"gold",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    blurb:"Work smarter by automating the repetitive:", points:["Power Automate","Macros & Scripts","Workflow Design","RPA Basics"] },
  { id:"mis",        name:"Corporate MIS",    status:"soon",   color:"o",
    icon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M9 3v18"/><circle cx="15" cy="15" r="2.4"/></svg>',
    blurb:"Build management information systems for the business:", points:["MIS Frameworks","KPI Design","Automated Reports","Leadership Dashboards"] }
];

const App = (() => {
  const state = { view: "dashboard", stepNo: null, topicId: null, practiceFor: null, level: null, product: "excel" };
  const ZOOM_KEY = "excelMastery.pageZoom";

  const $ = id => document.getElementById(id);

  /* ---------- breadcrumb (derived, clickable) — ResolvrPro › Learning Academy › Excel Mastery › ... ---------- */
  function crumbs() {
    const c = $("crumb");
    const brand = LMS.meta.brand, academy = "Learning Academy", course = LMS.meta.course;
    let parts;
    if (state.view === "topic") {
      const bc = LMS.breadcrumb(state.topicId).slice(1);   /* drop leading course (already in prefix) */
      const tid = state.topicId, step = LMS.getTopic(tid).step;
      parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],
               [bc[0],"step:"+step],[bc[1],"ref"],[bc[2],"topic:"+tid]];
      /* when the practice drawer is open, append the practice workbook sheet name */
      if (state.practiceFor) {
        const pt = LMS.getTopic(state.practiceFor);
        const sheet = pt && pt.practiceMeta && pt.practiceMeta.sheet ? pt.practiceMeta.sheet : "Practice";
        parts.push([`📊 Practice — ${sheet}`, "practice:"+state.practiceFor]);
      }
    } else if (state.view === "step") {
      const s = LMS.getStep(state.stepNo);
      parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],[`Step ${s.code}`,"step:"+s.step],[s.section,"ref"]];
    } else if (state.view === "reference") parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],["Excel Reference","ref"]];
    else if (state.view === "bookmarks")  parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],["Bookmarks","book"]];
    else if (state.view === "bonus")     parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],[`LEVEL 5 — AI-POWERED PROFESSIONAL`,"level:level-5"],[`★ Excel Dashboard Inspiration Wall`,"bonus"]];
    else if (state.view === "templates")  parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],[`LEVEL 5 — BONUS`,"level:level-5"],[`📦 Free Template Bundles`,"templates"]];
    else                                  parts = [[brand,"dash"],[academy,"dash"],[course,"dash"],["Dashboard","dash"]];

    /* Level layer: when a level is active, insert it after "Excel Mastery" */
    if (state.level) {
      const lv = LMS.getLevel(state.level);
      if (lv) {
        parts = [parts[0],parts[1],parts[2], [`LEVEL ${lv.num} — ${lv.name}`,"level:"+lv.id], ...parts.slice(3)];
      }
    }

    c.innerHTML = parts.map((p, i) =>
      i === parts.length - 1
        ? `<b>${esc(p[0])}</b>`
        : `<a class="bc" data-bc="${p[1]}">${esc(p[0])}</a>`
    ).join(` <i>›</i> `);
  }

  /* ---------- progress header (computed, never hard-coded) ---------- */
  function progress() {
    const cp = LMS.courseProgress(state.product);
    const prod = PRODUCTS.find(x => x.id === state.product);
    const name = prod ? prod.name : "Course";
    const pn = $("progName");
    if (pn) pn.textContent = name;
    $("progPct").textContent = cp.pctCompleted + "%";
    $("progBar").style.width = cp.pctCompleted + "%";
    const pp = $("progPct");
    if (pp && pp.parentNode) pp.parentNode.dataset.tip = name + " Progress — " + cp.completed + " / " + cp.total + " topics completed";
  }

  /* ---------- header state: active links + Download target ---------- */
  function header() {
    $("btnDashboard").classList.toggle("on", state.view === "bonus");
    $("btnBookmarks").classList.toggle("on", state.view === "bookmarks");
    const bm = $("bmCount");
    if (bm) bm.textContent = LMS.bookmarks(state.product).length;

    const dl = $("btnDownload");
    const t = state.view === "topic" ? LMS.getTopic(state.topicId) : null;
    if (t && t.hasLesson) {
      dl.setAttribute("href", t.lessonImageUrl);
      dl.setAttribute("download", "");
      dl.removeAttribute("aria-disabled");
      dl.style.opacity = "";
      dl.style.pointerEvents = "";
      dl.dataset.tip = "Download this lesson image";
    } else {
      dl.removeAttribute("href");
      dl.style.opacity = ".4";
      dl.style.pointerEvents = "none";
      dl.dataset.tip = "Open an available lesson to download";
    }
  }

  /* ---------- render ---------- */
  function render() {
    const c = $("wrap");
    const content = $("content");
    /* topic (lesson) view uses the full right-side body — no 1320px cap */
    content.classList.toggle("full", state.view === "topic");
    content.classList.toggle("is-dash", state.view === "dashboard" || state.view === "bookmarks" || state.view === "bonus" || state.view === "gallery" || state.view === "templates" || state.view === "step" || state.view === "chapter" || state.view === "practice_hub");
    switch (state.view) {
      case "topic":       c.innerHTML = renderTopic(state.topicId); Viewer.init(state.topicId, state.topicPage || 0); state.topicPage = 0; break;
      case "step":        c.innerHTML = renderStep(state.stepNo);   break;
      case "chapter":     c.innerHTML = renderChapterOverview(state.topicId); break;
      case "practice_hub": c.innerHTML = renderPracticeHub(state.stepNo); break;
      case "reference":   c.innerHTML = renderReferenceHome();      break;
      case "bookmarks":   c.innerHTML = renderBookmarks();          break;
      case "bonus":       c.innerHTML = renderBonusWall(); Bonus.mountOverlays(); break;
      case "gallery":     c.innerHTML = renderTopicGallery(); break;
      case "templates":   c.innerHTML = renderTemplates(); break;
      default:
        c.innerHTML = state.product === "excel"
          ? renderDashboard()
          : renderProductComingSoon(state.product);
    }
    /* practice now lives in the right-side drawer (toggled from the toolbar) */
    $("content").scrollTop = 0;
    crumbs();
    progress();
    header();
    Nav.render();
  }

  /* ---------- mobile nav ---------- */
  function closeNav() { document.body.classList.remove("nav-open"); $("scrim").classList.remove("on"); }
  function toggleNav() {
    const on = document.body.classList.toggle("nav-open");
    $("scrim").classList.toggle("on", on);
  }

  /* ---------- navigation actions ---------- */
  function goDashboard()      { state.view = "dashboard"; state.topicId = null; state.stepNo = null; closeNav(); render(); }
  function goReference()      { state.view = "reference"; state.topicId = null; render(); }
  function goBookmarks()      { state.view = "bookmarks"; state.topicId = null; closeNav(); render(); }
  function goBonus()          {
    state.view = "bonus"; state.topicId = null; state.stepNo = null; state.level = null;
    closeNav(); render();
  }
  function goGallery()        {
    state.view = "gallery"; state.topicId = null; state.stepNo = null;
    closeNav(); render();
  }
  function goTemplates()      {
    state.view = "templates"; state.topicId = null; state.stepNo = null; state.level = null;
    closeNav(); render();
  }
  function setProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    state.product = id;
    LMS.setProduct(id);   /* keep learner state scoped to the active track */
    state.view = "dashboard"; state.topicId = null; state.stepNo = null; state.level = null;
    renderProductTabs();
    render();
    const cur = document.querySelector(".product-tab.current");
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function goStep(n) {
    const t = LMS.stepLessonTopic(n);
    if (t) { goTopic(t.id); return; }            /* step has a roadmap Lesson -> open it */
    state.view = "step"; state.stepNo = Number(n); state.topicId = null;
    Nav.setMode("path"); Nav.openStep(n, true);
    const step = LMS.getStep(n);
    if (step) {
      const lv = LMS.allLevels().find(l => l.name === step.level);
      if (lv) Nav.openLevels.add(lv.id);
    }
    render();
  }

  /* Level curriculum layer: select a level (keeps existing step/topic navigation) */
  function setLevel(id) {
    state.level = (state.level === id) ? null : id;   /* toggle off if re-clicked */
    Nav.render();
    header();
  }
  function goLevel(id) {
    if (!id) { state.level = null; Nav.render(); header(); return; }   /* All Levels */
    const lv = LMS.getLevel(id);
    if (!lv) return;
    state.level = id;
    Nav.openLevels.add(id);            /* Continue / View expands the level in the sidebar */
    Nav.render(); header();            /* re-render so the toggle reflects the open state */
    /* jump to the level's first assigned step (or stay on dashboard for future L5) */
    const steps = LMS.stepsOfLevel(id);
    if (steps.length) { goStep(steps[0].step); }
    else { state.view = "dashboard"; state.topicId = null; closeNav(); render(); }
  }

  /* THE core route: topic ID -> metadata -> lesson image */
  function goTopic(id, page) {
    const t = LMS.getTopic(id);
    if (!t) return;
    LMS.setLastPosition(state.product, id);   /* per-track last position */
    LMS.pushRecent(state.product, id);   /* per-track recently-viewed rail */
    if (page != null) state.topicPage = Number(page);   /* bookmark return to a page */
    state.view = "topic"; state.topicId = id;
    const step = LMS.getStep(t.step);
    if (step) {
      const lv = LMS.allLevels().find(l => l.name === step.level);
      if (lv) Nav.openLevels.add(lv.id);
    }
    if (t.isStepLesson) {                        /* step-level roadmap lesson */
      if (Nav.getMode() !== "path") Nav.setMode("path");
      Nav.openStep(t.step);
      closeNav(); render(); return;
    }
    if (t.mode === "learning_path") {
      state.stepNo = t.step;
      if (Nav.getMode() !== "path") Nav.setMode("path");
      Nav.openStep(t.step);
    } else {
      if (Nav.getMode() !== "reference") Nav.setMode("reference");
      Nav.openGroup(t.section);
    }
    closeNav();
    render();
  }

  /* ---------- page zoom ----------
     Scales the whole UI via the --pz custom property (CSS `zoom` on <body>).
     Default 80%. Persisted per learner. */
  const PZ = (() => {
    const STEPS = [50, 60, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];
    const DEFAULT = 80;
    let pct = DEFAULT;

    function paint() {
      document.documentElement.style.setProperty("--pz", pct / 100);
      const v = $("pzVal");
      if (v) v.textContent = pct + "%";
      const o = $("pzOut"), i = $("pzIn");
      if (o) o.disabled = pct <= STEPS[0];
      if (i) i.disabled = pct >= STEPS[STEPS.length - 1];
      try { localStorage.setItem(ZOOM_KEY, String(pct)); } catch (e) {}
    }

    function set(v) {
      pct = Math.min(STEPS[STEPS.length - 1], Math.max(STEPS[0], Math.round(v)));
      paint();
    }
    function step(dir) {
      const i = STEPS.findIndex(s => dir > 0 ? s > pct : s >= pct);
      if (dir > 0) set(i === -1 ? pct : STEPS[i]);
      else set(i <= 0 ? pct : STEPS[i - 1]);
    }
    function reset() { set(DEFAULT); }

    function load() {
      let saved = null;
      try { saved = localStorage.getItem(ZOOM_KEY); } catch (e) {}
      const n = parseInt(saved, 10);
      set(Number.isFinite(n) ? n : DEFAULT);
    }

    return { load, step, reset, set, get: () => pct, DEFAULT, STEPS };
  })();

  /* ---------- global search ---------- */
  const Search = (() => {
    let sel = -1, items = [];

    function show(q) {
      const box = $("results");
      items = LMS.search(q); sel = -1;
      if (!q || q.trim().length < 2) { box.classList.remove("on"); box.innerHTML = ""; return; }
      box.innerHTML = items.length
        ? items.map((r, i) => `
            <div class="res" data-res="${i}">
              <div style="flex:1;min-width:0">
                <div class="res-t">${esc(r.title)}</div>
                <div class="res-c">${esc(r.context)}${r.kind === "step" ? " · Step overview" : ""}</div>
              </div>
              ${r.status ? `<span class="badge b-${r.status}">${esc(LMS.statusLabel(r.status))}</span>` : ""}
              ${r.kind && r.kind !== "topic" && r.kind !== "step" ? `<span class="res-kind res-kind-${r.kind}">${esc(r.kind)}</span>` : ""}
            </div>`).join("")
        : `<div class="res-empty">
             <div class="res-empty-h">No results for "${esc(q)}"</div>
             <div class="res-empty-t">Try a topic name (e.g. <button class="res-sug" data-res-sug="SUM">SUM</button>, <button class="res-sug" data-res-sug="dashboard">dashboard</button>, <button class="res-sug" data-res-sug="budget">budget</button>) or browse the <button class="res-sug" data-res-sug="__gallery">All Topics</button> grid.</div>
           </div>`;
      box.classList.add("on");
    }

    function hide() { $("results").classList.remove("on"); }

    function open(i) {
      const r = items[i];
      if (!r) return;
      hide(); $("search").value = "";
      if (r.kind === "step") goStep(r.step);
      else if (r.kind === "dashboard") { goBonus(); Bonus.openModal(r.id); render(); }
      else if (r.kind === "template") { goTemplates(); Templates.openModal(typeof TEMPLATE_BUNDLES !== "undefined" ? TEMPLATE_BUNDLES.find(b => b.id === r.id) : null); render(); }
      else if (r.kind === "practice") { goTopic(r.id); }
      else goTopic(r.id);
    }

    function move(d) {
      if (!items.length) return;
      sel = (sel + d + items.length) % items.length;
      document.querySelectorAll(".res").forEach((el, i) => el.classList.toggle("sel", i === sel));
      const el = document.querySelector(".res.sel");
      if (el) el.scrollIntoView({ block: "nearest" });
    }

    return { show, hide, open, move, current: () => sel };
  })();

  /* ---------- events (delegated — one listener for the whole app) ---------- */
  function bind() {
    document.addEventListener("click", e => {
      const el = t => e.target.closest(t);

      /* breadcrumb links -> route to the matching page */
      const bc = el("[data-bc]");
      if (bc) {
        const tok = bc.dataset.bc;
        if (tok === "dash") goDashboard();
          else if (tok === "book") goBookmarks();
          else if (tok === "ref") goReference();
          else if (tok.startsWith("step:")) goStep(tok.split(":")[1]);
          else if (tok.startsWith("topic:")) goTopic(tok.split(":")[1]);
          else if (tok.startsWith("practice:")) { const id = tok.split(":")[1]; App.openPractice(id); }
          else if (tok.startsWith("level:")) setLevel(tok.split(":")[1]);
          else if (tok === "bonus") goBonus();
          else if (tok === "templates") goTemplates();
        return;
      }

      const topicBtn = el("[data-goto-topic]");
      if (topicBtn && !topicBtn.disabled) { goTopic(topicBtn.dataset.gotoTopic, topicBtn.dataset.page != null ? topicBtn.dataset.page : null); return; }

      const refLink = el("[data-goto-reference]");
      if (refLink) { goReference(); return; }

      const galLink = el("[data-goto-gallery]");
      if (galLink) { goGallery(); return; }

      const stepBtn = el("[data-goto-step]");
      if (stepBtn) { goStep(stepBtn.dataset.gotoStep); return; }

      /* Session 3 chapter overview + practice hub navigation */
      const chNav = el("[data-goto-chapter]");
      if (chNav) { state.view = "chapter"; state.topicId = chNav.dataset.gotoChapter; state.topicPage = 0; render(); return; }
      const hubNav = el("[data-goto-practice-hub]");
      if (hubNav) { state.view = "practice_hub"; state.stepNo = Number(hubNav.dataset.gotoPracticeHub); state.topicId = null; render(); return; }

      const toggle = el("[data-toggle-step]");
      if (toggle) {
        const n = Number(toggle.dataset.toggleStep);
        if (Nav.openSteps.has(n)) { Nav.openSteps.delete(n); Nav.render(); }
        else { Nav.openStep(n); goStep(n); }
        return;
      }

      const track = el("[data-track]");
      if (track) { /* product tab (legacy name) -> switch product */ setProduct(track.dataset.track); return; }

      const notify = el("[data-notify]");
      if (notify) {
        const b = notify; const orig = b.innerHTML;
        b.innerHTML = ICON.check + " We'll notify you";
        b.disabled = true;
        setTimeout(() => { b.innerHTML = orig; b.disabled = false; }, 2200);
        return;
      }

      const prod = el("[data-product]");
      if (prod) { setProduct(prod.dataset.product); return; }

      const lvSel = el("[data-level-select]");
      if (lvSel) { goLevel(lvSel.dataset.levelSelect); return; }

      const lvBtn = el("[data-level]");
      if (lvBtn) { setLevel(lvBtn.dataset.level); return; }

      const lvToggle = el("[data-toggle-level]");
      if (lvToggle) {
        const id = lvToggle.dataset.toggleLevel;
        if (Nav.openLevels.has(id)) Nav.openLevels.delete(id); else Nav.openLevels.add(id);
        Nav.render();
        return;
      }

      /* ===== BONUS: Excel Dashboard Inspiration Wall ===== */
      const bonusNav = el("[data-goto-bonus]");
      if (bonusNav) { goBonus(); return; }

      const tplNav = el("[data-goto-templates]");
      if (tplNav) { goTemplates(); return; }

      const bonusDash = el("[data-goto-bonus-dash]");
      if (bonusDash) {
        const id = bonusDash.dataset.gotoBonusDash;
        goBonus();
        Bonus.openModal(id);
        render();
        return;
      }

      const dwFilt = el("[data-dw-filter]");
      if (dwFilt) {
        Bonus.setFilter(dwFilt.dataset.dwFilter);
        const board = document.getElementById("dwBoard");
        const filters = document.getElementById("dwFilters");
        if (board) board.innerHTML = Bonus.boardHTML();
        if (filters) filters.innerHTML = Bonus.filtersHTML();
        return;
      }

      const dwOpen = el("[data-dw-open]");
      if (dwOpen) { Bonus.openModal(dwOpen.dataset.dwOpen); render(); return; }

      const dwDl = el("[data-dw-dl]");
      if (dwDl) {
        const id = dwDl.dataset.dwDl; const d = Bonus.get(id);
        if (d) {
          Bonus.markDownloaded(id);
          const a = document.createElement("a");
          a.href = LMS.assetUrl(d.file); a.download = ""; a.style.display = "none";
          document.body.appendChild(a); a.click(); a.remove();
          showDwConfirm("✓ Excel workbook ready");
          const prog = document.querySelector(".dw-progress"); if (prog) prog.innerHTML = Bonus.progressHTML();
          // reflect explored/downloaded state on the card if visible
          document.querySelectorAll(`[data-dw-id="${id}"]`).forEach(card => {
            if (Bonus.isViewed(id)) card.classList.add("seen");
          });
        }
        return;
      }

      const dwBm = el("[data-dw-bm]");
      if (dwBm) {
        const id = dwBm.dataset.dwBm; Bonus.toggleBookmark(id);
        document.querySelectorAll(`[data-dw-bm="${id}"]`).forEach(b => b.classList.toggle("on", Bonus.isBookmarked(id)));
        const prog = document.querySelector(".dw-progress"); if (prog) prog.innerHTML = Bonus.progressHTML();
        return;
      }

      const dwPrev = el("[data-dw-prev]");
      if (dwPrev) { Bonus.step(-1); render(); return; }
      const dwNext = el("[data-dw-next]");
      if (dwNext) { Bonus.step(1); render(); return; }
      const dwClose = el("[data-dw-close]");
      if (dwClose) { Bonus.closeModal(); render(); return; }

      const dwCopy = el("[data-dw-copy-ai]");
      if (dwCopy) {
        const txt = Bonus.AI_PROMPT;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(()=>showDwConfirm("✓ AI prompt copied"), ()=>fallbackCopy(txt));
        else fallbackCopy(txt);
        return;
      }
      const dwCh = el("[data-dw-challenge]");
      if (dwCh) { showDwConfirm("Pick a dashboard above, then answer the 10 questions."); return; }

      /* ----- full-size lightbox ----- */
      const dwZoom = el("[data-dw-zoom]");
      if (dwZoom) { Bonus.openLightbox(dwZoom.dataset.dwZoom); render(); return; }
      const dwLightClose = el("[data-dw-light-close]");
      if (dwLightClose) { Bonus.closeLightbox(); render(); return; }
      const dwLightZoom = el("[data-dw-light-zoom]");
      if (dwLightZoom) {
        const z = dwLightZoom.dataset.dwLightZoom;
        const cur = Bonus.getZoom();
        if (z === "in") Bonus.setZoom(cur + 0.25);
        else if (z === "out") Bonus.setZoom(cur - 0.25);
        else Bonus.setZoom(1); // fit
        render(); return;
      }
      const dwLightPrev = el("[data-dw-light-prev]");
      if (dwLightPrev) { Bonus.step(-1); render(); return; }
      const dwLightNext = el("[data-dw-light-next]");
      if (dwLightNext) { Bonus.step(1); render(); return; }


      /* ===== FREE TEMPLATE BUNDLES (Level 5 BONUS) ===== */
      const tplFilter = el("[data-tp-filter]");
      if (tplFilter && tplFilter.closest("#tpPills")) {
        Templates.setFilter(tplFilter.dataset.tpFilter);
        render(); return;
      }
      const tplReq = el("[data-tp-req]");
      if (tplReq) {
        const b = TEMPLATE_BUNDLES.find(x => x.id === tplReq.dataset.tpReq);
        Templates.openModal(b || null); render(); return;
      }
      const tplRequestCTA = el("[data-tp-request]");
      if (tplRequestCTA) { Templates.openModal(null); render(); return; }
      const tplClose = el("[data-tp-close]");
      if (tplClose) { Templates.closeModal(); render(); return; }
      const tplUp = el("[data-tp-up]");
      if (tplUp) { Templates.toggleUpskill(Number(tplUp.dataset.tpUp)); render(); return; }
      const tplPage = el("[data-tp-page]");
      if (tplPage) { Templates.setPage(Number(tplPage.dataset.tpPage)); render(); return; }
      const tplSort = el("#tpSort");
      if (tplSort) { Templates.setSort(tplSort.value); render(); return; }
      const tplSubmit = el("[data-tp-submit]");
      if (tplSubmit) {
        const res = Templates.submit();
        if (!res.ok) { showDwConfirm("⚠ " + res.msg); return; }
        Templates.openWhatsApp();
        Templates.closeModal();
        render();
        showDwConfirm("✓ WhatsApp request opened successfully.");
        return;
      }

      const tg = el("[data-toggle-group]");
      if (tg) {
        const g = tg.dataset.toggleGroup;
        if (Nav.openGroups.has(g)) Nav.openGroups.delete(g); else Nav.openGroup(g);
        Nav.render();
        return;
      }

      const bm = el("[data-bookmark]");
      if (bm) { LMS.toggleBookmark(bm.dataset.bookmark, state.product, Viewer.page()); render(); return; }

      const cm = el("[data-complete]");
      if (cm) { LMS.toggleComplete(cm.dataset.complete); render(); return; }

      const pr = el("[data-practice]");
      if (pr) {
        const id = pr.dataset.practice;
        const open = state.practiceFor !== id;
        state.practiceFor = open ? id : null;
        App.openPractice(open ? id : null);
        return;
      }
      /* Practice guide modal (inside the practice drawer) */
      const pgBtn = el("[data-practice-guide]");
      if (pgBtn) { const m = document.getElementById("prGuide"); if (m) m.hidden = !m.hidden; return; }
      if (el("[data-practice-guide-close]")) { const m = document.getElementById("prGuide"); if (m) m.hidden = true; return; }
      /* Optional "I completed this practice" — records practice completion in the
         same per-track progress record as lesson completion (never force-completes). */
      const mp = el("[data-mark-practice]");
      if (mp) {
        const id = mp.dataset.markPractice;
        const done = LMS.togglePractice(id, state.product);
        mp.textContent = done ? "PRACTICE MARKED ✓" : "I COMPLETED THIS PRACTICE";
        mp.classList.toggle("on", done);
        mp.disabled = done;
        if (done) App.openPractice(null);   /* close drawer once marked */
        return;
      }
      /* FINAL SESSION PROJECT card — manual collapse / show-again toggle */
      const fpTog = el("[data-fp-toggle]");
      if (fpTog) {
        const id = fpTog.dataset.fpToggle;
        const card = document.getElementById(id);
        if (card) { card.hidden = true; card.dataset.collapsed = "1"; }
        const sb = document.getElementById("finalProjShow");
        if (sb) sb.hidden = false;
        return;
      }
      const fpShow = el("[data-fp-show]");
      if (fpShow) {
        const id = fpShow.dataset.fpShow;
        const card = document.getElementById(id);
        if (card) { card.hidden = false; card.dataset.collapsed = ""; }
        fpShow.hidden = true;
        return;
      }

      if (el("#drawerClose") || el("#drawerScrim")) { App.openPractice(null); return; }
      if (el("[data-practice-close]")) { App.openPractice(null); return; }
      if (el("[data-res-sug]")) {
        const sug = el("[data-res-sug]").dataset.resSug;
        Search.hide();
        if (sug === "__gallery") { goGallery(); return; }
        const inp = $("search"); inp.value = sug; Search.show(sug); inp.focus();
        return;
      }

      const vz = el("[data-vz]");
      if (vz) { Viewer.handle(vz.dataset.vz); return; }

      const pg = el("[data-page]");
      if (pg) { Viewer.handlePage(pg.dataset.page); return; }

      const res = el("[data-res]");
      if (res) { Search.open(Number(res.dataset.res)); return; }

      if (el("#btnNav"))   { toggleNav(); return; }
      if (el("#scrim"))    { closeNav(); return; }
      if (el("#btnNavToggle")) { toggleNavPanel(); return; }

      /* ----- LEARNING PATH: bookmark toggle (does NOT open the topic) ----- */
      const bmTog = e.target.closest("[data-bm-toggle]");
      if (bmTog) {
        const id = bmTog.dataset.bmToggle;
        LMS.toggleBookmark(id, state.product, null);
        const on = LMS.getTopic(id).isBookmarked;
        document.querySelectorAll(`[data-bm-toggle="${id}"]`).forEach(b => b.classList.toggle("on", on));
        /* keep the Bookmarked filter count + current filter honest */
        lpApply();
        return;
      }

      /* ----- LEARNING PATH: status filter chips ----- */
      const lpf = e.target.closest("[data-lpf]");
      if (lpf && lpf.closest("#lpFilters")) {
        document.querySelectorAll("#lpFilters .gf").forEach(b => b.classList.remove("on"));
        lpf.classList.add("on");
        lpApply();
        return;
      }
      /* ----- LEARNING PATH: clear filters ----- */
      if (e.target.closest("#lpClear")) { lpReset(); return; }

      /* ----- LEARNING PATH: clicking a topic card body opens that exact topic ----- */
      const tc = e.target.closest(".tcard");
      if (tc && !e.target.closest("[data-goto-topic],[data-bm-toggle]")) {
        goTopic(tc.dataset.id);
        return;
      }
      /* ----- Dashboard: roadmap level card -> open that level ----- */
      const lvCard = el("[data-goto-level]");
      if (lvCard) { goLevel(lvCard.dataset.gotoLevel); return; }

      if (el("#btnViewAllTopics")) { goGallery(); return; }

      if (el("#btnContinueLearning")) {
        const ct = LMS.continueTopic(state.product);
        if (ct) goTopic(ct.id); else goStep(LMS.allSteps()[0].step);
        return;
      }
      if (el("#brandHome") || el("#miDashboard")) { $("userMenu").classList.remove("on"); goDashboard(); return; }
      if (el("#btnDashboard")) { $("userMenu").classList.remove("on"); goBonus(); return; }
      if (el("#btnBookmarks") || el("#miBookmarks")) { $("userMenu").classList.remove("on"); goBookmarks(); return; }
      if (el("#pzOut")) { PZ.step(-1); return; }
      if (el("#pzIn"))  { PZ.step(1);  return; }
      if (el("#pzVal")) { PZ.reset();  return; }
      if (el("#miZoomReset")) { PZ.reset(); $("userMenu").classList.remove("on"); return; }
      if (el("#miReset")) {
        $("userMenu").classList.remove("on");
        if (confirm("Reset all completed topics and bookmarks for " + (PRODUCTS.find(x=>x.id===state.product)||{}).name + "?")) { LMS.resetProgress(state.product); render(); }
        return;
      }
      if (el("#btnUser")) { $("userMenu").classList.toggle("on"); return; }
      if (!el("#userMenu")) $("userMenu").classList.remove("on");

      const mode = el(".mode");
      if (mode) {
        Nav.setMode(mode.dataset.mode);
        if (mode.dataset.mode === "reference") goReference(); else goDashboard();
        return;
      }

      if (!el(".search-wrap")) Search.hide();
    });

    const input = $("search");
    input.addEventListener("input", e => Search.show(e.target.value));
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); Search.move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); Search.move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); Search.open(Search.current() < 0 ? 0 : Search.current()); }
      else if (e.key === "Escape") { Search.hide(); input.blur(); }
    });

    /* bonus wall: live search box — delegated so it works even though #dwSearch
       is injected after this bind() runs (the bonus view renders on demand). */
    document.addEventListener("input", e => {
      if (e.target && e.target.id === "dwSearch") {
        Bonus.setQuery(e.target.value);
        const board = document.getElementById("dwBoard");
        if (board) board.innerHTML = Bonus.boardHTML();
      }
      /* Learning Path: live topic search (delegated; gallery injected on demand) */
      if (e.target && e.target.id === "lpSearch") lpApply();
      /* Free Template Bundles: live search */
      if (e.target && e.target.id === "tpSearch") { Templates.setQuery(e.target.value); render(); }
    });

    /* Learning Path: level / chapter dropdown changes */
    document.addEventListener("change", e => {
      if (e.target && (e.target.id === "lpLevel" || e.target.id === "lpChapter")) lpApply();
      /* Free Template Bundles: sort dropdown */
      if (e.target && e.target.id === "tpSort") { Templates.setSort(e.target.value); render(); }
    });

    /* (legacy single-bind attempt kept harmless) */
    const dwSearch = $("dwSearch");
    if (dwSearch) dwSearch.addEventListener("input", e => {
      Bonus.setQuery(e.target.value);
      const board = document.getElementById("dwBoard");
      if (board) board.innerHTML = Bonus.boardHTML();
    });

    document.addEventListener("keydown", e => {
      /* Ctrl +/-/0 adjust the app's own page zoom */
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") { e.preventDefault(); PZ.step(1);  return; }
        if (e.key === "-" || e.key === "_") { e.preventDefault(); PZ.step(-1); return; }
        if (e.key === "0")                  { e.preventDefault(); PZ.reset();  return; }
      }
      if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === "Escape") {
        Viewer.exitFs(); closeNav(); $("userMenu").classList.remove("on");
        /* Free Template Bundles modal */
        const tpModal = document.getElementById("tpModal");
        if (tpModal && tpModal.classList.contains("on")) { Templates.closeModal(); render(); }
        /* practice drawer */
        if (state.practiceFor) App.openPractice(null);
      }
      /* bonus study modal: ESC closes, arrows step prev/next */
      if (state.view === "bonus" && document.getElementById("dwModal") && document.getElementById("dwModal").classList.contains("on")) {
        if (e.key === "Escape") { Bonus.closeModal(); render(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); Bonus.step(1); render(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); Bonus.step(-1); render(); }
      }
      /* bonus full-size lightbox: ESC closes, arrows step prev/next */
      if (state.view === "bonus" && document.getElementById("dwLightbox") && !document.getElementById("dwLightbox").hasAttribute("hidden")) {
        if (e.key === "Escape") { Bonus.closeLightbox(); render(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); Bonus.step(1); render(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); Bonus.step(-1); render(); }
      }
      if (state.view === "topic" && !e.ctrlKey && document.activeElement !== input) {
        const n = LMS.neighbours(state.topicId);
        if (e.key === "ArrowRight" && n.next) goTopic(n.next.id);
        if (e.key === "ArrowLeft"  && n.prev) goTopic(n.prev.id);
      }
    });

    /* No auto re-fit on resize — the learner's chosen zoom level is preserved. */
  }

  /* ---------- Learning Path: topic gallery filter engine ----------
     Combines status chip + level + chapter + search; shows empty state. */
  function lpApply() {
    const bar = document.getElementById("lpGallery");
    if (!bar) return;
    const chip = document.querySelector("#lpFilters .gf.on");
    const f = chip ? chip.dataset.lpf : "all";
    const lv = (document.getElementById("lpLevel") || {}).value || "";
    const ch = (document.getElementById("lpChapter") || {}).value || "";
    const q = ((document.getElementById("lpSearch") || {}).value || "").trim().toLowerCase();
    let shown = 0;
    bar.querySelectorAll(".tcard").forEach(card => {
      const status = card.dataset.status;
      const statusOk =
        f === "all" ? true :
        f === "available"   ? status === "available" :
        f === "coming"      ? status === "coming_soon" :
        f === "completed"   ? status === "completed" :
        f === "bookmarked"  ? card.dataset.bm === "1" : true;
      const lvOk  = !lv || card.dataset.level === lv;
      const chOk  = !ch || card.dataset.chapter === ch;
      const qOk   = !q || (card.dataset.kw || "").includes(q);
      const ok = statusOk && lvOk && chOk && qOk;
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    const empty = document.getElementById("lpEmpty");
    if (empty) empty.hidden = shown !== 0;
  }
  function lpReset() {
    document.querySelectorAll("#lpFilters .gf").forEach(b => b.classList.toggle("on", b.dataset.lpf === "all"));
    const lv = document.getElementById("lpLevel"), ch = document.getElementById("lpChapter"), q = document.getElementById("lpSearch");
    if (lv) lv.value = ""; if (ch) ch.value = ""; if (q) q.value = "";
    lpApply();
  }

  /* ---------- bonus: non-blocking confirm toast + clipboard fallback ---------- */
  let dwToastT;
  function showDwConfirm(msg) {
    let t = document.getElementById("dwToast");
    if (!t) { t = document.createElement("div"); t.id = "dwToast"; t.className = "dw-confirm"; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block";
    clearTimeout(dwToastT); dwToastT = setTimeout(() => { t.style.display = "none"; }, 2400);
  }
  function fallbackCopy(txt) {
    const ta = document.createElement("textarea"); ta.value = txt;
    ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); showDwConfirm("✓ AI prompt copied"); } catch (e) {}
    ta.remove();
  }

  /* ---------- right-side practice drawer ---------- */
  function openPractice(id) {
    const d = $("practiceDrawer"), body = $("practiceDrawerBody"), scrim = $("drawerScrim");
    if (id) {
      body.innerHTML = renderPractice(LMS.getTopic(id), Viewer.page());
      d.classList.add("open"); d.setAttribute("aria-hidden", "false"); scrim.classList.add("on");
    } else {
      d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); scrim.classList.remove("on");
      state.practiceFor = null;
    }
    if (typeof crumbs === "function") crumbs();   /* keep breadcrumb in sync with drawer state (E26) */
  }

  /* ---------- collapse / expand left navigation ---------- */
  function toggleNavPanel() {
    const collapsed = document.body.classList.toggle("nav-collapsed");
    const btn = $("btnNavToggle");
    if (btn) btn.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
    return collapsed;
  }

  /* ---------- product tab bar (parent-level navigation) ----------
     Six ResolvrPro Learning Academy products (PRODUCTS, declared at module scope).
     Excel Mastery is the only ACTIVE track; the other five are "coming soon" and
     render a polished in-shell Coming Soon state (no broken pages, no second nav). */
  function renderProductTabs() {
    const bar = $("productTabs");
    if (!bar) return;
    bar.innerHTML = PRODUCTS.map(t => `
      <button class="product-tab pt-${t.color} ${t.status === "active" ? "on" : ""} ${state.product === t.id ? "current" : ""}"
              data-product="${t.id}" role="tab" aria-selected="${state.product === t.id}">
        <span class="pt-ico">${t.icon}</span>
        <span class="pt-name">${esc(t.name)}</span>
        <span class="pt-stat ${t.status === "soon" ? "soon" : ""}">${t.status === "active" ? "ACTIVE" : "SOON"}</span>
      </button>`).join("");
  }

  /* header level selector — Level 1..5 curriculum switcher */
  function renderLevelSelector() {
    const btn = $("levelSwitcher"), menu = $("levelMenu");
    if (!btn || !menu) return;
    const lv = state.level ? LMS.getLevel(state.level) : null;
    btn.innerHTML = `<span class="ls-badge ${lv ? "lvl-"+(lv.color) : ""}">${lv ? "L"+lv.num : "LV"}</span> ${lv ? esc(lv.name) : "All Levels"} <span class="caret">${ICON.chevron}</span>`;
    btn.classList.toggle("active", !!lv);
    menu.innerHTML = `<button class="ls-item" data-level-select=""><span class="ls-badge">★</span><span class="ls-name">All Levels</span><span class="ls-stat">Full curriculum</span></button>` +
      LMS.allLevels().map(l => {
        const lp = LMS.levelProgress(l.id);
        const cnt = l.future ? "Coming Soon" : `${lp.steps.length ? lp.steps.length+" Step"+(lp.steps.length>1?"s":"") : "No steps"} · ${lp.total} Topics`;
        return `<button class="ls-item ${state.level === l.id ? "on" : ""}" data-level-select="${l.id}">
          <span class="ls-badge lvl-${l.color}">L${l.num}</span>
          <span class="ls-name">Level ${l.num} — ${esc(l.name)}<em>${esc(l.subtitle)}</em></span>
          <span class="ls-stat">${esc(cnt)}</span>
        </button>`;
      }).join("");
  }

  function init() {
    try {
      PZ.load();          /* page zoom — defaults to 80% */
      renderProductTabs();
      bind();
      goDashboard();
    } catch (e) {
      /* Never leave the user on an infinite spinner — surface the real error. */
      const ld = document.getElementById("loader");
      if (ld) ld.innerHTML = '<div style="max-width:560px;padding:18px;color:#b91c1c;font:600 13px/1.6 system-ui">'
        + 'ResolvrPro failed to start.<br><br><code style="white-space:pre-wrap">'
        + String(e && e.stack || e) + '</code></div>';
      if (window.console) console.error("[ResolvrPro init]", e);
      return;
    }
    setTimeout(() => { const ld = document.getElementById("loader"); if (ld) ld.classList.add("hide"); }, 420);
  }

  /* Hard fallback: if for any reason init() never ran (script load order,
     blocked localStorage on file://, etc.), hide the loader on window load. */
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("load", () => {
      setTimeout(() => { const ld = document.getElementById("loader"); if (ld) ld.classList.add("hide"); }, 600);
    });
  }

  return { state, init, goTopic, goStep, goDashboard, goBookmarks, goReference, zoom: PZ, openPractice, toggleNavPanel };
})();

document.addEventListener("DOMContentLoaded", App.init);
