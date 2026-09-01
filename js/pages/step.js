/* ===== PAGE: CHAPTER OVERVIEW ===== */
function renderChapterOverview(topicId) {
  const t = LMS.getTopic(topicId);
  if (!t) return `<div class="empty">Chapter not found.</div>`;
  if (!t.hasLesson) return `<div class="empty">This chapter is Coming Soon.</div>`;
  const step = LMS.getStep(t.step);
  const pages = t.lessonPageUrls ? t.lessonPageUrls.length : ((t.lessonImages || [t.lessonImage]).filter(Boolean).length || 1);
  const explanations = t.pageExplanations || [];
  const pm = t.practiceMeta;
  const objectives = (step && Array.isArray(step.objectives)) ? step.objectives.slice(0, 5) : [];

  const prev = LMS.neighbours(t.id).prev;
  const next = LMS.neighbours(t.id).next;

  const lessonRows = Array.from({ length: pages }, (_, i) => {
    const isLast = i === pages - 1;
    const status = t.isCompleted ? "done" : (isLast ? "current" : "ok");
    const expl = explanations[i] ? explanations[i].split("—")[0].split(".")[0].trim().substring(0, 55) : null;
    const label = expl ? `Lesson ${String(i + 1).padStart(2, "0")} — ${esc(expl)}` : `Lesson ${String(i + 1).padStart(2, "0")}`;
    return `
    <div class="cl-row ${status}" data-goto-topic="${esc(t.id)}" data-page="${i}">
      <div class="cl-icon">${status === "done" ? "✓" : status === "current" ? "→" : "○"}</div>
      <div class="cl-title">${label}</div>
    </div>`;
  }).join("");

  const pct = t.isCompleted ? 100 : Math.round(((pages - 1) / pages) * 100);
  const practiceAvailable = !!t.practiceFile;

  return `
    <div class="chapter-overview">
      <div class="ch-hd">
        <div class="ch-num">${String(LMS.stepTopics(t.step).findIndex(x => x.id === t.id) + 1).padStart(2, "0")}</div>
        <div>
          <div class="ch-label">CHAPTER</div>
          <h1>${esc(t.title)}</h1>
          <p class="ch-sub">${esc(step ? step.subtitle || step.section : t.title)}</p>
        </div>
      </div>

      <div class="ch-progress">
        <div class="ch-progress-lbl"><span>Progress</span><span>${pct}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="ch-stats">${pages} Lessons · ${t.isCompleted ? 'Completed' : ((pages-1) + ' Completed · 1 In Progress')} · ${practiceAvailable ? 'Practice Available' : 'No Practice Yet'}</div>
      </div>

      <button class="btn primary lg" data-goto-topic="${esc(t.id)}" data-page="0">START CHAPTER →</button>

      ${objectives.length ? `
      <div class="ch-path">
        <div class="ch-path-h">LEARNING OBJECTIVES</div>
        <ul class="objs">${objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
      </div>` : ""}

      <div class="ch-path">
        <div class="ch-path-h">LESSON PATH</div>
        <div class="cl-list">${lessonRows}</div>
      </div>

      ${practiceAvailable ? `
      <div class="ch-practice">
        <div class="ch-path-h">PRACTICE</div>
        <p class="ch-practice-desc">Practice the concepts from this chapter using realistic business scenarios.</p>
        <div class="pr-topiccard-actions">
          <a class="btn primary" href="${esc(t.practiceFileUrl)}" data-open-practice="${esc(t.id)}">DOWNLOAD PRACTICE</a>
          <a class="btn ghost sm" href="${esc(t.practiceFileUrl)}" target="_blank">VIEW SOLUTION</a>
        </div>
      </div>` : ""}

      <div class="ch-nav">
        ${prev ? `<button class="btn" data-goto-topic="${esc(prev.id)}">← ${esc(prev.title)}</button>` : `<span></span>`}
        ${next ? `<button class="btn" data-goto-topic="${esc(next.id)}">${esc(next.title)} →</button>` : `<span></span>`}
      </div>
    </div>`;
}

/* ===== PAGE: STEP OVERVIEW ===== */
function renderStep(stepNo) {
  const s = LMS.getStep(stepNo);
  if (!s) return `<div class="empty">Step not found.</div>`;
  const p = LMS.stepProgress(s.step);
  const topics = LMS.stepTopics(s.step);

  const rows = topics.map(t => `
    <div class="trow ${t.isCompleted ? "done" : t.hasLesson ? "ok" : ""}" data-goto-topic="${esc(t.id)}">
      <div class="tmark">${t.hasLesson ? ICON.check : "○"}</div>
      <div class="tinfo">
        <div class="t">${esc(t.title)}</div>
        <div class="s">${esc(t.summary)}</div>
      </div>
      ${levelBadge(t)} ${badge(t)}
    </div>`).join("");

  const availableList = topics.filter(t => t.hasLesson);

  /* ---- Session 3 card view: 5 chapter overview cards ---- */
  const isSession3 = s.step === 11;
  const chapterCards = isSession3 ? `
    <div class="session-cards" style="margin-bottom:18px">
      <h3 style="margin:0 0 10px;font-size:15px;font-weight:700;color:var(--g-800)">CHAPTER OVERVIEW</h3>
      <div class="cards-grid">
        ${topics.map((t, i) => {
          const pm = t.practiceMeta;
          const done = t.isCompleted ? "done" : (t.hasLesson ? "ok" : "");
          const lessons = (t.lessonImages ? t.lessonImages.length : (t.lessonPageUrls ? t.lessonPageUrls.length : 0)) || 1;
          return `
          <div class="ch-card ${done}" data-goto-chapter="${esc(t.id)}">
            <div class="ch-num">${String(i + 1).padStart(2, "0")}</div>
            <div class="ch-name">${esc(t.title)}</div>
            <div class="ch-meta">${lessons} Lesson${lessons>1?'s':''} · ${pm ? 'Practice Available' : 'Coming Soon'}</div>
            <div class="ch-actions"><span class="btn sm primary" data-goto-chapter="${esc(t.id)}">CONTINUE</span></div>
          </div>`;
        }).join("")}
      </div>
    </div>` : "";

  const practiceHubBtn = isSession3 ? `
    <div style="margin-bottom:14px">
      <button class="btn primary" data-goto-practice-hub="${s.step}">📊 SESSION 3 — EXCEL PRACTICE LAB</button>
    </div>` : "";

  return `
    <div class="page-hd">
      <div class="big-num">${esc(s.code)}</div>
      <div>
        <h1>${esc(s.section)}</h1>
        <div class="sub">${esc(s.subtitle)}</div>
        <div class="desc">${esc(s.description)}</div>
        <div class="chips">
          <span class="badge b-level">${esc(s.level)}</span>
          <span class="badge b-available">${p.available} Available</span>
          <span class="badge b-coming_soon">${p.total - p.available} Coming Soon</span>
        </div>
      </div>
    </div>

    ${practiceHubBtn}
    ${chapterCards}

    <div class="grid2">
      <div>
        <div class="panel">
          <h4>TOPICS — ${esc(p.label)}</h4>
          <div class="mini" style="margin-bottom:16px"><i style="width:${p.pctAvailable}%"></i></div>
          <div class="tlist">${rows}</div>
        </div>
      </div>
      <div>
        <div class="panel">
          <h4>LEARNING OBJECTIVES</h4>
          <ul class="objs">${s.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
        </div>
        <div class="panel">
          <h4>REAL WORLD PROJECT</h4>
          <div class="rw">
            <div class="k">REAL WORLD EXAMPLE</div>
            <div class="v">${esc(s.realWorldExample)}</div>
          </div>
        </div>
        <div class="panel">
          <h4>AVAILABLE VISUAL LESSONS</h4>
          ${availableList.length
            ? `<div class="tlist">${availableList.map(t => `
                <div class="trow ok" data-goto-topic="${esc(t.id)}">
                  <div class="tmark">${ICON.check}</div>
                  <div class="tinfo"><div class="t">${esc(t.title)}</div></div>
                </div>`).join("")}</div>`
            : `<div class="empty" style="padding:20px;font-size:13px">No visual lessons published for this step yet.</div>`}
        </div>
        ${s.challengeFile ? `
        <div class="panel challenge-card">
          <h4>${esc(s.challengeTitle || (s.section + " — Mixed Challenge"))}</h4>
          <div class="challenge-body">
            <div class="challenge-ico">🏆</div>
            <div>
              <div class="challenge-t">${esc(s.challengeTitle || (s.section + " — Mixed Challenge"))}</div>
              <div class="challenge-d">${esc(s.challengeDesc || ("After practising each chapter, combine every " + s.section + " skill on one realistic dataset. Open the <b>" + (s.challengeSheet || "Capstone") + "</b> sheet and solve it before checking the solution."))}</div>
              <a class="btn primary sm" href="${esc(LMS.assetUrl(s.challengeFile))}" data-open-practice="challenge:${esc(s.step)}">OPEN PRACTICE PROJECT</a>
            </div>
          </div>
        </div>` : ""}
      </div>
    </div>`;
}
