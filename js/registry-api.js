/* ==========================================================================
   TOPIC REGISTRY API
   Registry -> Topic ID -> Content Metadata -> Image / Practice / Solution
   The ONLY way the app resolves a topic. No `if (topic === "...")` anywhere.
   ========================================================================== */

const LMS = (() => {

  const STORAGE_KEY = "excelMastery.progress.v1";

  /* ---------- learner state: INDEPENDENT PER TRAINING TRACK ----------
     Every Academy product (Excel Mastery, Power BI, SQL, ...) keeps its own
     completion + bookmark state. A topic id alone is NOT unique across tracks,
     so each record is namespaced by product id. The selected tab
     (LMS.setProduct) defines the active context; all reads/writes default to it. */
  let state = { tracks: {}, last: {}, recent: {} };
  let currentProduct = "excel";   // synced from App.state.product on tab switch

  function track(id) {
    const t = state.tracks[id] || (state.tracks[id] = {});
    /* Ensure every progress key exists — guards against records loaded from
       older localStorage (pre-E4 had no `practiced`) so reads never throw. */
    if (!t.completed)  t.completed  = {};
    if (!t.bookmarked) t.bookmarked = {};
    if (!t.practiced)  t.practiced  = {};
    return t;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        state.tracks = p.tracks || {};
        state.last   = p.last   || {};
      }
    } catch (e) { /* private mode / file:// — run with in-memory state */ }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { /* non-fatal */ }
  }

  /* active training-track context (called from App.setProduct) */
  function setProduct(id) { if (id) currentProduct = id; }
  function getProduct()   { return currentProduct; }

  /* ---------- flat index built once from the registry ---------- */
  const index = new Map();   // topicId -> enriched topic record
  const order = [];          // learning-path sequence for prev/next

  function buildIndex() {
    index.clear();
    order.length = 0;

    LEARNING_PATH.forEach(stepDef => {
      stepDef.topics.forEach((topic, i) => {
        const rec = {
          ...topic,
          __src: topic,
          mode: "learning_path",
          step: stepDef.step,
          stepCode: stepDef.code,
          section: stepDef.section,
          stepTitle: `Step ${stepDef.code} — ${stepDef.section}`,
          indexInStep: i,
          realWorldExample: stepDef.realWorldExample,
          level: topic.level || stepDef.level
        };
        index.set(rec.id, rec);
        order.push(rec.id);
      });
    });

    /* STEP-LEVEL visual lessons: a roadmap/overview image that belongs to a STEP
       (not to one of its child topics). Registered so it gets a topic id, is
       clickable, has prev/next, and reuses the standard viewer. Keeps the
       child-topic 5/5 count intact. */
    LEARNING_PATH.forEach(stepDef => {
      if (stepDef.stepLessonId && stepDef.lessonImage) {
        const id = stepDef.stepLessonId;
        const rec = {
          id, title: stepDef.section, summary: stepDef.subtitle || stepDef.description || "",
          keywords: ["roadmap","syllabus","overview","step " + stepDef.code, stepDef.section],
          lessonImage: stepDef.lessonImage, lessonImages: null,
          practiceFile: null, solutionFile: null, level: stepDef.level || "Intermediate",
          mode: "learning_path", step: stepDef.step, stepCode: stepDef.code, section: stepDef.section,
          stepTitle: `Step ${stepDef.code} — ${stepDef.section}`,
          indexInStep: -1, realWorldExample: stepDef.realWorldExample,
          isStepLesson: true
        };
        index.set(id, rec);
      }
    });

    EXCEL_REFERENCE.forEach(groupDef => {
      groupDef.topics.forEach(topic => {
        const rec = {
          summary: "",
          practiceFile: null,
          solutionFile: null,
          level: "Reference",
          ...topic,
          __src: topic,
          mode: "reference",
          section: groupDef.group,
          stepTitle: groupDef.group
        };
        index.set(rec.id, rec);
      });
    });
  }

  /* ---------- status is DERIVED from metadata, never authored ---------- */
  function statusOf(topic) {
    if (!topic) return "coming_soon";
    const has = !!topic.lessonImage ||
      (Array.isArray(topic.lessonImages) && topic.lessonImages.filter(Boolean).length > 0);
    if (!has) return "coming_soon";
    return track(topic.product || currentProduct).completed[topic.id] ? "completed" : "available";
  }

  const STATUS_LABEL = {
    coming_soon: "Coming Soon",
    available:   "Available",
    completed:   "Completed"
  };

  /* ---------- asset URL helper ----------
     Encodes each path segment (filenames may contain spaces and "&") and appends
     a version token so a REPLACED image with the SAME filename is picked up
     without the user pressing Ctrl+Shift+R.

     Version token resolution order:
       1. ASSET_VERSIONS[path]  — optional explicit version/hash map (see below)
       2. a fresh per-page-load token (safe default for a no-build static app)

     To pin an explicit version, define this before registry-api.js loads:
       window.ASSET_VERSIONS = { "Lessons/Step 5.1 - The Charts & Graphs.png": "2026-08-24" };
     ...or just leave it unset and replaced files are always re-fetched. */
  const SESSION_VERSION = Date.now().toString(36);

  function versionOf(p) {
    const map = (typeof window !== "undefined" && window.ASSET_VERSIONS) || {};
    return map[p] != null ? String(map[p]) : SESSION_VERSION;
  }

  function assetUrl(p) {
    if (!p) return p;
    const encoded = String(p).split("/").map(encodeURIComponent).join("/");
    return `${encoded}?version=${encodeURIComponent(versionOf(p))}`;
  }

  function getTopic(id) {
    const t = index.get(id);
    if (!t) return null;
    /* Asset fields are read LIVE from the registry object so the registry stays
       the single source of truth — attaching a lessonImage takes effect at once. */
    const src = t.__src || {};
    const rec = {
      ...t,
      lessonImage:  src.lessonImage  !== undefined ? src.lessonImage  : t.lessonImage,
      lessonImages: src.lessonImages !== undefined ? src.lessonImages : t.lessonImages,
      practiceFile: src.practiceFile !== undefined ? src.practiceFile : t.practiceFile,
      solutionFile: src.solutionFile !== undefined ? src.solutionFile : t.solutionFile
    };
    delete rec.__src;

    /* Practice workbook: PRACTICE_REGISTRY (keyed by topic id) is authoritative for
       the file + panel content. A topic with no registry entry and no practiceFile
       has NO workbook, so the UI hides the Practice button entirely. */
    const pm = (typeof PRACTICE_REGISTRY !== "undefined" && PRACTICE_REGISTRY[id]) || null;
    if (pm && pm.workbook) rec.practiceFile = pm.workbook;

    /* A lesson may be ONE image (`lessonImage`) or SEVERAL ordered pages
       (`lessonImages: [...]`). Both normalise to `lessonPages`, so every
       consumer handles multi-page lessons without extra branching. */
    const pages = (Array.isArray(rec.lessonImages) && rec.lessonImages.length)
      ? rec.lessonImages.filter(Boolean)
      : (rec.lessonImage ? [rec.lessonImage] : []);
    rec.lessonImage = pages[0] || null;   /* page 1 stays the canonical single image */

    const st = statusOf(rec);
    return {
      ...rec,
      status: st,
      statusLabel: STATUS_LABEL[st],
      practiceMeta: pm,
      hasPractice: !!rec.practiceFile,
      hasLesson: pages.length > 0,
      lessonPages: pages,
      lessonPageUrls: pages.map(assetUrl),
      pageCount: pages.length,
      isMultiPage: pages.length > 1,
      /* browser-safe, cache-busted URLs for rendering (raw paths kept above) */
      lessonImageUrl:  assetUrl(rec.lessonImage),
      practiceFileUrl: assetUrl(rec.practiceFile),
      solutionFileUrl: assetUrl(rec.solutionFile),
      isBookmarked: !!(track(rec.product || currentProduct).bookmarked[rec.id]),
      isCompleted: !!(track(rec.product || currentProduct).completed[rec.id]),
      isPracticed: !!(track(rec.product || currentProduct).practiced[rec.id]),
      practiceDone: !!(track(rec.product || currentProduct).practiced[rec.id])
    };
  }

  const getStep  = n => LEARNING_PATH.find(s => s.step === Number(n)) || null;
  const allSteps = () => LEARNING_PATH;
  const allReferenceGroups = () => EXCEL_REFERENCE;
  const allLevels = () => LEVELS;
  const getLevel  = id => LEVELS.find(l => l.id === id) || null;

  /* existing step numbers assigned to a level (additive mapping, no duplicates) */
  function stepsOfLevel(id) {
    const map = (LEVEL_STEP_MAP && LEVEL_STEP_MAP[id]) || [];
    return map.map(entry => {
      const n = (typeof entry === "object" && entry !== null) ? entry.step : entry;
      const label = (typeof entry === "object" && entry !== null) ? entry.label || null : null;
      const def = getStep(n);
      return def ? Object.assign({}, def, { levelLabel: label }) : null;
    }).filter(Boolean);
  }

  /* progress for a level = aggregate of ONLY the steps mapped to it */
  function levelProgress(id) {
    const steps = stepsOfLevel(id);
    if (!steps.length) {
      const lv = getLevel(id);
      return { future: !!(lv && lv.future), steps: 0, total: 0, available: 0, completed: 0,
               pctAvailable: 0, pctCompleted: 0, label: lv && lv.future ? "Coming Soon" : "No Steps Assigned" };
    }
    let total = 0, available = 0, completed = 0;
    steps.forEach(s => {
      const p = stepProgress(s.step);
      total     += p.total;
      available += p.available;
      completed += p.completed;
    });
    return {
      steps, total, available, completed,
      pctAvailable: total ? Math.round((available / total) * 100) : 0,
      pctCompleted: total ? Math.round((completed / total) * 100) : 0,
      label: `${available} / ${total} Lessons Available`
    };
  }

  /* the step-level roadmap Lesson for a given step number, if one is defined */
  function stepLessonTopic(n) {
    const s = getStep(n);
    return (s && s.stepLessonId) ? getTopic(s.stepLessonId) : null;
  }

  function stepTopics(n) {
    const s = getStep(n);
    return s ? s.topics.map(t => getTopic(t.id)) : [];
  }

  /* ---------- progress: computed from metadata, never hard-coded ---------- */
  function stepProgress(n) {
    const topics = stepTopics(n);
    const total     = topics.length;
    const available = topics.filter(t => t.hasLesson).length;
    const completed = topics.filter(t => t.isCompleted).length;
    return {
      total, available, completed,
      pctAvailable: total ? Math.round((available / total) * 100) : 0,
      pctCompleted: total ? Math.round((completed / total) * 100) : 0,
      allAvailable: total > 0 && available === total,
      label: available === total && total > 0
        ? `${completed} / ${total} Completed`
        : `${available} / ${total} Topics Available`
    };
  }

  function courseProgress(product) {
    const pid = product || currentProduct;
    const topics    = order.map(getTopic).filter(t => (t.product || "excel") === pid);
    const total     = topics.length;
    const available = topics.filter(t => t.hasLesson).length;
    const completed = topics.filter(t => t.isCompleted).length;
    const practiced = topics.filter(t => t.isPracticed).length;
    return {
      total, available, completed, practiced,
      pctAvailable: total ? Math.round((available / total) * 100) : 0,
      pctCompleted: total ? Math.round((completed / total) * 100) : 0,
      pctPracticed: total ? Math.round((practiced / total) * 100) : 0
    };
  }

  /* ---------- prev / next across the whole learning path ---------- */
  function neighbours(id) {
    const i = order.indexOf(id);
    /* STEP-LEVEL lesson sits logically between the previous step's last topic
       and its own step's first child topic (keeps the 33-topic order intact). */
    const t = index.get(id);
    if (i === -1 && t && t.isStepLesson) {
      const s = getStep(t.step);
      const children = s ? s.topics.map(x => x.id) : [];
      const prevStep = LEARNING_PATH[LEARNING_PATH.findIndex(x => x.step === s.step) - 1];
      const prevId = prevStep ? prevStep.topics[prevStep.topics.length - 1].id : null;
      return { prev: prevId ? getTopic(prevId) : null, next: children.length ? getTopic(children[0]) : null };
    }
    if (i === -1) return { prev: null, next: null };
    /* if this topic is the FIRST child of its step and the step has a roadmap
       lesson, make the roadmap the "previous" (Step 04 -> roadmap -> first topic). */
    if (t && t.indexInStep === 0) {
      const sl = stepLessonTopic(t.step);
      if (sl) return { prev: sl, next: i < order.length - 1 ? getTopic(order[i + 1]) : null };
    }
    return {
      prev: i > 0 ? getTopic(order[i - 1]) : null,
      next: i < order.length - 1 ? getTopic(order[i + 1]) : null
    };
  }

  /* ---------- learner actions ---------- */
  function toggleComplete(id, product) {
    const t = getTopic(id);
    if (!t || !t.hasLesson) return false;   // can't complete a missing lesson
    const tr = track(product || currentProduct);
    if (tr.completed[id]) delete tr.completed[id];
    else tr.completed[id] = new Date().toISOString();
    saveState();
    return !!tr.completed[id];
  }

  /* Mark a topic's practice workbook as completed. Records intent only — it NEVER
     force-marks the lesson complete (per spec §10) and lives in the same per-track
     progress record as completion/bookmarks so the dashboard can surface it. */
  function togglePractice(id, product) {
    const t = getTopic(id);
    if (!t || !t.practiceFile) return false;   // only topics that have a workbook
    const tr = track(product || currentProduct);
    if (tr.practiced[id]) delete tr.practiced[id];
    else tr.practiced[id] = new Date().toISOString();
    saveState();
    return !!tr.practiced[id];
  }

  function toggleBookmark(id, product, page) {
    if (!index.has(id)) return false;
    const tr = track(product || currentProduct);
    const rec = tr.bookmarked[id];
    if (rec) delete tr.bookmarked[id];
    else tr.bookmarked[id] = { ts: new Date().toISOString(), page: (page == null ? null : Number(page)) };
    saveState();
    return !!tr.bookmarked[id];
  }

  const bookmarks = (product) => {
    const tr = track(product || currentProduct);
    return Object.keys(tr.bookmarked).map(id => {
      const t = getTopic(id);
      if (t) t.bookmarkPage = (tr.bookmarked[id] && typeof tr.bookmarked[id] === "object") ? tr.bookmarked[id].page : null;
      return t;
    }).filter(Boolean);
  };

  /* clears learner state for ONE track only (never the whole Academy) */
  function resetProgress(product) {
    state.tracks[product || currentProduct] = { completed: {}, bookmarked: {}, practiced: {} };
    saveState();
  }

  /* ---------- global search: steps, topics, features, keywords ---------- */
  function search(query) {
    const q = String(query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    const results = [];

    LEARNING_PATH.forEach(s => {
      const hay = `step ${s.code} ${s.section} ${s.subtitle} ${s.description}`.toLowerCase();
      if (hay.includes(q)) {
        results.push({
          kind: "step", id: `step-${s.step}`, step: s.step,
          title: `Step ${s.code} — ${s.section}`,
          context: "Learning Path", score: hay.indexOf(q)
        });
      }
    });

    index.forEach(t => {
      const kw  = (t.keywords || []).join(" ");
      const hay = `${t.title} ${t.summary || ""} ${kw} ${t.section}`.toLowerCase();
      const pos = hay.indexOf(q);
      if (pos === -1) return;
      const titleHit = t.title.toLowerCase().includes(q);
      results.push({
        kind: "topic", id: t.id, step: t.step || null,
        title: t.title,
        context: t.mode === "learning_path" ? `Step ${t.stepCode} — ${t.section}` : t.section,
        status: statusOf(t),
        score: (titleHit ? 0 : 100) + pos
      });
    });

    /* ---- Excel Dashboard Inspiration Wall (if registry is loaded) ---- */
    if (typeof DASHBOARDS !== "undefined") {
      DASHBOARDS.forEach(d => {
        const hay = `${d.title} ${d.category} ${(d.tags || []).join(" ")} ${(d.study || []).join(" ")} ${d.desc || ""}`.toLowerCase();
        const pos = hay.indexOf(q);
        if (pos === -1) return;
        results.push({ kind: "dashboard", id: d.id, title: d.title, context: `Dashboard · ${d.category}`, score: (d.title.toLowerCase().includes(q) ? 0 : 100) + pos });
      });
    }

    /* ---- Free Template Bundles (if registry is loaded) ---- */
    if (typeof TEMPLATE_BUNDLES !== "undefined") {
      TEMPLATE_BUNDLES.forEach(b => {
        const hay = `${b.title} ${b.category} ${(b.formats || []).join(" ")}`.toLowerCase();
        const pos = hay.indexOf(q);
        if (pos === -1) return;
        results.push({ kind: "template", id: b.id, title: b.title, context: `Template · ${b.category}`, score: (b.title.toLowerCase().includes(q) ? 0 : 100) + pos });
      });
    }

    /* ---- Practice workbooks (mapped from PRACTICE_REGISTRY) ---- */
    if (typeof PRACTICE_REGISTRY !== "undefined") {
      const joinStr = v => Array.isArray(v) ? v.join(" ") : (v ? String(v) : "");
      Object.keys(PRACTICE_REGISTRY).forEach(tid => {
        const pm = PRACTICE_REGISTRY[tid];
        const t = index.get(tid);
        const hay = `${t ? t.title : ""} ${joinStr(pm.title)} ${joinStr(pm.description)} ${joinStr(pm.skills)} ${joinStr(pm.scenario)} ${joinStr(pm.sheets)}`.toLowerCase();
        const pos = hay.indexOf(q);
        if (pos === -1) return;
        results.push({ kind: "practice", id: tid, title: t ? t.title : tid, context: `Practice · ${joinStr(pm.sheet) || "Workbook"}`, status: "available", score: 50 + pos });
      });
    }

    return results.sort((a, b) => a.score - b.score).slice(0, 40);
  }

  /* ---------- breadcrumb, derived ---------- */
  function breadcrumb(id) {
    const t = getTopic(id);
    if (!t) return [LMS_META.course];
    return t.mode === "learning_path"
      ? [LMS_META.course, `Step ${t.stepCode}`, t.section, t.title]
      : [LMS_META.course, "Excel Reference", t.section, t.title];
  }
/* first incomplete available topic within a track (track-specific Continue) */
  function continueTopic(product) {
    const pid = product || currentProduct;
    const seq = order.map(getTopic).filter(t => (t.product || "excel") === pid && t.hasLesson);
    return seq.find(t => !t.isCompleted) || seq[0] || null;
  }

  /* bookmarks grouped by track — for the Academy-wide "All Bookmarks" view */
  function bookmarksByTrack() {
    const out = {};
    Object.keys(state.tracks).forEach(pid => {
      const ids = Object.keys(state.tracks[pid].bookmarked);
      if (ids.length) out[pid] = ids.map(getTopic).filter(Boolean);
    });
    return out;
  }

  /* last-visited topic per track (independent across tracks) */
  function setLastPosition(product, topicId) { state.last[product || currentProduct] = topicId; saveState(); }
  function getLastPosition(product) { return state.last[product || currentProduct] || null; }

  /* recently-viewed rail — last 6 distinct topics per track (most-recent first) */
  function pushRecent(product, topicId) {
    const pid = product || currentProduct;
    const arr = state.recent[pid] || (state.recent[pid] = []);
    const i = arr.indexOf(topicId);
    if (i !== -1) arr.splice(i, 1);
    arr.unshift(topicId);
    if (arr.length > 6) arr.length = 6;
    saveState();
  }
  function recentlyViewed(product) {
    const pid = product || currentProduct;
    return (state.recent[pid] || []).map(getTopic).filter(Boolean);
  }

  /* per-track completion % for the Academy overview dashboard */
  function allProductsProgress() {
    const list = (typeof PRODUCTS !== "undefined" && PRODUCTS) || [];
    return list.map(p => ({ id: p.id, name: p.name, ...courseProgress(p.id) }));
  }
  loadState();
  buildIndex();
  index.forEach(r => { r.product = r.product || "excel"; });

  return {
    meta: LMS_META,
    getTopic, getStep, allSteps, allReferenceGroups, stepLessonTopic, stepTopics,
    stepProgress, courseProgress, neighbours,
    toggleComplete, toggleBookmark, togglePractice, bookmarks, resetProgress,
    setProduct, getProduct, continueTopic, bookmarksByTrack,
    setLastPosition, getLastPosition, allProductsProgress,
    pushRecent, recentlyViewed,
    search, breadcrumb, assetUrl, statusLabel: s => STATUS_LABEL[s] || s,
    topicIds: () => [...order],
    allLevels, getLevel, stepsOfLevel, levelProgress
  };
})();
