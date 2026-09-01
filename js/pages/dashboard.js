/* ===== SHARED VIEW HELPERS ===== */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const ICON = {
  chevron:'<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>',
  bookmark:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
  star:'<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.2 7-6.2-3.4L5.8 21 7 14.2 2 9.4l7-.9z"/></svg>',
  clock:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  prev:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6"/></svg>',
  next:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>',
  check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>',
  download:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 21h16"/></svg>',
  practice:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5.5A2.5 2.5 0 016.5 3H19v16H6.5A2.5 2.5 0 004 21.5z"/><path d="M9 8h6M9 12h4"/></svg>',
  fit:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V5.5A1.5 1.5 0 015.5 4H9M15 4h3.5A1.5 1.5 0 0120 5.5V9M20 15v3.5a1.5 1.5 0 01-1.5 1.5H15M9 20H5.5A1.5 1.5 0 014 18.5V15"/></svg>',
  reset:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/></svg>',
  expand:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6"/></svg>',
  collapse:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4v6H4M14 20v-6h6M4 10l6-6M20 14l-6 6"/></svg>',
  info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/></svg>',
  close:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  copy:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>',
  /* Excel workbook glyph — green spreadsheet with grid + an "X" mark */
  xls:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h7M9 16.5h7M12 11v9"/></svg>'
};

/* status badge from DERIVED status — no per-topic branching */
const badge = t => `<span class="badge b-${t.status}">${
  t.status === "completed" ? ICON.check + " " : ""}${esc(t.statusLabel)}</span>`;
const levelBadge = t => t.level ? `<span class="badge b-level">${esc((LMS.getLevel && LMS.getLevel("level-5") && t.level === LMS.getLevel("level-5").name) ? "AI-POWERED PROFESSIONAL" : t.level)}</span>` : "";

/* ===== PAGE: DASHBOARD — EXCEL MASTERY HOME (reference-style overview) ===== */
const STEP_ICON = {
  "01": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
  "02": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10M7 12h10M7 17h6M17 14l2 2-2 2" opacity=".55"/></svg>',
  "03": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  "04": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  "05": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  "06": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>',
  "07": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="16" r="2.5"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/></svg>'
};

/* small icon set for stat / journey / capability cards */
const D_ICON = {
  prog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 12l6-3"/><path d="M21 3v6h-6"/></svg>',
  topics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  avail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>',
  soon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/></svg>',
  practice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h7M9 17h7"/></svg>',
  learn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
  see:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  practice2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M9 8h6M9 12h4"/></svg>',
  build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/></svg>',
  apply:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.5l-9.5 9.5L2 15l3-7 14 1.5z"/><path d="M9 14l3-3"/></svg>',
  analyze:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V4M4 20h16"/><path d="M8 16l3-5 3 3 4-7"/></svg>',
  visualize:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
  automate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  communicate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  ai:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>'
};

function renderDashboard() {
  const cp = LMS.courseProgress();
  const comingSoon = cp.total - cp.available;
  const firstTopic = LMS.allSteps().length
    ? LMS.stepTopics(1).find(t => t.hasLesson) || LMS.continueTopic("excel")
    : null;
  const firstTopicId = firstTopic ? firstTopic.id : null;

  /* ---- Continue Learning: resume where the learner left off (last visited topic),
     falling back to the first incomplete available topic ---- */
  const lastId = LMS.getLastPosition("excel");
  const lastTopic = lastId ? LMS.getTopic(lastId) : null;
  const next = (lastTopic && (lastTopic.hasLesson || lastTopic.status === "coming_soon")) ? lastTopic : LMS.continueTopic("excel");
  const levelOfStep = {};
  LMS.allLevels().forEach(l => LMS.stepsOfLevel(l.id).forEach(s => { levelOfStep[s.step] = l; }));
  const contTopic = next ? LMS.getTopic(next.id) : null;
  const contLevel = contTopic ? (levelOfStep[contTopic.step] || { num:"", name:"" }) : null;
  const contTotal = contTopic ? LMS.stepTopics(contTopic.step).length : 0;
  const contDone = contTopic ? LMS.stepTopics(contTopic.step).filter(t => t.isCompleted).length : 0;
  const contPct = contTotal ? Math.round((contDone / contTotal) * 100) : 0;

  /* resume context: if they've visited before, say "Resume"; else "Continue" */
  const resuming = !!lastId && lastId === contTopic.id;
  const contLabel = resuming ? "RESUME WHERE YOU LEFT OFF" : "CONTINUE YOUR LEARNING";
  /* circular progress ring maths */
  const R = 26, C = 2 * Math.PI * R;
  const off = C * (1 - contPct / 100);
  const continueCard = contTopic ? `
    <button class="cl-card" id="btnContinueLearning" data-goto-topic="${esc(contTopic.id)}">
      <div class="cl-bg" aria-hidden="true"></div>
      <div class="cl-left">
        <div class="cl-tag">${contLabel}</div>
        <div class="cl-meta"><span class="cl-lvl">Level ${contLevel.num}</span> · ${esc(contLevel.name)}</div>
        <div class="cl-title">${esc(contTopic.title)}</div>
        <div class="cl-bar"><i style="width:${contPct}%"></i></div>
        <div class="cl-foot">
          <span>${contDone} / ${contTotal} Lessons Completed</span>
          <span class="cl-pct">${contPct}% complete</span>
        </div>
        <span class="cl-go">${resuming ? "Resume Learning" : "Continue Learning"} ${ICON.next}</span>
      </div>
      <div class="cl-ring" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="84" height="84">
          <circle class="cl-ring-bg" cx="32" cy="32" r="${R}" fill="none" stroke-width="7"/>
          <circle class="cl-ring-fg" cx="32" cy="32" r="${R}" fill="none" stroke-width="7"
            stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
            transform="rotate(-90 32 32)"/>
          <text class="cl-ring-txt" x="32" y="32" text-anchor="middle" dominant-baseline="central">${contPct}%</text>
        </svg>
      </div>
    </button>` : "";

  /* ---- 5 progress statistics (dynamic) ---- */
  const stats = [
    { cls:"s-prog",  icon:D_ICON.prog,     n:cp.pctCompleted + "%",      l:"Overall Progress",  s:"Keep going — you're doing great", accent:"green" },
    { cls:"s-topics",icon:D_ICON.topics,   n:cp.total,                    l:"Total Topics",     s:"Across 5 levels", accent:"blue" },
    { cls:"s-avail", icon:D_ICON.avail,    n:cp.available,                l:"Available Now",    s:"Start learning today", accent:"green" },
    { cls:"s-soon",  icon:D_ICON.soon,     n:comingSoon,                  l:"Coming Soon",      s:"New topics on the way", accent:"orange" },
    { cls:"s-prac",  icon:D_ICON.practice, n:practiceCount(),             l:"Practice Files",   s:`${cp.practiced} of ${cp.available} practice sets completed`, accent:"purple" }
  ];
  const statCards = stats.map(s => `
    <div class="stat-card stat-${s.accent}">
      <span class="stat-ico">${s.icon}</span>
      <div class="stat-n">${s.n}</div>
      <div class="stat-l">${esc(s.l)}</div>
      <div class="stat-s">${esc(s.s)}</div>
    </div>`).join("");

  /* ---- Learning Journey (5 stages, explanatory UI) ---- */
  const journey = [
    { n:"01", t:"LEARN",   d:"Understand concepts",  s:"Build strong foundation",   ic:D_ICON.learn },
    { n:"02", t:"SEE",     d:"Study visual examples",s:"Real-world scenarios",       ic:D_ICON.see },
    { n:"03", t:"PRACTICE",d:"Apply with exercises", s:"Build your skills",           ic:D_ICON.practice2 },
    { n:"04", t:"BUILD",   d:"Complete projects",    s:"Create solutions",           ic:D_ICON.build },
    { n:"05", t:"APPLY",   d:"Use at work",          s:"Get real impact",            ic:D_ICON.apply }
  ];
  const journeyHtml = journey.map((j,i) => `
    <div class="jn-step">
      <span class="jn-ico">${j.ic}</span>
      <div class="jn-n">${j.n}</div>
      <div class="jn-t">${j.t}</div>
      <div class="jn-d">${esc(j.d)}</div>
      <div class="jn-s">${esc(j.s)}</div>
    </div>${i < journey.length-1 ? `<span class="jn-arrow">${ICON.chevron}</span>` : ""}`).join("");

  /* ---- Roadmap: existing 5 levels (clickable -> level nav) ---- */
  const roadmap = LMS.allLevels().map(l => {
    const lp = LMS.levelProgress(l.id);
    return `
      <button class="rm-card rm-${l.color}" data-goto-level="${l.id}">
        <div class="rm-top"><span class="rm-lnum">L${l.num}</span><span class="rm-badge">${esc(l.subtitle || "")}</span></div>
        <div class="rm-name">${esc(l.name)}</div>
        <div class="rm-stats"><span>${lp.total} Topics</span><span>${lp.available} Available</span></div>
        <div class="rm-bar"><i style="width:${lp.pctCompleted}%"></i></div>
        <div class="rm-pct">${lp.pctCompleted}%</div>
      </button>`;
  }).join("");

  /* ---- Recently Viewed: last few topics visited (per-track, derived) ---- */
  const recent = LMS.recentlyViewed("excel");
  const recentRail = recent.length ? `
    <section class="sec">
      <div class="sec-h">RECENTLY VIEWED</div>
      <div class="recent-row">
        ${recent.map(t => `
          <button class="recent-chip" data-goto-topic="${esc(t.id)}">
            <span class="recent-lvl">L${t.stepCode}</span>
            <span class="recent-title">${esc(t.title)}</span>
          </button>`).join("")}
      </div>
    </section>` : "";

  /* ---- Featured Next Topics: a few existing topics with real images ---- */
  const feat = featuredTopics().map(t => `
    <article class="ft-card ${t.status}" data-id="${esc(t.id)}" data-goto-topic="${esc(t.id)}">
      <div class="ft-thumb">${t.img
        ? `<img src="${esc(t.img)}" alt="${esc(t.title)}" loading="lazy" onerror="this.outerHTML='<div class=&quot;ft-ph&quot;>${esc(t.title)}</div>'">`
        : `<div class="ft-ph">${esc(t.title)}</div>`}</div>
      <div class="ft-body">
        <div class="ft-badge">L${t.levelNum} · CH${t.chapterCode}</div>
        <div class="ft-title">${esc(t.title)}</div>
        ${t.desc ? `<div class="ft-desc">${esc(t.desc)}</div>` : ""}
        <div class="ft-meta"><span>${t.lessons} Lessons</span></div>
        <div class="ft-bar"><i style="width:${t.pct}%"></i></div>
        <div class="ft-pct">${t.pct}%</div>
      </div>
    </article>`).join("");

  /* ---- Capabilities (explanatory) ---- */
  const caps = [
    { t:"ANALYZE",     d:"Turn raw data into meaningful insights",     ic:D_ICON.analyze,     ac:"blue" },
    { t:"VISUALIZE",   d:"Build professional charts & dashboards",      ic:D_ICON.visualize,   ac:"teal" },
    { t:"AUTOMATE",    d:"Save time with formulas & automation",        ic:D_ICON.automate,    ac:"orange" },
    { t:"COMMUNICATE", d:"Present insights clearly and confidently",    ic:D_ICON.communicate, ac:"green" },
    { t:"USE AI",      d:"Work smarter with AI-powered Excel",          ic:D_ICON.ai,          ac:"purple" }
  ];
  const capHtml = caps.map(c => `
    <div class="cap-card cap-${c.ac}">
      <span class="cap-ico">${c.ic}</span>
      <div class="cap-t">${c.t}</div>
      <div class="cap-d">${esc(c.d)}</div>
    </div>`).join("");

  return `
    <div class="home">
      <!-- HERO — compact Excel-learning banner (LEFT text · RIGHT illustration, per reference) -->
      <section class="hero">
        <!-- decorative data lines / particles (subtle, behind content) -->
        <div class="hero-deco" aria-hidden="true">
          <svg class="hd-line" viewBox="0 0 400 160" preserveAspectRatio="none"><path d="M0 120 C 90 60, 160 150, 250 70 S 400 30, 400 30" fill="none" stroke="#43D99A" stroke-width="2"/><path d="M0 140 C 120 100, 200 160, 320 90 S 400 60, 400 60" fill="none" stroke="#19B879" stroke-width="1.5"/></svg>
          <span class="hd-dot" style="left:14%;top:64%"></span>
          <span class="hd-dot" style="left:30%;top:30%"></span>
          <span class="hd-dot" style="left:46%;top:74%"></span>
          <span class="hd-dot" style="left:62%;top:42%"></span>
        </div>

        <div class="hero-left">
          <div class="hero-eyebrow">RESOLVRPRO • LEARNING ACADEMY</div>
          <h1 class="hero-title">EXCEL MASTERY</h1>
          <p class="hero-sub">Learn Excel. Master Excel. <span class="hero-hl">Lead with Excel.</span></p>
          <p class="hero-note">Step-by-step learning with practical examples, visual lessons, exercises, reporting skills, dashboards and automation.</p>
          <div class="hero-pills">
            <span class="hp">✓ Practical Learning</span>
            <span class="hp">✓ Real-world Examples</span>
            <span class="hp">✓ Hands-on Practice</span>
            <span class="hp">✓ Career Focused</span>
          </div>

          ${firstTopicId ? `<button class="hero-cta" data-goto-topic="${esc(firstTopicId)}">Start Learning ${ICON.next || "→"}</button>` : ""}

          <div class="hero-stats">
            <div class="hs"><span class="hs-ico">🎓</span><span class="hs-n">5+</span><span class="hs-l">Levels of Learning</span></div>
            <div class="hs"><span class="hs-ico">📘</span><span class="hs-n">${cp.total}+</span><span class="hs-l">Visual Lessons</span></div>
            <div class="hs"><span class="hs-ico">📊</span><span class="hs-n">20+</span><span class="hs-l">Real-world Projects</span></div>
            <div class="hs"><span class="hs-ico">🏆</span><span class="hs-n">100%</span><span class="hs-l">Practical Approach</span></div>
          </div>
        </div>

        <div class="hero-art">
          <img class="ha-img" src="assets/img/excel-hero-alpha.png" alt="Excel learning dashboard illustration with charts, laptop, Excel analytics and learning resources.">
        </div>
      </section>

      ${continueCard}

      <!-- PROGRESS STATISTICS -->
      <section class="stat-row">${statCards}</section>

      <!-- LEARNING JOURNEY -->
      <section class="sec">
        <div class="sec-h">YOUR LEARNING JOURNEY</div>
        <div class="jn-row">${journeyHtml}</div>
      </section>

      <!-- ROADMAP -->
      <section class="sec">
        <div class="sec-h">YOUR EXCEL MASTERY ROADMAP</div>
        <div class="rm-row">${roadmap}</div>
      </section>

      <!-- FEATURED NEXT TOPICS -->
      <section class="sec">
        <div class="sec-h">FEATURED NEXT TOPICS</div>
        <div class="ft-row">${feat}</div>
        <button class="view-all" id="btnViewAllTopics">VIEW ALL ${cp.total} TOPICS ${ICON.next}</button>
      </section>

      <!-- RECENTLY VIEWED -->
      ${recentRail}

      <!-- CAPABILITIES -->
      <section class="sec">
        <div class="sec-h">WHAT YOU'LL BE ABLE TO DO</div>
        <div class="cap-row">${capHtml}</div>
      </section>
    </div>`;
}

/* a handful of existing topics to feature (real images where present) */
function featuredTopics() {
  const levelOfStep = {};
  LMS.allLevels().forEach(l => LMS.stepsOfLevel(l.id).forEach(s => { levelOfStep[s.step] = { num:l.num, color:l.color }; }));
  /* prefer topics that have a real lesson image, then pad with others */
  const all = LMS.topicIds().map(id => {
    const t = LMS.getTopic(id);
    const lv = levelOfStep[t.step] || { num:"" };
    return {
      id, title:t.title, desc:t.summary||"", chapterCode:t.stepCode, levelNum:lv.num,
      img:t.hasLesson ? t.lessonImageUrl : null,
      lessons:t.pageCount && t.pageCount>1 ? t.pageCount : (LMS.stepTopics(t.step).length?1:0),
      totalInChapter:LMS.stepTopics(t.step).length,
      status:t.status, pct:t.hasLesson ? (t.isCompleted?100:0) : 0
    };
  });
  const withImg = all.filter(t => t.img);
  const rest = all.filter(t => !t.img);
  return withImg.concat(rest).slice(0, 6);
}

/* count of Excel practice workbooks registered for the active track */
function practiceCount() {
  try {
    if (typeof PRACTICE_REGISTRY === "undefined") return LMS.courseProgress().available;
    const ids = LMS.topicIds();
    const set = new Set();
    ids.forEach(id => { const pm = PRACTICE_REGISTRY[id]; if (pm && pm.workbook) set.add(pm.workbook); });
    return set.size || LMS.courseProgress().available;
  } catch (e) { return LMS.courseProgress().available; }
}

/* ===== LEARNING PATH — VISUAL TOPIC GALLERY (View All Topics destination) =====
   One card per topic, built dynamically from the existing LMS data (no data
   duplication). Each card shows the topic's REAL lesson image, level + chapter
   context, topic number, title, description, lesson count, availability, progress
   and an Open Topic button. Filtering (status / level / chapter) and search run
   client-side so the gallery stays a single source of truth with left nav etc. */
function renderTopicGallery() {
  /* ---- resolve EVERY topic into a flat record (level + chapter context) ---- */
  const levelOfStep = {};                        /* step -> {id,name,num,color} */
  LMS.allLevels().forEach(l => {
    LMS.stepsOfLevel(l.id).forEach(s => { levelOfStep[s.step] = { id: l.id, name: l.name, num: l.num, color: l.color }; });
  });
  /* Build the card list in LEVEL order -> CHAPTER (step) order -> topic-in-step
     order. This matches the left navigation and gives the "levels wise and chapter
     wise numbering sequence" the user asked for (the raw registry order is
     step-sequent but NOT grouped by level, so we walk allLevels -> stepsOfLevel
     -> stepTopics instead of LMS.topicIds()). */
  const all = [];
  LMS.allLevels().forEach(level => {
    LMS.stepsOfLevel(level.id).forEach(step => {
      const stepTopics = LMS.stepTopics(step.step);
      stepTopics.forEach((t, ti) => {
        all.push({
          id: t.id,
          num: t.code || String(ti + 1),
          title: t.title,
          desc: t.summary || "",
          chapter: `Step ${t.stepCode} — ${t.section}`,
          chapterCode: t.stepCode,
          chapterIndex: ti,
          levelId: level.id,
          levelNum: level.num,
          levelName: level.name,
          levelColor: level.color,
          img: t.hasLesson ? t.lessonImageUrl : null,
          pageCount: t.pageCount || (t.hasLesson ? 1 : 0),
          lessons: t.pageCount && t.pageCount > 1 ? t.pageCount
                 : (stepTopics.length ? 1 : 0),
          totalInChapter: stepTopics.length,
          status: t.status,
          statusLabel: t.statusLabel,
          available: t.hasLesson ? 1 : 0,
          completed: t.isCompleted ? 1 : 0,
          pct: t.hasLesson ? (t.isCompleted ? 100 : 0) : 0,
          bookmarked: t.isBookmarked ? 1 : 0,
          keywords: (t.keywords || []).join(" "),
          inLevelOrder: true
        });
      });
    });
  });

  /* lesson count = number of child topics in the chapter for coming-soon steps,
     else the topic's own page count (multi-page lessons). Fallback to 1. */
  all.forEach(t => {
    if (!t.lessons) t.lessons = t.totalInChapter || 1;
  });

  const total = all.length;
  const avail = all.filter(t => t.status === "available").length;
  const coming = all.filter(t => t.status === "coming_soon").length;
  const done = all.filter(t => t.status === "completed").length;
  const bm = all.filter(t => t.bookmarked).length;

  /* level + chapter option lists (derived, not hard-coded) */
  const levels = LMS.allLevels().map(l => ({ id: l.id, label: `Level ${l.num} — ${l.name}` }));
  const chapters = [];
  LMS.allSteps().forEach(s => chapters.push({ code: s.code, label: `Step ${s.code} — ${s.section}` }));

  const opt = (v, label) => `<option value="${esc(v)}">${esc(label)}</option>`;

  return `
    <div class="lp">
      <div class="sec-title">LEARNING PATH — ${total} TOPICS</div>

      <div class="lp-filters" id="lpFilters">
        <button class="gf on" data-lpf="all">All Topics <span class="cnt">${total}</span></button>
        <button class="gf" data-lpf="available">Available <span class="cnt">${avail}</span></button>
        <button class="gf" data-lpf="coming">Coming Soon <span class="cnt">${coming}</span></button>
        <button class="gf" data-lpf="completed">Completed <span class="cnt">${done}</span></button>
        <button class="gf" data-lpf="bookmarked">★ Bookmarked <span class="cnt">${bm}</span></button>
      </div>

      <div class="lp-toolbar">
        <select class="lp-sel" id="lpLevel" aria-label="Filter by level">
          ${opt("", "All Levels")}${levels.map(l => opt(l.id, l.label)).join("")}
        </select>
        <select class="lp-sel" id="lpChapter" aria-label="Filter by chapter">
          ${opt("", "All Chapters")}${chapters.map(c => opt(c.code, c.label)).join("")}
        </select>
        <div class="lp-search">
          ${ICON.search || ""}
          <input id="lpSearch" type="search" placeholder="Search topics, functions, steps, features..." autocomplete="off">
        </div>
      </div>

      <div class="gallery lp-gallery" id="lpGallery">${all.map(lpCard).join("")}</div>
      <div class="lp-empty" id="lpEmpty" hidden>
        <div class="lp-empty-h">NO TOPICS FOUND</div>
        <button class="gcard-open" id="lpClear">CLEAR FILTERS</button>
      </div>
    </div>`;
}

/* one visual topic card */
function lpCard(t) {
  const img = t.img
    ? `<img class="tc-img" src="${esc(t.img)}" alt="${esc(t.title)} preview" loading="lazy"
         onerror="this.parentNode.classList.add('imgerr');this.outerHTML='<div class=&quot;tc-ph&quot;>${esc(t.title)}</div>';">`
    : `<div class="tc-ph">${esc(t.title)}</div>`;
  const statusBadge = t.status === "available"
    ? `<span class="badge b-available">${ICON.check} Available</span>`
    : t.status === "completed"
      ? `<span class="badge b-completed">${ICON.check} Completed</span>`
      : `<span class="badge b-coming_soon">Coming Soon</span>`;

  return `
    <article class="tcard ${t.status}" data-id="${esc(t.id)}"
             data-status="${esc(t.status)}" data-level="${esc(t.levelId)}" data-chapter="${esc(t.chapterCode)}"
             data-bm="${t.bookmarked}" data-kw="${esc((t.title + " " + t.desc + " " + t.chapter + " " + t.levelName + " " + t.keywords).toLowerCase())}">
      <div class="tc-top">
        <span class="tc-lvl lvl-${esc(t.levelColor)}">${t.levelNum ? "L" + t.levelNum : "L"} • ${esc(t.chapterCode)}</span>
        <button class="tc-bm ${t.bookmarked ? "on" : ""}" data-bm-toggle="${esc(t.id)}" title="Bookmark" aria-label="Bookmark">${ICON.star}</button>
      </div>
      <div class="tc-thumb">${img}</div>
      <div class="tc-body">
        <div class="tc-num">${esc(t.num)}</div>
        <div class="tc-title">${esc(t.title)}</div>
        ${t.desc ? `<div class="tc-desc">${esc(t.desc)}</div>` : ""}
        <div class="tc-meta">
          <span>${t.lessons} ${t.lessons === 1 ? "Lesson" : "Lessons"}</span>
          <span><b>${t.available}/${t.totalInChapter || t.lessons}</b> ${t.status === "coming_soon" ? "Soon" : "Avail"}</span>
        </div>
        ${t.status !== "coming_soon"
          ? `<div class="tc-prog"><i style="width:${t.pct}%"></i></div>`
          : `<div class="tc-prog tc-prog-soon"></div>`}
        <button class="tc-open" data-goto-topic="${esc(t.id)}">
          ${t.status === "coming_soon" ? "View Topic" : "Open Topic"} ${ICON.next}
        </button>
      </div>
    </article>`;
}

/* ===== PAGE: PRODUCT COMING SOON (in-shell, same LMS shell) =====
   Shown for Power BI / SQL / Data Analytics / Automation / Corporate MIS. */
function renderProductComingSoon(id) {
  const p = (typeof PRODUCTS !== "undefined" && PRODUCTS.find(x => x.id === id)) || null;
  if (!p || p.status === "active") return renderDashboard();
  const points = (p.points || []).map(x => `<span class="cs-pill">${esc(x)}</span>`).join("");
  return `
    <div class="cs-wrap">
      <div class="page-hd">
        <div>
          <div class="cs-eyebrow">RESOLVRPRO · LEARNING ACADEMY</div>
          <h1 class="cs-title"><span class="cs-ico pt-${p.color}">${p.icon}</span>${esc(p.name)}</h1>
          <div class="sub">Coming Soon · Part of the ResolvrPro Learning Academy</div>
        </div>
      </div>

      <div class="cs-card">
        <span class="cs-badge">COMING SOON</span>
        <div class="cs-lede">${esc(p.blurb)}</div>
        ${points ? `<div class="cs-points">${points}</div>` : ""}
        <div class="cs-actions">
          <button class="cs-notify" data-notify="${esc(p.id)}">${ICON.star} Notify Me</button>
          <button class="cs-back" data-product="excel">${ICON.chevron} Back to Excel Mastery</button>
        </div>
        <p class="cs-note">We're building this track. Switching back to Excel Mastery keeps your progress, bookmarks and lessons intact.</p>
      </div>
    </div>`;
}

/* ===== PAGE: BOOKMARKS — SQUARE GALLERY (full-width right side) =====
   Bookmarks are track-scoped: the page shows the CURRENT track's saved topics
   under the track name, then an "All Academy Bookmarks" group (by track) so the
   learner can also reach other tracks' bookmarks without leaving context. */
function bmCard(t) {
  const thumb = t.hasLesson ? `<img class="bm-thumb-img" src="${esc(t.lessonImageUrl)}" alt="${esc(t.title)}">`
                             : `<div class="bm-thumb-ph"><span>${ICON.clock}</span></div>`;
  const cls = t.hasLesson ? "ready" : "soon";
  return `
    <div class="bmcard ${cls}" data-goto-topic="${esc(t.id)}" title="${esc(t.title)} — ${esc(t.stepTitle)}">
      <div class="bm-thumb">${thumb}</div>
      <span class="bm-fav" title="Bookmarked">${ICON.star}</span>
      <div class="bm-body">
        <div class="bm-title">${esc(t.title)}</div>
        <div class="bm-step">${esc(t.stepTitle)}</div>
        ${badge(t)}
      </div>
      <button class="bm-open" data-goto-topic="${esc(t.id)}">
        ${t.hasLesson ? "Open" : "View Topic"} ${ICON.next}
      </button>
    </div>`;
}

function renderBookmarks() {
  const pid  = App.state.product;
  const prod = (typeof PRODUCTS !== "undefined" && PRODUCTS.find(x => x.id === pid)) || { name: "Course", id: pid };
  const list = LMS.bookmarks(pid);                 /* ONLY this track's bookmarks */
  const head = `
    <div class="page-hd">
      <div>
        <h1>${esc(prod.name)} Bookmarks</h1>
        <div class="sub">Topics you saved for later in ${esc(prod.name)}${list.length ? ` · ${list.length} saved` : ""}</div>
      </div>
    </div>`;
  if (!list.length && !Object.keys(LMS.bookmarksByTrack()).length)
    return `${head}<div class="panel"><div class="empty">No bookmarks yet. Open a topic and use the <b>Bookmark</b> button to save it here.</div></div>`;

  const current = list.length ? `<div class="gallery bmgallery" id="bmgallery">${list.map(bmCard).join("")}</div>` : "";

  /* All-Academy view: group every track's bookmarks (excluding the current one) */
  const byTrack = LMS.bookmarksByTrack();
  const others  = Object.keys(byTrack).filter(p => p !== pid);
  const allHtml = others.length ? `
    <div class="bm-all">
      <div class="bm-all-h">ALL ACADEMY BOOKMARKS</div>
      ${others.map(p => {
        const pname = ((typeof PRODUCTS !== "undefined" && PRODUCTS.find(x => x.id === p)) || { name: p }).name;
        return `<div class="bm-group"><div class="bm-group-h">${esc(pname)}</div>
                <div class="gallery bmgallery">${byTrack[p].map(bmCard).join("")}</div></div>`;
      }).join("")}
    </div>` : "";

  return `${head}${current}${bonusBookmarksSection()}${allHtml}`;
}

/* Bonus-dashboard bookmarks (type: bonus_dashboard) — kept separate from lesson
   bookmarks so they never affect official course progress. Clicking opens the
   dashboard's study modal on the Inspiration Wall. */
function bonusBookmarksSection() {
  if (typeof Bonus === "undefined") return "";
  const ids = Object.keys(JSON.parse(localStorage.getItem("excelMastery.bonusWall.v1") || "{}").bookmarked || {});
  if (!ids.length) return "";
  const cards = ids.map(id => Bonus.get(id)).filter(Boolean).map(d => `
    <div class="bmcard ready" data-goto-bonus-dash="${d.id}" title="Open ${esc(d.title)}">
      <div class="bm-thumb"><img class="bm-thumb-img" src="${esc(LMS.assetUrl(d.preview))}" alt="${esc(d.title)}"></div>
      <div class="bm-body"><div class="bm-title">${esc(d.title)}</div><div class="bm-step">${esc(d.category)} · BONUS DASHBOARD</div></div>
      <button class="bm-open" data-goto-bonus-dash="${d.id}">Open Study View ${ICON.next}</button>
    </div>`).join("");
  return `<div class="bm-all"><div class="bm-all-h">BONUS DASHBOARDS</div>
    <div class="gallery bmgallery">${cards}</div></div>`;
}

