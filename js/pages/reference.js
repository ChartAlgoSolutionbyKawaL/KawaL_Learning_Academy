/* ===== PAGE: EXCEL REFERENCE OVERVIEW ===== */
function renderReferenceHome() {
  const LABEL = {
    "Excel Reference": "EXCEL REFERENCE",
    "Advanced Excel": "ADVANCED EXCEL",
    "Dashboards": "DASHBOARDS",
    "Practice & Guidance": "MORE RESOURCES"
  };

  return `
    <div class="page-hd">
      <div>
        <h1>Excel Reference</h1>
        <div class="sub">Look Up Any Excel Feature Directly</div>
        <div class="desc">The complete Excel ribbon and advanced-feature navigation. Use this when you
          want to jump straight to a feature instead of following the sequenced learning path.</div>
      </div>
    </div>
    ${LMS.allReferenceGroups().map(g => `
      <div class="sec-title">${esc(LABEL[g.group] || g.group.toUpperCase())}</div>
      <div class="ref-grid">
        ${g.topics.map(raw => {
          const t = LMS.getTopic(raw.id);
          return `<div class="ref-card" data-goto-topic="${esc(t.id)}">
            <div class="t">${esc(t.title)}</div>
            <div class="k">${esc((t.keywords || []).slice(0, 4).join(" · "))}</div>
            <div style="margin-top:11px">${badge(t)}</div>
          </div>`;
        }).join("")}
      </div>`).join("")}`;
}
