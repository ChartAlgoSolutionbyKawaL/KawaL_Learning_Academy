/* ===== PAGE: TOPIC (visual lesson viewer OR coming soon) =====
   Fully registry-driven: the ONLY decision is `t.lessonImage` present or not. */

function renderTopic(topicId) {
  const t = LMS.getTopic(topicId);
  if (!t) return `<div class="empty">Topic not found.</div>`;
  return t.hasLesson ? renderLesson(t) : renderComingSoon(t);
}

/* The lesson image is the primary content; no separate title/badge header block.
   The image fills the viewport (topic-hd removed per request). */

/* ---------- lesson toolbar: icons + inline text labels + tooltips ----------
   One row holds EVERY action: bookmark, practice, download, view controls
   (fit/zoom/reset/fullscreen), page nav (multi-page), prev/next topic, mark complete.
   Each control shows its icon AND a short text label for clarity. */
function topicBar(t) {
  const { prev, next } = LMS.neighbours(t.id);
  const zig = p => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">${p}</svg>`;
  /* Bookmark/Download removed from the top toolbar per request; bookmark still
     works via the global Bookmarks page, download still available in Practice. */
  return `
    <div class="topic-bar">
      <div class="tb-group">
        ${t.practiceFile
          ? `<button class="tb-btn tb-practice" data-practice="${esc(t.id)}" data-tip="Open Excel practice workbook">
               <span class="tb-xls" aria-hidden="true">${ICON.xls || ICON.download || "📊"}</span>
               <span class="tb-lbl">Practice</span>
               <span class="tb-xls-pill">Excel</span>
             </button>`
          : (t.practicePendingNote
              ? `<button class="tb-btn tb-practice-soon" disabled data-tip="${esc(t.practicePendingNote)}">
                   <span class="tb-xls" aria-hidden="true">${ICON.xls || ICON.download || "📊"}</span>
                   <span class="tb-lbl">Practice (soon)</span>
                 </button>`
              : "")}
        <button class="tb-btn ${t.isBookmarked ? "on" : ""}" data-bookmark="${esc(t.id)}" data-page="${Viewer.page()}" data-tip="${t.isBookmarked ? "Remove bookmark" : "Save as favourite"}">${ICON.bookmark}<span class="tb-lbl">${t.isBookmarked ? "Saved" : "Bookmark"}</span></button>
      </div>
      ${t.hasLesson ? `
      <div class="tb-group">
        <button class="tb-btn" data-vz="fit" data-tip="Fit to screen">${ICON.fit}<span class="tb-lbl">Fit</span></button>
        <button class="icon-btn" data-vz="out" data-tip="Zoom out">${zig('<path d="M5 12h14"/>')}</button>
        <span class="zoom-lbl" id="zoomLbl">100%</span>
        <button class="icon-btn" data-vz="in" data-tip="Zoom in">${zig('<path d="M12 5v14M5 12h14"/>')}</button>
        <button class="tb-btn" data-vz="reset" data-tip="Reset zoom">${ICON.reset}<span class="tb-lbl">Reset</span></button>
        <button class="tb-btn" data-vz="fs" id="fsBtn" data-tip="Fullscreen">${ICON.expand}<span class="tb-lbl">Fullscreen</span></button>
      </div>
      ${t.isMultiPage ? `
      <div class="tb-group">
        <button class="icon-btn" data-page="prev" data-tip="Previous page">${ICON.prev}</button>
        <span class="pager-lbl" id="pageLbl">Page 1 / ${t.pageCount}</span>
        <button class="icon-btn" data-page="next" data-tip="Next page">${ICON.next}</button>
      </div>` : ""}
      ` : ""}
      <div class="tb-group tb-end">
        <button class="tb-btn" ${prev ? `data-goto-topic="${esc(prev.id)}" data-tip="Previous: ${esc(prev.title)}"` : "disabled"}>${ICON.prev}<span class="tb-lbl">Prev</span></button>
        <button class="tb-btn" ${next ? `data-goto-topic="${esc(next.id)}" data-tip="Next: ${esc(next.title)}"` : "disabled"}><span class="tb-lbl">Next</span>${ICON.next}</button>
      </div>
      ${t.hasLesson ? `
      <div class="tb-group">
        <button class="tb-btn ${t.isCompleted ? "on" : ""}" data-complete="${esc(t.id)}" data-tip="${t.isCompleted ? "Mark as not complete" : "Mark complete"}">${ICON.check}<span class="tb-lbl">${t.isCompleted ? "Completed" : "Complete"}</span></button>
      </div>` : ""}
    </div>`;
}

/* ---------- FINAL SESSION PROJECT card (Level 3 Session 1, Chapter 5 page 5.2 only) ----------
   Surfaces the combined Advanced Dynamic Dashboard workbook. Rendered for the project's
   owning topic (CHOOSE, MATCH, INDEX Combinations) and shown ONLY on its last page via
   Viewer.paintPage()/init() toggling the `hidden` attribute. Never a generic step link. */
function finalProjectHtml(t) {
  const step = t.step ? LMS.getStep(t.step) : null;
  const fp = (step && step.finalProject) ? step.finalProject : null;
  if (!fp || fp.projectOf !== t.id) return "";
  const url = LMS.assetUrl(fp.workbook);
  return `
    <div class="final-project-card" id="finalProjCard" hidden>
      <button class="fp-collapse" data-fp-toggle="finalProjCard" data-tip="Hide this panel" aria-label="Hide final project panel">🞩</button>
      <div class="fp-badge">🏆 FINAL SESSION PROJECT</div>
      <h3>${esc(fp.title)}</h3>
      <p>${esc(fp.desc)}</p>
      <div class="fp-journey">
        <span>INDEX + MATCH</span><i>→</i><span>XLOOKUP</span><i>→</i><span>OFFSET</span><i>→</i><span>INDIRECT</span><i>→</i><span>CHOOSE + MATCH + INDEX</span><i>→</i><span class="fp-final">ADVANCED DYNAMIC DASHBOARD</span>
      </div>
      <p class="fp-note">This project combines the techniques learned throughout Level 3 Session 1 into one business-style interactive dashboard.</p>
      <div class="fp-actions">
        <a class="btn primary" href="${esc(url)}" data-open-practice="final:${esc(t.step)}">${ICON.download || "▸"} OPEN FINAL EXCEL PROJECT</a>
        <a class="btn ghost" download href="${esc(url)}">DOWNLOAD FINAL PROJECT</a>
      </div>
    </div>
    <button class="fp-show-again" id="finalProjShow" hidden data-fp-show="finalProjCard">▸ Show Final Session Project</button>`;
}

/* ---------- AVAILABLE: image is the primary teaching artifact ---------- */
function renderLesson(t) {
  const step = t.step ? LMS.getStep(t.step) : null;
  const exp = Array.isArray(t.pageExplanations) ? t.pageExplanations : [];
  return `
    <div class="viewer" id="viewer">
      ${topicBar(t)}
      <div class="stage loading" id="stage">
        ${t.lessonPageUrls.map((u, i) => `
          <div class="lesson-page-wrap${i === 0 ? " on" : ""}" data-page-idx="${i}">
            <img class="lesson-page${i === 0 ? " on" : ""}" data-page-idx="${i}"
                 id="${i === 0 ? "lessonImg" : `lessonImg${i}`}"
                 src="${esc(u)}"
                 onload="(function(){var s=document.getElementById('stage');if(s)s.classList.remove('loading');})()"
                 alt="${esc(t.title)} — visual lesson${t.isMultiPage ? ` (page ${i + 1} of ${t.pageCount})` : ""}">
            ${exp[i] ? `<div class="lesson-exp">${exp[i]}</div>` : ""}
          </div>`).join("")}
      </div>
    </div>

    ${finalProjectHtml(t)}

    <div class="info-strip">
      ${ICON.info}
      <div>
        <b>This is a visual lesson${t.isMultiPage ? ` in ${t.pageCount} pages` : ""}.</b>
        Use Zoom or Fullscreen for the best learning experience.${t.isMultiPage
          ? " Use the page arrows in the toolbar to move between pages." : ""}
        ${step ? `&nbsp;·&nbsp; Step ${esc(step.code)} — ${esc(step.section)}` : ""}
      </div>
    </div>`;
}

/* ---------- COMING SOON: no fake content, metadata only ---------- */
function renderComingSoon(t) {
  const step = t.step ? LMS.getStep(t.step) : null;
  const objective = t.summary || "";
  return `
    <div class="cs">
      <div class="cs-ico">${ICON.clock}</div>
      <h2>${esc(t.title.toUpperCase())}</h2>
      ${t.mode === "learning_path"
        ? `<div class="step-line">STEP ${esc(t.stepCode)} — ${esc(t.section.toUpperCase())}</div>`
        : `<div class="step-line">EXCEL REFERENCE — ${esc(t.section.toUpperCase())}</div>`}

      <div class="hl">VISUAL LESSON COMING SOON</div>
      <p>This topic is part of the Excel Mastery ${t.mode === "learning_path" ? "learning path" : "reference library"}.
         The detailed visual lesson will be added soon.</p>

      <div class="cs-meta">
        <div><div class="k">Topic</div><div class="v">${esc(t.title)}</div></div>
        ${t.mode === "learning_path" ? `<div><div class="k">Step</div><div class="v">Step ${esc(t.stepCode)}</div></div>` : ""}
        <div><div class="k">Section</div><div class="v">${esc(t.section)}</div></div>
        <div><div class="k">Level</div><div class="v">${esc(t.level)}</div></div>
        <div><div class="k">Status</div><div class="v" style="color:var(--warn-txt)">${esc(t.statusLabel)}</div></div>
        <div><div class="k">Topic ID</div><div class="v" style="font-family:ui-monospace,monospace;font-size:11.5px">${esc(t.id)}</div></div>
      </div>

      ${objective ? `<div class="obj-note">
        <div class="k">Learning Objective</div>
        <div class="v">${esc(objective)}</div>
      </div>` : ""}

      ${step ? `<div class="obj-note">
        <div class="k">Expected Lesson</div>
        <div class="v">A visual lesson covering ${esc(t.title)} within Step ${esc(t.stepCode)} — ${esc(t.section)}.</div>
      </div>` : ""}

      ${step ? `<div style="margin-top:20px">
        <button class="btn" data-goto-step="${t.step}">View Step Overview</button>
      </div>` : ""}
    </div>
    <div id="practicePanel"></div>
    ${t.mode === "learning_path" ? `<div class="cs-bar">${topicBar(t)}</div>` : ""}`;
}

/* ---------- practice exercise panel (central PRACTICE_REGISTRY driven) ----------
   The Practice button is only rendered when a workbook is registered for the topic
   (see topicBar), so by the time this panel opens there IS a workbook. Content is
   taken entirely from PRACTICE_REGISTRY via getTopic().practiceMeta — never invented.
   Structure follows the required layout: PRACTICE EXERCISE / REAL-WORLD TASK /
   WHAT YOU WILL PRACTICE / WORKBOOK / HOW TO COMPLETE. */
function renderPractice(t, page) {
  const pm = t.practiceMeta;
  const file = t.practiceFile;
  if (!file) {
    /* Defensive fallback — button is hidden when no workbook, so this is rarely hit. */
    return `<div class="practice"><h4>PRACTICE EXERCISE</h4>
      <div class="note"><b>No practice workbook is attached to this lesson.</b></div></div>`;
  }
  const skills = (pm && pm.skills) ? pm.skills.map(x => `<li>${esc(x)}</li>`).join("") : "";
  const howTo = ((pm && pm.howTo) || [
    "Learn the visual lesson first.",
    "Download the workbook.",
    "Open the Practice sheet.",
    "Read the task carefully.",
    "Build the formulas yourself.",
    "Check your results.",
    "Open Solutions only after attempting the work.",
    "Compare your formulas and results.",
    "Fix any mistakes.",
    "Return to the LMS and mark the lesson complete."
  ]).map((s, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(s)}</span></li>`).join("");

  /* ---- NEW: topic-specific compact practice card (spec §3 / §8) ---- */
  const sheetName = (pm && pm.sheet) ? pm.sheet : "";
  const scenario = (pm && pm.scenario) ? pm.scenario : "";
  const exercises = (pm && Array.isArray(pm.exercises)) ? pm.exercises.map(e => `<li>${esc(e)}</li>`).join("") : "";
  const refGuide = (pm && Array.isArray(pm.referenceGuide)) ? `<div class="pr-sec">
      <div class="pr-sec-h">CELL REFERENCE TYPES</div>
      <ul class="pr-ref">
        ${pm.referenceGuide.map(r => `<li><b>${esc(r.type)}</b> <code>${esc(r.example)}</code> — ${esc(r.use)}</li>`).join("")}
      </ul>
    </div>` : "";
  const filterChallenge = (pm && pm.filterChallenge) ? `<div class="pr-challenge">${esc(pm.filterChallenge)}</div>` : "";

  const solutionLink = (pm && pm.solutionFile) ? `<a class="btn ghost sm" href="${esc(t.solutionFileUrl || t.practiceFileUrl)}" data-open-practice="solution:${esc(t.id)}">VIEW SOLUTION</a>` : "";
  const guideBtn = pm ? `<button class="btn ghost" data-practice-guide="${esc(t.id)}">VIEW PRACTICE GUIDE</button>` : "";

  const practiceCard = `
    <div class="pr-card">
      <div class="pr-card-badge">${(pm && pm.badge) ? esc(pm.badge) : (ICON.download || "📊") + " EXCEL PRACTICE WORKBOOK"}</div>
      <div class="pr-card-title">${esc((pm && pm.title) || "Basic Formulas — Practice & Solutions")}</div>
      <p class="pr-card-desc">Practice the formulas you just learned using realistic business and workplace datasets. Complete the exercises in Excel first, then use the solution section to check your work.</p>
      <div class="pr-card-skills">${(pm && pm.skills ? pm.skills.slice(0, 8) : ["SUM","AVERAGE","COUNT","MIN / MAX","Math Operators","Cell References","AutoSum","SUBTOTAL"]).map(s => `<span class="hp">${esc(s)}</span>`).join("")}</div>
      <div class="pr-card-actions">
        <a class="btn primary" href="${esc(t.practiceFileUrl)}" data-open-practice="${esc(t.id)}">${ICON.download || "▸"} ${(pm && pm.ctaLabel) ? esc(pm.ctaLabel) : "OPEN PRACTICE FILE"}</a>
        ${guideBtn}
      </div>
    </div>

    <div class="pr-topiccard">
      <div class="pr-topiccard-h">PUT IT INTO PRACTICE</div>
      <div class="pr-topiccard-scenario">${esc(scenario)}</div>
      <div class="pr-topiccard-body">${esc((pm && pm.realWorldTask) ? pm.realWorldTask : "Practice this topic on a realistic dataset.")}</div>
      ${exercises ? `<ul class="pr-topiccard-ex">${exercises}</ul>` : ""}
      <div class="pr-topiccard-sheet"><span>WORKBOOK</span> ${esc(sheetName)}</div>
      <div class="pr-topiccard-actions">
        <a class="btn primary sm" href="${esc(t.practiceFileUrl)}" data-open-practice="${esc(t.id)}">${(pm && pm.ctaLabel) ? esc(pm.ctaLabel) : "OPEN PRACTICE FILE"}</a>
        ${solutionLink}
      </div>
    </div>`;

  /* ---- NEW: "HOW TO USE THIS PRACTICE FILE" guide modal content (spec §4) ---- */
  const guideSteps = [
    "OPEN THE WORKBOOK — Open the Excel practice workbook in Microsoft Excel.",
    "CHOOSE YOUR TOPIC — Start with the same topic you have just learned.",
    "READ THE SCENARIO — Each sheet uses a realistic dataset instead of isolated formula examples.",
    "SOLVE IT YOURSELF — Enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
    "CHECK YOUR ANSWER — Use the Solution / Check section to compare your formula and result.",
    "CHANGE THE DATA — Change the input values and verify that your formulas still work.",
    "APPLY THE SKILL — Return to ResolvrPro and continue to the next topic."
  ];
  const guideModal = `
    <div class="pr-guide" id="prGuide" hidden>
      <div class="pr-guide-card">
        <div class="pr-guide-h">HOW TO USE THIS PRACTICE FILE</div>
        <ol class="pr-guide-list">${guideSteps.map((s,i)=>`<li><b>${String(i+1).padStart(2,"0")}</b><span>${esc(s)}</span></li>`).join("")}</ol>
        <div class="pr-guide-note">${esc((pm && pm.note) || "Don't just copy the formula. Understand why the formula works.")}</div>
        <button class="btn ghost" data-practice-guide-close="1">CLOSE</button>
      </div>
    </div>`;

  /* ---- NEW: READY FOR THE NEXT STEP progression (spec §9) ---- */
  const nxt = LMS.neighbours(t.id).next;
  const progression = `
    <div class="pr-next">
      <div class="pr-next-h">READY FOR THE NEXT STEP?</div>
      <div class="pr-next-flow">
        <span class="pr-step done">LEARN ✓</span><span class="pr-arrow">→</span>
        <span class="pr-step done">SEE ✓</span><span class="pr-arrow">→</span>
        <span class="pr-step current">PRACTICE → CURRENT</span><span class="pr-arrow">→</span>
        <span class="pr-step next">APPLY → NEXT</span>
      </div>
      <div class="pr-next-note">Practice in Excel → Complete the exercise → Check your solution ${nxt ? `→ Continue to <b>${esc(nxt.title)}</b>` : ""}</div>
      <button class="btn ghost sm" data-mark-practice="${esc(t.id)}">I COMPLETED THIS PRACTICE</button>
    </div>`;

  /* Optional chapter-specific scenario blocks (e.g. Logical Operators — 3 industries). */
  const scenarios = (pm && Array.isArray(pm.scenarios)) ? pm.scenarios.map(sc => `
    <div class="pr-scenario">
      <div class="pr-sc-sec">${esc(sc.section)}</div>
      <div class="pr-sc-title">${esc(sc.title)}</div>
      <div class="pr-sc-rule">${esc(sc.rule)}</div>
      <ol class="pr-sc-steps">${(sc.steps || []).map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    </div>`).join("") : "";
  const scenarioBlock = scenarios ? `<div class="pr-sec">
      <div class="pr-sec-h">SCENARIOS</div>
      ${scenarios}
    </div>` : "";

  /* Optional workbook-structure list (instructions / practice / solutions / answer key). */
  const wbStruct = (pm && Array.isArray(pm.workbookStructure)) ? `
    <div class="pr-sec">
      <div class="pr-sec-h">WORKBOOK SHEETS</div>
      <ul class="pr-wbstruct">
        ${pm.workbookStructure.map(w => `<li><b>${esc(w.name)}</b> — ${esc(w.purpose)}</li>`).join("")}
      </ul>
      <div class="pr-note-soft">Complete the Practice sheets first; use the Solutions sheets only after attempting the questions.</div>
    </div>` : "";

  /* New Level 5 detailed fields (rendered only when present). */
  const f = (label, val) => (val ? `<div class="pr-sec">
      <div class="pr-sec-h">${label}</div>
      <div class="pr-sec-b">${esc(val)}</div>
    </div>` : "");
  const dataBlock = (pm && pm.dataset) ? `<div class="pr-sec">
      <div class="pr-sec-h">DATA PROVIDED</div>
      <div class="pr-sec-b">${esc(pm.dataset)}</div>
    </div>` : "";
  const taskBlock = (pm && pm.task) ? `<div class="pr-sec">
      <div class="pr-sec-h">YOUR TASK</div>
      <div class="pr-sec-b">${esc(pm.task)}</div>
    </div>` : "";
  const solBlock = (pm && pm.solution) ? `<div class="pr-sec">
      <div class="pr-sec-h">SOLUTION GUIDANCE</div>
      <div class="pr-sec-b">${esc(pm.solution)}</div>
    </div>` : "";
  const aiBlock = (pm && pm.aiApplication) ? `<div class="pr-sec">
      <div class="pr-sec-h">AI APPLICATION</div>
      <div class="pr-sec-b">${esc(pm.aiApplication)}</div>
    </div>` : "";
  const expectedBlock = (pm && pm.expectedOutput) ? `<div class="pr-sec">
      <div class="pr-sec-h">EXPECTED OUTPUT</div>
      <div class="pr-sec-b">${esc(pm.expectedOutput)}</div>
    </div>` : "";

  return `<div class="practice">
    <h4>PRACTICE EXERCISE</h4>
    <div class="pr-topic">${esc(t.title)}</div>
    ${pm && pm.title ? `<div class="pr-practice-title">${esc(pm.title)}</div>` : ""}

    ${practiceCard}

    ${(pm && pm.tryFirst) ? `<div class="pr-note-soft">${esc(pm.tryFirst)}</div>` : ""}

    ${f("REAL-WORLD BUSINESS PROBLEM", (pm && pm.problem) ? pm.problem : (pm && pm.realWorldTask))}
    ${f("BUSINESS CONTEXT", (pm && pm.context))}
    ${f("YOUR OBJECTIVE", (pm && pm.objective))}

    ${dataBlock}
    ${taskBlock}

    ${skills ? `<div class="pr-sec">
      <div class="pr-sec-h">SKILLS PRACTICED</div>
      <ul class="pr-skills">${skills}</ul>
    </div>` : ""}

    ${expectedBlock}
    ${solBlock}
    ${aiBlock}

    ${pm && pm.activity ? `<div class="pr-sec">
      <div class="pr-sec-h">ACTIVITY</div>
      <div class="pr-sec-b">${esc(pm.activity)}</div>
    </div>` : ""}

    ${refGuide}
    ${filterChallenge ? `<div class="pr-sec">${filterChallenge}</div>` : ""}

    ${scenarioBlock}

    <div class="pr-sec">
      <div class="pr-sec-h">WORKBOOK</div>
      <div class="pr-wb-name">${esc(file.split("/").pop())}</div>
      <div class="pr-wb-sheet">Open sheet: <b>${esc(sheetName)}</b></div>
      <a class="btn primary" download href="${esc(t.practiceFileUrl)}">${ICON.download} Download Excel Practice File</a>
    </div>

    ${wbStruct}

    <div class="pr-sec">
      <div class="pr-sec-h">HOW TO COMPLETE</div>
      <ol class="pr-howto">${howTo}</ol>
    </div>

    ${progression}

    ${guideModal}
  </div>`;
}

/* ---------- viewer controls (zoom / fit / fullscreen) ---------- */
const Viewer = (() => {
  let zoom = 1, page = 0, pages = 1;
  const clamp = z => Math.min(6, Math.max(0.1, z));

  const allPages = () => Array.from(document.querySelectorAll(".lesson-page"));
  /* the page currently on screen — single-page lessons return the only image */
  const current = () => allPages()[page] || document.getElementById("lessonImg");

  function apply() {
    const img = current();
    const lbl = document.getElementById("zoomLbl");
    if (!img) return;
    img.style.transform = `scale(${zoom})`;
    /* keep the scrollable area correct when scaled up */
    img.style.marginBottom = zoom > 1 ? `${img.naturalHeight * (zoom - 1)}px` : "0";
    if (lbl) lbl.textContent = Math.round(zoom * 100) + "%";
  }

  /* ---- FINAL SESSION PROJECT card visibility (single source of truth) ----
     Visible ONLY on the last page of its owning topic. Honours a learner-initiated
     collapse (dataset.collapsed) and resets it when leaving the last page so the
     card reappears next time. Deferred one frame so it never flashes mid-paint. */
  function syncFinalProject() {
    const fp = document.getElementById("finalProjCard");
    const showBtn = document.getElementById("finalProjShow");
    const onLast = pages > 1 && page === pages - 1;
    if (!fp) return;
    if (onLast) {
      if (!fp.dataset.collapsed) fp.hidden = false;
      if (showBtn) showBtn.hidden = !!fp.dataset.collapsed;
    } else {
      fp.hidden = true;
      fp.dataset.collapsed = "";           /* reset collapse so it reappears next time on last page */
      if (showBtn) showBtn.hidden = true;
    }
  }
  function paintPage() {
    const list = allPages();
    list.forEach((im, i) => {
      im.classList.toggle("on", i === page);
      const wrap = im.closest(".lesson-page-wrap");
      if (wrap) wrap.classList.toggle("on", i === page);
    });
    const lbl = document.getElementById("pageLbl");
    if (lbl) lbl.textContent = `Page ${page + 1} / ${pages}`;
    const stage = document.getElementById("stage");
    if (stage) { stage.scrollTop = 0; stage.scrollLeft = 0; }
    requestAnimationFrame(syncFinalProject);   /* settle card after layout — no flash */
  }
  function goPage(i) {
    if (pages < 2) return;
    page = (i + pages) % pages;          /* wraps both ways */
    paintPage();
    fit();                               /* re-fit the newly shown page */
  }

  /* Fit to WIDTH primarily (info-dense lesson art stays readable), never upscale */
  function fit() {
    const img = current();
    const stage = document.getElementById("stage");
    if (!img || !stage || !img.naturalWidth) return;
    const pad = 46;
    zoom = clamp(Math.min(1, (stage.clientWidth - pad) / img.naturalWidth));
    apply();
    stage.scrollTop = 0; stage.scrollLeft = 0;
  }

  /* ---- drag-to-pan when zoomed beyond fit (stage is scrollable) ---- */
  let panning = false, psx = 0, psy = 0, psl = 0, pst = 0;
  function bindPan(stage) {
    if (!stage) return;
    stage.style.cursor = zoom > 1 ? "grab" : "default";
    stage.addEventListener("pointerdown", e => {
      if (zoom <= 1) return;
      panning = true; psx = e.clientX; psy = e.clientY;
      psl = stage.scrollLeft; pst = stage.scrollTop;
      stage.style.cursor = "grabbing"; stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", e => {
      if (!panning) return;
      stage.scrollLeft = psl - (e.clientX - psx);
      stage.scrollTop  = pst - (e.clientY - psy);
    });
    const end = () => { panning = false; stage.style.cursor = zoom > 1 ? "grab" : "default"; };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("pointerleave", end);
  }

  function init(topicId, page) {
    page = (page == null ? 0 : Number(page)) || 0;
    pages = Math.max(1, allPages().length);
    const img = current();
    if (!img) return;
    if (pages > 1) paintPage();
    /* Default = fit to width so the whole lesson is visible; zoom/fullscreen for detail. */
    zoom = 1;
    if (img.complete && img.naturalWidth) fit();
    else img.addEventListener("load", fit, { once: true });
    const st = document.getElementById("stage");
    if (st) bindPan(st);
    /* ensure FINAL PROJECT card visibility matches the loaded page (deferred — no flash) */
    requestAnimationFrame(syncFinalProject);
  }

  function handle(action) {
    const viewer = document.getElementById("viewer");
    switch (action) {
      case "in":    zoom = clamp(zoom * 1.25); apply(); break;
      case "out":   zoom = clamp(zoom / 1.25); apply(); break;
      case "reset": zoom = 1; apply(); break;      /* 100% actual size */
      case "fit":   fit(); break;
      case "fs":
        if (!viewer) break;
        viewer.classList.toggle("fs");
        const on = viewer.classList.contains("fs");
        const b = document.getElementById("fsBtn");
        if (b) b.classList.toggle("on", on);   /* icon-only: just toggle active state */
        setTimeout(fit, 60);   /* maximise use of the new space */
        break;
    }
  }

  function exitFs() {
    const v = document.getElementById("viewer");
    if (v && v.classList.contains("fs")) { handle("fs"); return true; }
    return false;
  }

  function handlePage(dir) { goPage(dir === "next" ? page + 1 : page - 1); }

  return { init, handle, exitFs, handlePage, page: () => page, pages: () => pages };
})();
