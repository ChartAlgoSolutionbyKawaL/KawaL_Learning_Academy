/* ==========================================================================
   EXCEL DASHBOARD INSPIRATION WALL — BONUS RESOURCE REGISTRY
   Additive Level-5 bonus feature. Single source of truth for the 20 real
   dashboard workbooks supplied in  Lessons/Bonus Dashboards/ .

   REAL-PREVIEW PIPELINE (CRITICAL — no dummy graphics):
     Each workbook is opened in Microsoft Excel (COM) and its actual
     Dashboard sheet is exported to PDF (ExportAsFixedFormat) which renders
     the FULL sheet — every chart, shape, conditional format and the real
     computed value results — then rasterized to a high-resolution PNG by
     the pipeline script  _render_previews.py  into:
        resources/excel-dashboard-previews/<id>.png
     The browser shows that exact image. It never re-interprets the .xlsx
     and never draws a fake dashboard. If a preview cannot be generated the
     card shows an UNAVAILABLE state (see bonus.js) — never a fake.

   `sheet`      = the exact worksheet name used as the preview source.
   `file`       = the exact source workbook (NEVER guessed, NEVER remapped).
   `preview`    = the generated real-image path for that exact workbook.

   Tracking + bookmarks live in a SEPARATE localStorage key (see bonus.js) so
   this bonus exploration NEVER touches official LMS course progress.

   Filters (category) drive the wall filter tabs:
     EXECUTIVE | FINANCE | SALES | MARKETING | HR | OPERATIONS |
     CUSTOMER | TECH/SAAS | PERFORMANCE
   ========================================================================== */

const DASHBOARDS = [
  {
    id: "kpi-dashboard",
    title: "KPI Dashboard",
    category: "EXECUTIVE",
    filter: "executive",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/KPI-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/kpi-dashboard.png",
    updated: true,
    learn: "Study how management KPIs are prioritized.",
    desc: "A clean management KPI overview — actual vs target, achievement % and per-customer revenue.",
    study: ["KPI hierarchy", "target vs actual", "achievement %", "per-customer metrics"],
    tags: ["kpi", "executive", "management", "target", "actual"]
  },
  {
    id: "financial-dashboard",
    title: "Financial Dashboard",
    category: "FINANCE",
    filter: "finance",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Financial-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/financial-dashboard.png",
    learn: "Study financial performance and trend reporting.",
    desc: "Income, expenses, profit and margins with period comparisons for finance teams.",
    study: ["revenue vs cost", "profit & margin", "period trends", "variance analysis"],
    tags: ["finance", "revenue", "profit", "budget", "margin"]
  },
  {
    id: "project-management-dashboard",
    title: "Project Management Dashboard",
    category: "OPERATIONS",
    filter: "operations",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Project-Management-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/project-management-dashboard.png",
    learn: "Study task tracking, timelines and delivery status.",
    desc: "Track tasks, status, overdue items and resource load across active projects.",
    study: ["task status", "overdue tracking", "timeline view", "resource load"],
    tags: ["project", "tasks", "operations", "timeline", "status"]
  },
  {
    id: "health-and-safety-dashboard",
    title: "Health & Safety Dashboard",
    category: "OPERATIONS",
    filter: "operations",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Health-and-Safety-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/health-and-safety-dashboard.png",
    learn: "Study incident tracking and compliance reporting.",
    desc: "Incidents, training, audits and corrective actions for a safe workplace.",
    study: ["incident counts", "training status", "audit findings", "compliance"],
    tags: ["safety", "health", "incidents", "compliance", "operations"]
  },
  {
    id: "supply-chain-dashboard",
    title: "Supply Chain Dashboard",
    category: "OPERATIONS",
    filter: "operations",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Supply-Chain-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/supply-chain-dashboard.png",
    learn: "Study operational flow and supply metrics.",
    desc: "Inventory, orders, lead times and fulfilment across the supply chain.",
    study: ["inventory levels", "lead time", "order fulfilment", "supplier performance"],
    tags: ["supply", "chain", "inventory", "logistics", "operations"]
  },
  {
    id: "call-center-dashboard",
    title: "Call Center Dashboard",
    category: "CUSTOMER",
    filter: "customer",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Call-Center-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/call-center-dashboard.png",
    learn: "Study service levels and agent performance.",
    desc: "Calls handled, wait times, resolution rate and agent productivity.",
    study: ["service level", "wait time", "resolution rate", "agent productivity"],
    tags: ["call", "center", "customer", "service", "support"]
  },
  {
    id: "sales-dashboard",
    title: "Sales Dashboard",
    category: "SALES",
    filter: "sales",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Sales-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/sales-dashboard.png",
    learn: "Study sales performance, targets and trends.",
    desc: "Revenue, targets, win rate and product performance for sales teams.",
    study: ["revenue vs target", "trend lines", "win rate", "product mix"],
    tags: ["sales", "revenue", "target", "pipeline", "trend"]
  },
  {
    id: "inventory-dashboard",
    title: "Inventory Dashboard",
    category: "OPERATIONS",
    filter: "operations",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Inventory-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/inventory-dashboard.png",
    learn: "Study stock levels, valuation and turnover.",
    desc: "Stock on hand, valuation, reorder points and slow-moving items.",
    study: ["stock on hand", "valuation", "reorder point", "turnover"],
    tags: ["inventory", "stock", "warehouse", "operations", "reorder"]
  },
  {
    id: "marketing-dashboard",
    title: "Marketing Dashboard",
    category: "MARKETING",
    filter: "marketing",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Marketing-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/marketing-dashboard.png",
    learn: "Study campaign and marketing performance.",
    desc: "Campaign reach, leads, spend and conversion across channels.",
    study: ["campaign reach", "leads", "spend", "conversion"],
    tags: ["marketing", "campaign", "leads", "channel", "conversion"]
  },
  {
    id: "ceo-dashboard",
    title: "CEO Dashboard",
    category: "EXECUTIVE",
    filter: "executive",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/CEO-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/ceo-dashboard.png",
    learn: "Study executive-level information density.",
    desc: "A high-level board view — financials, ops and people on one screen.",
    study: ["information density", "cross-function KPIs", "YTD view", "drill paths"],
    tags: ["ceo", "executive", "board", "kpi", "overview"]
  },
  {
    id: "ecommerce-dashboard",
    title: "Ecommerce Dashboard",
    category: "SALES",
    filter: "sales",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Ecommerce-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/ecommerce-dashboard.png",
    learn: "Study online sales, traffic and conversion.",
    desc: "Orders, revenue, traffic and product performance for online stores.",
    study: ["orders & revenue", "traffic", "conversion", "top products"],
    tags: ["ecommerce", "online", "sales", "traffic", "orders"]
  },
  {
    id: "okr-dashboard",
    title: "OKR Dashboard",
    category: "PERFORMANCE",
    filter: "performance",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/OKR-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/okr-dashboard.png",
    learn: "Study objective and key-result tracking.",
    desc: "Objectives, key results, owners and confidence scores.",
    study: ["objectives", "key results", "owners", "confidence"],
    tags: ["okr", "goals", "performance", "objectives", "results"]
  },
  {
    id: "recruitment-dashboard",
    title: "Recruitment Dashboard",
    category: "HR",
    filter: "hr",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Recruitment-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/recruitment-dashboard.png",
    learn: "Study hiring funnel and time-to-fill.",
    desc: "Open roles, pipeline stages, sources and time-to-hire.",
    study: ["funnel stages", "time-to-fill", "sources", "offer rate"],
    tags: ["recruitment", "hiring", "hr", "pipeline", "talent"]
  },
  {
    id: "seo-dashboard",
    title: "SEO Dashboard",
    category: "MARKETING",
    filter: "marketing",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/SEO-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/seo-dashboard.png",
    learn: "Study search visibility and ranking trends.",
    desc: "Organic traffic, rankings, backlinks and keyword movement.",
    study: ["organic traffic", "rankings", "backlinks", "keywords"],
    tags: ["seo", "search", "traffic", "ranking", "marketing"]
  },
  {
    id: "saas-dashboard",
    title: "SaaS Dashboard",
    category: "TECH/SAAS",
    filter: "saas",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/SaaS-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/saas-dashboard.png",
    learn: "Study product and recurring business KPIs.",
    desc: "MRR, churn, active users and growth for subscription businesses.",
    study: ["MRR / ARR", "churn", "active users", "growth rate"],
    tags: ["saas", "subscription", "mrr", "churn", "tech"]
  },
  {
    id: "social-media-metrics-dashboard",
    title: "Social Media Metrics Dashboard",
    category: "MARKETING",
    filter: "marketing",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Social-Media-Metrics-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/social-media-metrics-dashboard.png",
    learn: "Study engagement, reach and audience growth.",
    desc: "Followers, engagement, reach and post performance by platform.",
    study: ["followers", "engagement", "reach", "post performance"],
    tags: ["social", "media", "engagement", "reach", "marketing"]
  },
  {
    id: "weekly-status-dashboard",
    title: "Weekly Status Dashboard",
    category: "PERFORMANCE",
    filter: "performance",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Weekly-Status-Dashboard-Template-Templatelab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/weekly-status-dashboard.png",
    learn: "Study a compact weekly reporting rhythm.",
    desc: "A one-screen weekly status — progress, risks and next actions.",
    study: ["weekly progress", "risks", "next actions", "RAG status"],
    tags: ["weekly", "status", "report", "performance", "rag"]
  },
  {
    id: "personal-budget-dashboard",
    title: "Personal Budget Dashboard",
    category: "FINANCE",
    filter: "finance",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Personal-Budget-Dahboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/personal-budget-dashboard.png",
    learn: "Study income, expense and savings tracking.",
    desc: "Income, spend by category and savings vs plan for personal finance.",
    study: ["income", "spend by category", "savings", "budget vs actual"],
    tags: ["budget", "personal", "finance", "savings", "expense"]
  },
  {
    id: "hr-dashboard",
    title: "HR Dashboard",
    category: "HR",
    filter: "hr",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/HR-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/hr-dashboard.png",
    learn: "Study workforce metrics and HR reporting.",
    desc: "Headcount, attrition, opens and hiring for people teams.",
    study: ["headcount", "attrition", "open roles", "hiring"],
    tags: ["hr", "people", "headcount", "attrition", "workforce"]
  },
  {
    id: "performance-dashboard",
    title: "Performance Dashboard",
    category: "PERFORMANCE",
    filter: "performance",
    sheet: "DASHBOARD",
    file: "Lessons/Bonus Dashboards/Performance-Dashboard-Template-TemplateLab.com_.xlsx",
    preview: "resources/excel-dashboard-previews/performance-dashboard.png",
    learn: "Study outcome measurement and scorecards.",
    desc: "Scorecards, targets and results across business functions.",
    study: ["scorecards", "targets", "results", "trend"],
    tags: ["performance", "scorecard", "kpi", "results", "target"]
  },
  {
    id: "corporate-dashboard-infographic",
    title: "Corporate Dashboard Infographic",
    category: "EXECUTIVE",
    filter: "executive",
    sheet: "Dashboard",
    file: "Lessons/Bonus Dashboards/Corporate_Dashboard_Infographic.xlsx",
    preview: "resources/excel-dashboard-previews/corporate-dashboard-infographic.png",
    learn: "Study a corporate one-page infographic dashboard.",
    desc: "A visually rich corporate overview — KPIs, charts and commentary on a single infographic-style page.",
    study: ["infographic layout", "headline KPIs", "chart mix", "executive summary", "visual storytelling"],
    tags: ["corporate", "infographic", "executive", "overview", "kpi"]
  }
];

/* Filter tabs shown above the wall (ALL + categories used above). */
const DASHBOARD_FILTERS = [
  { id: "all",        label: "ALL" },
  { id: "executive",  label: "EXECUTIVE" },
  { id: "finance",    label: "FINANCE" },
  { id: "sales",      label: "SALES" },
  { id: "marketing",  label: "MARKETING" },
  { id: "hr",         label: "HR" },
  { id: "operations", label: "OPERATIONS" },
  { id: "customer",   label: "CUSTOMER" },
  { id: "saas",       label: "TECH / SAAS" },
  { id: "performance",label: "PERFORMANCE" }
];
