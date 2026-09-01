/* ===== PAGE: SESSION PRACTICE HUB ===== */
function renderPracticeHub(stepNo) {
  const s = LMS.getStep(stepNo);
  if (!s) return `<div class="empty">Session not found.</div>`;
  const topics = LMS.stepTopics(stepNo).filter(t => t.practiceFile);
  const p = LMS.stepProgress(stepNo);

  const cards = topics.map((t, i) => {
    const pm = t.practiceMeta;
    const skills = (pm && Array.isArray(pm.skills))
      ? pm.skills.slice(0, 6).map(sk => `<span class="hp">${esc(sk)}</span>`).join("")
      : "";
    const title = (pm && pm.title) ? esc(pm.title) : esc(t.title) + " Practice";
    const desc  = (pm && pm.realWorldTask) ? esc(pm.realWorldTask)
      : `Practice the concepts from ${esc(t.title)} using realistic business scenarios.`;
    return `
    <div class="hub-card">
      <div class="hub-hd">
        <span class="hub-num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <div class="hub-t">${esc(t.title)}</div>
          <div class="hub-sub">Level 3 · Session 3 · Chapter ${i + 1}</div>
        </div>
      </div>
      <p class="hub-desc">${desc}</p>
      <div class="hub-skills">${skills}</div>
      <div class="hub-actions">
        <a class="btn primary" href="${esc(t.practiceFileUrl)}" data-open-practice="${esc(t.id)}">PRACTICE</a>
        <a class="btn ghost sm" href="${esc(t.practiceFileUrl)}" target="_blank">VIEW SOLUTION</a>
      </div>
    </div>`;
  }).join("");

  return `
    <div class="page-hd">
      <div class="big-num">${esc(s.code)}</div>
      <div>
        <h1>${esc(s.section)}</h1>
        <div class="sub">SESSION 3 — EXCEL PRACTICE LAB</div>
        <div class="desc">Work through each chapter's practice workbook, attempt the exercises first, then open the solution to verify your formulas and results.</div>
        <div class="chips">
          <span class="badge b-level">${esc(s.level)}</span>
          <span class="badge b-available">${topics.length} Practice Workbooks</span>
        </div>
      </div>
    </div>
    <div class="hub-grid">${cards}</div>
    <div style="margin-top:18px">
      <button class="btn" data-goto-step="${s.step}">← Back to Session Overview</button>
    </div>`;
}
