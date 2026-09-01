/* ==========================================================================
   FREE TEMPLATE BUNDLES — public template resource library data
   Single source of truth for the "Free Template Bundles" bonus page.

   Filenames + sizes below are taken EXACTLY from the design reference.
   Counts (All 9 / Excel 7 / Word 1 / PowerPoint 1 / Bundles 6 / Business 3 /
   Templates 9) are DERIVED from this array so they never drift.
   Future files: append an entry here and pagination/sorting pick it up
   automatically.
   ========================================================================== */
const TEMPLATE_BUNDLES = [
  {
    id: "tpl-01",
    serial: "01",
    file: "EXCEL TEMPLATES 1-20260824T084545Z-1-001.zip",
    title: "EXCEL TEMPLATES 1",
    category: "Excel Templates",
    formats: ["Excel"],
    sizeKB: 824505,            // 8,24,505 KB  -> ~8.24 GB
    sizeLabel: "8,24,505 KB"
  },
  {
    id: "tpl-02",
    serial: "02",
    file: "EXCEL TEMPLATES 2-20260824T084552Z-1-001.zip",
    title: "EXCEL TEMPLATES 2",
    category: "Excel Templates",
    formats: ["Excel"],
    sizeKB: 38158,             // 38,158 KB  -> ~38.15 KB
    sizeLabel: "38,158 KB"
  },
  {
    id: "tpl-03",
    serial: "03",
    file: "EXCEL TEMPLATES 3-20260824T094239Z-1-001.zip",
    title: "EXCEL TEMPLATES 3",
    category: "Excel Templates",
    formats: ["Excel"],
    sizeKB: 567829,            // 5,67,829 KB -> ~5.67 GB
    sizeLabel: "5,67,829 KB"
  },
  {
    id: "tpl-04",
    serial: "04",
    file: "1000+ EXCEL Templates-20260824T084556Z-1-001.zip",
    title: "1000+ EXCEL Templates",
    category: "Excel Templates",
    formats: ["Excel"],
    sizeKB: 47627,             // 47,627 KB -> ~47.63 KB
    sizeLabel: "47,627 KB"
  },
  {
    id: "tpl-05",
    serial: "05",
    file: "EXCEL,WORD,POWERBI & POWERPOINT TEMPLATES 5-20260824T084558Z-1-001.zip",
    title: "EXCEL, WORD, POWERBI & POWERPOINT TEMPLATES 5",
    category: "Bundle",
    formats: ["Excel", "Word", "PowerPoint"],
    sizeKB: 1980912,           // 19,80,912 KB -> ~19.80 GB
    sizeLabel: "19,80,912 KB"
  },
  {
    id: "tpl-06",
    serial: "06",
    file: "EXCEL BUNDLE FOLDER 6-20260824T084601Z-1-001.zip",
    title: "EXCEL BUNDLE FOLDER 6",
    category: "Bundle",
    formats: ["Excel"],
    sizeKB: 214006,            // 2,14,006 KB -> ~2.14 GB
    sizeLabel: "2,14,006 KB"
  },
  {
    id: "tpl-07",
    serial: "07",
    file: "INVOICES, QUOTATIONS, PURCHASE ORDERS 7-20260824T084604Z-1-001.zip",
    title: "INVOICES, QUOTATIONS, PURCHASE ORDERS 7",
    category: "Business",
    formats: ["Excel", "Word"],
    sizeKB: 32809,             // 32,809 KB -> ~32.81 KB
    sizeLabel: "32,809 KB"
  },
  {
    id: "tpl-08",
    serial: "08",
    file: "EXCEL TEMPLATES FOLDER 8-20260824T084607Z-1-001.zip",
    title: "EXCEL TEMPLATES FOLDER 8",
    category: "Bundle",
    formats: ["Excel"],
    sizeKB: 1524588,           // 15,24,588 KB -> ~15.24 GB
    sizeLabel: "15,24,588 KB"
  },
  {
    id: "tpl-09",
    serial: "09",
    file: "Special PPT Presentation - Templates (150+).zip",
    title: "Special PPT Presentation - Templates (150+)",
    category: "PowerPoint",
    formats: ["PowerPoint"],
    sizeKB: 1463446,           // 14,63,446 KB -> ~14.63 GB
    sizeLabel: "14,63,446 KB"
  }
];

/* Filter pills — the counts below are taken EXACTLY from the design reference
   (All 9 / Excel 7 / Word 1 / PowerPoint 1 / Bundles 6 / Business 3 / Templates 9)
   and mirror the source taxonomy shown in the screenshot. Clicking a pill still
   filters the actual rows by their tags; these numbers are the label badges. */
const TEMPLATE_FILTER_COUNTS = { all: 9, excel: 7, word: 1, powerpoint: 1, bundles: 6, business: 3, templates: 9 };

const TEMPLATE_FILTERS = [
  { id: "all",        label: "All" },
  { id: "excel",      label: "Excel" },
  { id: "word",       label: "Word" },
  { id: "powerpoint", label: "PowerPoint" },
  { id: "bundles",    label: "Bundles" },
  { id: "business",   label: "Business" },
  { id: "templates",  label: "Templates" }
];

/* WhatsApp support number (per spec) — used to open the pre-filled request */
const TEMPLATE_WHATSAPP = "8454843396";

/* "What would you like to learn?" selectable upskill options */
const TEMPLATE_UPSKILL = [
  "Excel", "Advanced Excel", "Power BI", "SQL", "Data Analytics",
  "Automation", "Dashboard Design", "Word", "PowerPoint", "Corporate MIS"
];

/* Current profile dropdown options (required) */
const TEMPLATE_PROFILES = [
  "Student", "Working Professional", "Business Owner", "Teacher",
  "Freelancer", "Job Seeker", "Other"
];
