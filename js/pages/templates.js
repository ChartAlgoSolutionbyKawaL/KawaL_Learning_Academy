/* ==========================================================================
   FREE TEMPLATE BUNDLES — Level 5 BONUS resource center
   A native ResolvrPro LMS bonus page. Learners browse public template
   resources, filter by category, search, inspect filenames, and request a
   specific free bundle through a WhatsApp pre-filled message.

   ADDITIVE ONLY: does not touch official LMS progress, navigation, lessons,
   or any other product. Own view ("templates"), own sidebar link, own
   localStorage NOT used (request goes straight to WhatsApp).
   ========================================================================== */
const Templates = (() => {
  let filter = "all";
  let query = "";
  let sort = "newest";        // newest | name | size
  let page = 1;
  const PER_PAGE = 9;
  let modal = null;           // { bundle, name, profile, email, mobile, courses:[] }
  let selectedFile = null;    // bundle chosen via a row "Request Free File" (null = generic)

  /* ---- derive a bundle's tags so filters line up with the reference counts ---- */
  function tagsOf(b) {
    const tags = new Set();
    if (b.category === "Excel Templates") { tags.add("excel"); tags.add("templates"); }
    if (b.category === "Bundle")          { tags.add("bundles"); tags.add("templates"); }
    if (b.category === "Business")        { tags.add("business"); tags.add("templates"); }
    if (b.category === "PowerPoint")      { tags.add("powerpoint"); tags.add("templates"); }
    if (b.category === "Word")            { tags.add("word"); tags.add("templates"); }
    /* format-based Excel membership (Bundle #5 contains Excel) */
    if (b.formats.indexOf("Excel") !== -1) tags.add("excel");
    if (b.formats.indexOf("Word") !== -1) tags.add("word");
    if (b.formats.indexOf("PowerPoint") !== -1) tags.add("powerpoint");
    return tags;
  }

  function counts() {
    return Object.assign({}, TEMPLATE_FILTER_COUNTS);
  }

  function visible() {
    const q = query.trim().toLowerCase();
    let list = TEMPLATE_BUNDLES.filter(b => {
      if (filter !== "all" && !tagsOf(b).has(filter)) return false;
      if (q) {
        const hay = (b.title + " " + b.file + " " + b.category + " " + b.formats.join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "name") list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "size") list = list.slice().sort((a, b) => b.sizeKB - a.sizeKB);
    else list = list.slice().sort((a, b) => b.id.localeCompare(a.id)); /* newest added = highest id */
    return list;
  }

  /* ---- format icons (brand colours) ---- */
  function fmtIcon(f) {
    const map = {
      Excel:      { c: "xlsx", col: "#1f7a42", label: "XLSX" },
      Word:       { c: "docx", col: "#2f6fd0", label: "DOCX" },
      PowerPoint: { c: "pptx", col: "#d9822b", label: "PPTX" }
    };
    const m = map[f] || { c: "file", col: "#6b7a72", label: f };
    const txt = m.label === "PPTX" ? "P" : m.label === "DOCX" ? "W" : "X";
    return `<span class="fmt fmt-${m.c}" style="--fc:${m.col}" title="${m.label}">${txt}</span>`;
  }

  function filterPills() {
    const c = counts();
    return TEMPLATE_FILTERS.map(f =>
      `<button class="tp-pill ${f.id === filter ? "on" : ""}" data-tp-filter="${f.id}">${esc(f.label)} <span class="tp-cnt">${c[f.id]}</span></button>`
    ).join("");
  }

  /* ---- render the whole templates view ---- */
  function render() {
    const c = counts();
    const list = visible();
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PER_PAGE;
    const rows = list.slice(start, start + PER_PAGE);
    const showingTo = Math.min(start + PER_PAGE, total);

    return `
    <div class="tp">
      <!-- HERO -->
      <section class="tp-hero">
        <div class="tp-hero-left">
          <div class="tp-eyebrow">RESOLVRPRO · LEARNING ACADEMY</div>
          <h1 class="tp-title">FREE TEMPLATE BUNDLES</h1>
          <div class="tp-sub">Excel • Word • PowerPoint Templates</div>
          <p class="tp-desc">A curated collection of publicly available template resources collected in one place for learning, practice, inspiration and sample reference.</p>
          <div class="tp-badges">
            <span class="tp-badge">✓ 100% Free</span>
            <span class="tp-badge">✓ Public Resources</span>
            <span class="tp-badge">✓ Learning Focused</span>
            <span class="tp-badge">✓ Sample &amp; Inspiration</span>
          </div>
          <div class="tp-flow">Browse → Request → Receive → Explore</div>
        </div>
        <div class="tp-hero-art" aria-hidden="true">
          <img class="tp-hero-img" src="assets/img/template-bundles.png" alt="Excel, Word and PowerPoint template files">
        </div>
      </section>

      <!-- MAIN 74 / RIGHT 26 -->
      <div class="tp-grid">
        <main class="tp-main">
          <div class="tp-lib">
            <div class="tp-lib-hd">
              <span class="tp-lib-title">Template Library</span>
              <div class="tp-lib-tools">
                <div class="tp-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                  <input id="tpSearch" type="search" placeholder="Search templates..." autocomplete="off" value="${esc(query)}">
                </div>
                <select class="tp-sort" id="tpSort" aria-label="Sort templates">
                  <option value="newest"${sort === "newest" ? " selected" : ""}>Sort by: Newest Added</option>
                  <option value="name"${sort === "name" ? " selected" : ""}>Sort by: Name (A–Z)</option>
                  <option value="size"${sort === "size" ? " selected" : ""}>Sort by: Size</option>
                </select>
              </div>
            </div>

            <div class="tp-pills" id="tpPills">${filterPills()}</div>

            <div class="tp-table" role="table" aria-label="Template bundles">
              <div class="tp-tr tp-th" role="row">
                <div class="tp-c tp-c-num">#</div>
                <div class="tp-c tp-c-name">Template Bundle</div>
                <div class="tp-c tp-c-cat">Category</div>
                <div class="tp-c tp-c-fmt">Formats</div>
                <div class="tp-c tp-c-size">Size</div>
                <div class="tp-c tp-c-act">Action</div>
              </div>
              ${rows.map(rowHTML).join("") || `<div class="tp-empty">No bundles match your filter / search.</div>`}
            </div>

            <div class="tp-pager">
              <span class="tp-pager-info">Showing ${total ? start + 1 : 0} to ${showingTo} of ${total} templates</span>
              <div class="tp-pager-nav">
                <button class="tp-pg" data-tp-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>‹</button>
                ${pagerNums(page, pages)}
                <button class="tp-pg" data-tp-page="${page + 1}" ${page >= pages ? "disabled" : ""}>›</button>
              </div>
            </div>
          </div>

          <!-- BOTTOM LEARNING SECTION -->
          <section class="tp-sec">
            <div class="tp-sec-h">WHAT CAN YOU DO WITH THESE RESOURCES?</div>
            <div class="tp-do-row">
              ${doCards()}
            </div>
          </section>
        </main>

        <!-- RIGHT STICKY PANEL -->
        <aside class="tp-aside">
          <div class="tp-how">
            <div class="tp-how-h">HOW TO GET YOUR FREE FILE</div>
            <ol class="tp-steps">
              <li><span class="tp-step-ico">📁</span><div><b>Choose a bundle</b><span>Browse and select the resource.</span></div></li>
              <li><span class="tp-step-ico">💬</span><div><b>Send WhatsApp request</b><span>Click Request Free File and submit your details.</span></div></li>
              <li><span class="tp-step-ico">🛡</span><div><b>Verify &amp; Prepare</b><span>ResolverPro support reviews your request and resource availability.</span></div></li>
              <li><span class="tp-step-ico">📥</span><div><b>Receive the file</b><span>The resource is shared with you through WhatsApp where permitted.</span></div></li>
            </ol>
            <button class="tp-cta" id="btnRequestWA" data-tp-request>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.47 1.32 4.98L2 22l5.25-1.36a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.16 0 4.18.84 5.7 2.37a8.02 8.02 0 0 1 2.36 5.74c0 4.45-3.62 8.07-8.07 8.07-1.6 0-3.15-.47-4.47-1.36l-.32-.2-3.11.81.83-3.04-.21-.33a8.05 8.05 0 0 1-1.25-4.31c0-4.45 3.62-8.07 8.07-8.07zm-3.9 4.2c-.2 0-.52.08-.79.38-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.12 3.24 5.15 4.43 2.5 1.05 3.32.9 3.94.84.62-.06 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.29-.22-.62-.39-.33-.17-1.96-.97-2.26-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.71.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.65-1.97-1.85-2.3-.19-.33-.02-.51.15-.68.16-.16.35-.42.53-.63.18-.21.23-.36.35-.6.12-.24.06-.45-.03-.63-.09-.18-.74-1.78-1.01-2.44z"/></svg>
              Request via WhatsApp
            </button>
            <div class="tp-cta-sub">Fast • Simple • 100% Free</div>

            <div class="tp-note tp-note-wisely">
              <div class="tp-note-h">💡 USE THESE FILES WISELY</div>
              <p>These resources are provided as learning, practice, reference and inspiration materials.</p>
              <p>Study layouts, formulas, dashboards, reports and document structures to improve your own original work.</p>
              <p>Please respect original licensing and usage terms before commercial redistribution or republishing.</p>
            </div>

            <div class="tp-note tp-notice">
              <div class="tp-note-h">RESOURCE NOTICE</div>
              <p>This library organizes publicly available template resources in one convenient learning center.</p>
              <p>Original ownership, attribution and licensing remain with the respective creators and source providers.</p>
              <p>ResolverPro does not imply ownership of third-party resources.</p>
              <p>Users are responsible for complying with applicable usage and licensing terms.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>

    ${modalHTML()}`;
  }

  function rowHTML(b) {
    return `
      <div class="tp-tr ${b.id === (selectedFile && selectedFile.id) ? "sel" : ""}" role="row" data-tp-id="${b.id}">
        <div class="tp-c tp-c-num">${esc(b.serial)}</div>
        <div class="tp-c tp-c-name">
          <span class="tp-folder">📁</span>
          <span class="tp-name" title="${esc(b.file)}">${esc(b.file)}</span>
        </div>
        <div class="tp-c tp-c-cat">${esc(b.category)}</div>
        <div class="tp-c tp-c-fmt">${b.formats.map(fmtIcon).join("")}</div>
        <div class="tp-c tp-c-size">${esc(b.sizeLabel)}</div>
        <div class="tp-c tp-c-act">
          <button class="tp-req" data-tp-req="${b.id}">Request Free File</button>
        </div>
      </div>`;
  }

  function pagerNums(cur, pages) {
    const nums = [];
    for (let i = 1; i <= pages; i++) nums.push(`<button class="tp-pg ${i === cur ? "on" : ""}" data-tp-page="${i}">${i}</button>`);
    return nums.join("");
  }

  function doCards() {
    const items = [
      { t: "STUDY",      d: "Understand professional spreadsheet structures.", ico: "🎓" },
      { t: "GET INSPIRED", d: "Explore layouts, dashboards and document ideas.", ico: "💡" },
      { t: "PRACTICE",    d: "Use sample templates to improve Excel, Word and PowerPoint skills.", ico: "📋" },
      { t: "ADAPT",      d: "Learn how different business templates are structured.", ico: "🧩" },
      { t: "REFERENCE",   d: "Keep examples available for future learning.", ico: "📚" },
      { t: "BUILD",      d: "Use what you learn to create your own original work.", ico: "🚀" }
    ];
    return items.map(c => `
      <div class="tp-do">
        <span class="tp-do-ico">${c.ico}</span>
        <div class="tp-do-t">${esc(c.t)}</div>
        <div class="tp-do-d">${esc(c.d)}</div>
      </div>`).join("");
  }

  /* ---- request modal (per bundle, or generic from the right CTA) ---- */
  function openModal(bundle) {
    selectedFile = bundle || null;
    modal = { name: "", profile: "", email: "", mobile: "", courses: [] };
  }
  function closeModal() { modal = null; }

  function modalHTML() {
    if (!modal) return `<div class="tp-modal" id="tpModal" hidden></div>`;
    const sel = selectedFile;
    const upskill = TEMPLATE_UPSKILL.map((c, i) =>
      `<button class="tp-up ${modal.courses.indexOf(c) !== -1 ? "on" : ""}" data-tp-up="${i}">${esc(c)}</button>`).join("");
    return `
    <div class="tp-modal on" id="tpModal" role="dialog" aria-modal="true">
      <div class="tp-modal-scrim" data-tp-close></div>
      <div class="tp-modal-card">
        <button class="tp-modal-x" data-tp-close aria-label="Close">${ICON.close || "✕"}</button>
        <div class="tp-modal-head">
          <h2>Request Your Free Template Bundle</h2>
          <p>Get this learning resource through ResolvrPro support.</p>
        </div>

        ${sel ? `
        <div class="tp-sel-res">
          <div class="tp-sel-h">Selected Resource</div>
          <div class="tp-sel-row"><span class="tp-sel-serial">${esc(sel.serial)}</span> — ${esc(sel.title)}</div>
          <div class="tp-sel-file">${esc(sel.file)}</div>
        </div>` : `
        <div class="tp-sel-res tp-sel-res--any">
          <div class="tp-sel-h">Selected Resource</div>
          <div class="tp-sel-row">General template bundle request</div>
        </div>`}

        <div class="tp-form">
          <label class="tp-fld">
            <span>Your Name <i>*</i></span>
            <input id="tpName" type="text" placeholder="e.g. Kawaljeet Singh" value="${esc(modal.name)}" required>
          </label>
          <label class="tp-fld">
            <span>Current Profile <i>*</i></span>
            <select id="tpProfile" required>
              <option value="" disabled ${modal.profile ? "" : "selected"}>Select…</option>
              ${TEMPLATE_PROFILES.map(p => `<option value="${esc(p)}"${modal.profile === p ? " selected" : ""}>${esc(p)}</option>`).join("")}
            </select>
          </label>
          <label class="tp-fld">
            <span>Email Address <i>*</i></span>
            <input id="tpEmail" type="email" placeholder="you@example.com" value="${esc(modal.email)}" required>
          </label>
          <label class="tp-fld">
            <span>Mobile Number <i>*</i></span>
            <input id="tpMobile" type="tel" inputmode="numeric" placeholder="9876543210" value="${esc(modal.mobile)}" required>
          </label>
        </div>

        <div class="tp-upskill">
          <div class="tp-upskill-h">What would you like to learn?</div>
          <div class="tp-upskill-row">${upskill}</div>
          <div class="tp-upskill-note">Select one or more topics you'd like to learn (optional). Helps us understand your interest.</div>
        </div>

        <div class="tp-confirm">
          <span>✓ No payment required</span>
          <span>✓ Learning resource request</span>
          <span>✓ Shared through WhatsApp</span>
          <span>✓ Please use responsibly</span>
        </div>

        <div class="tp-source-note">
          <b>Source &amp; Usage:</b> ResolvrPro shares these template bundles as a convenience resource library.
          ${sel && sel.source ? `Source: ${esc(sel.source)}. ` : ""}Please verify the original author/licence where applicable and use the files for your own learning and work.
        </div>

        <div class="tp-modal-actions">
          <button class="tp-btn-cancel" data-tp-close>Cancel</button>
          <button class="tp-btn-go" id="btnContinueWA" data-tp-submit>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.47 1.32 4.98L2 22l5.25-1.36a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 15.91h-.01c-.55 0-1.09-.15-1.57-.43l-.12-.08-3.11.81.83-3.04-.21-.33a8.05 8.05 0 0 1-1.25-4.31c0-4.45 3.62-8.07 8.07-8.07 4.45 0 8.07 3.62 8.07 8.07s-3.62 8.07-8.07 8.07z"/></svg>
            Continue to WhatsApp
          </button>
        </div>
      </div>
    </div>`;
  }

  /* keep typed field values in sync with the model before any re-render so
     selecting an upskill pill (which triggers a full re-render) never wipes
     what the user already typed in Name / Profile / Email / Mobile. */
  function syncFields() {
    const g = id => document.getElementById(id);
    const n = g("tpName"), p = g("tpProfile"), e = g("tpEmail"), m = g("tpMobile");
    if (n) modal.name = n.value;
    if (p) modal.profile = p.value;
    if (e) modal.email = e.value;
    if (m) modal.mobile = m.value;
  }

  /* ---- build the WhatsApp pre-filled message ---- */
  function buildMessage() {
    const sel = selectedFile;
    const course = (modal.courses && modal.courses.length) ? modal.courses.join(" + ") : "General";
    const lines = [
      "Hello ResolverPro 👋",
      "",
      "I would like to request a FREE template bundle.",
      "",
      "Name: " + modal.name,
      "Current Profile: " + modal.profile,
      "Email: " + modal.email,
      "Mobile: " + modal.mobile,
      "I want to upskill in: " + course,
      "",
      "Requested Bundle:",
      sel ? (sel.serial + " — " + sel.title) : "General template bundle request",
      sel ? sel.file : "",
      "",
      "Purpose: Learning, Practice & Inspiration",
      "",
      "Please share this free resource with me if available.",
      "Thank you."
    ];
    return lines.join("\n");
  }

  function submit() {
    syncFields();   /* capture anything typed before validating */
    if (!modal.name.trim()) return { ok: false, msg: "Please enter your name." };
    if (!modal.profile) return { ok: false, msg: "Please select your current profile." };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modal.email.trim());
    if (!emailOk) return { ok: false, msg: "Please enter a valid email address." };
    if (!/^[0-9]{7,15}$/.test(modal.mobile.replace(/[\s-]/g, ""))) return { ok: false, msg: "Please enter a valid mobile number." };
    return { ok: true };
  }

  function openWhatsApp() {
    const msg = encodeURIComponent(buildMessage());
    const url = "https://wa.me/" + TEMPLATE_WHATSAPP + "?text=" + msg;
    window.open(url, "_blank", "noopener,noreferrer");
    return url;
  }

  /* ---- public API used by App.bind() ---- */
  function setFilter(f) { filter = f; page = 1; }
  function setQuery(q) { query = q; page = 1; }
  function setSort(s) { sort = s; }
  function setPage(p) { page = p; }
  function getModal() { return modal; }
  function getSelected() { return selectedFile; }
  function toggleUpskill(i) {
    syncFields();                              /* preserve typed values across re-render */
    const c = TEMPLATE_UPSKILL[i];
    const idx = modal.courses.indexOf(c);
    if (idx !== -1) modal.courses.splice(idx, 1);   /* toggle off */
    else modal.courses.push(c);                      /* allow multiple selections */
  }

  return {
    render, openModal, closeModal, setFilter, setQuery, setSort, setPage,
    getModal, getSelected, toggleUpskill, submit, openWhatsApp, buildMessage, counts
  };
})();

/* export the render entry the app calls for view === "templates" */
function renderTemplates() { return Templates.render(); }
