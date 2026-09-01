/* ==========================================================================
   EXCEL MASTERY LMS — CENTRALIZED CONTENT REGISTRY
   --------------------------------------------------------------------------
   THE SINGLE SOURCE OF TRUTH.
   Navigation, breadcrumbs, progress, search, prev/next and the lesson viewer
   are ALL generated from this file. There is no per-topic branching anywhere
   in the application.

   TO PUBLISH A NEW VISUAL LESSON (the entire future workflow):
     1. Drop the image into  Lessons/<file>.png
     2. Set  lessonImage: "Lessons/<file>.png"  on that topic below.
   The topic becomes AVAILABLE automatically. Progress, badges, search and
   the viewer update themselves. No navigation rewrite. No new page.

   REPLACING AN EXISTING LESSON IMAGE:
     Just overwrite the file in Lessons/ keeping the same filename. The frontend
     picks it up on the next page load — a cache-buster is applied automatically,
     so you do NOT need a hard refresh. Filenames may contain spaces and "&".

   Optional per-topic assets (buttons appear ONLY when non-null — never fake):
     practiceFile: "data/practice/<file>.xlsx"
     solutionFile: "data/solutions/<file>.xlsx"

   status is DERIVED, not authored:
     lessonImage === null  ->  "coming_soon"
     lessonImage  set      ->  "available"  (or "completed" once the learner
                                             marks it done — stored locally)
   ========================================================================== */

const LMS_META = {
  course: "Excel Mastery",
  brand: "ResolvrPro",
  syllabusImage: "assets/syllabus/excel-syllabus-roadmap.png",
  tagline: "Upgrade your Excel Skills. Upgrade your Career."
};

/* --------------------------------------------------------------------------
   MODE A — LEARNING PATH (authoritative source: supplied syllabus image)
   -------------------------------------------------------------------------- */
/* ==========================================================================
   LESSON ASSET RESOLVER
   Filenames follow the user's naming scheme:
     Lessons/Excel Mastery - Level {L} - Session {S} - Chp - {C}[.{P}].png
   chp() turns (level, session, chapter, pageCount) into the ordered list of
   page paths the viewer expects. Single-page chapters use pages=1; multi-page
   chapters list .1/.2/.3... automatically. To add a future chapter, just call
   chp(...) on the topic — no UI change and no directory scanning required. */
function chp(level, session, chapter, pages) {
  const base = `Lessons/Excel Mastery - Level ${level} - Session ${session} - Chp - ${chapter}`;
  if (!pages || pages <= 1) return [base + ".png"];
  const out = [];
  for (let p = 1; p <= pages; p++) out.push(`${base}.${p}.png`);
  return out;
}

/* Excel Basics (Step 01) = Level 1, Session 1 — chapters 1..5 */
const SESSION1_CHAPTERS = {
  1: chp(1, 1, 1, 1),
  2: chp(1, 1, 2, 1),
  3: chp(1, 1, 3, 3),
  4: chp(1, 1, 4, 1),
  5: chp(1, 1, 5, 1)
};

/* Level 2, Session 1 — chapters 1..4 (Chp 2 and Chp 4 are multi-page) */
const SESSION2_CHAPTERS = {
  1: chp(2, 1, 1, 1),
  2: chp(2, 1, 2, 2),
  3: chp(2, 1, 3, 1),
  4: chp(2, 1, 4, 2)
};

/* ==========================================================================
   PRACTICE WORKBOOK REGISTRY
   Central, explicit mapping of topic -> Excel practice workbook. Keyed by TOPIC ID
   (the canonical lesson identity). Each entry records the Level/Session/Chapter it
   belongs to (for documentation + future multi-track extensibility) and the rich
   panel content. The `workbook` path is the single source of truth for the file;
   getTopic applies it automatically, so no filename search is ever used.
   To add a future workbook (e.g. Level 2 Session 1 Chapter 5) just append ONE
   entry here — no other code changes required. */
const PRACTICE_REGISTRY = {
  "step21_sumif": {
    level: 1, session: 2, chapter: 1,
    workbook: "Lessons/Level_1_Session_2_Chp_1.1_Practice_&_Solutions.xlsx",
    title: "Basic Formulas Practice",
    category: "Excel Basics / Basic Formulas",
    description: "Build your first practical Excel formulas using a realistic sales and business dataset.",
    realWorldTask: "Build a small sales analysis workbook using basic Excel formulas, decision logic and simple business calculations.",
    skills: ["SUM","AVERAGE","COUNT","MIN","MAX","Math operators","Cell references","Absolute references","IF","COUNTIF","SUMIF"],
    activity: "Sales summary (totals & averages), Net amount (discounted value), GST via absolute reference, IF decisions (Pass/Fail, Commission, Attendance), COUNTIF (serial frequency & running occurrence), SUMIF (product totals), Mini business challenge vs Target."
  },
  "step21_sumifs": {
    level: 2, session: 1, chapter: 2,
    workbook: "Lessons/Level_2_Session_1_Chp_2_Practice_&_Solutions.xlsx",
    title: "COUNTIFS Practice",
    category: "Intermediate Formulas",
    description: "Use COUNTIFS to count records only when multiple conditions are satisfied.",
    realWorldTask: "Use multiple conditions to create sales and employee KPI counts.",
    skills: ["COUNTIFS","Multiple criteria","Text criteria","Numeric criteria","AND-style logic","Sales reporting","HR reporting","Dashboard KPIs"],
    activity: "Sales Orders (6 business questions), Employee Attendance (6 business questions), Dashboard KPI Challenge (5 management KPIs)."
  },
  "step21_nested_if": {
    level: 2, session: 1, chapter: 4,
    workbook: "Lessons/Level_2_Session_1_Chp_4_Practice_&_Solutions.xlsx",
    title: "Nested IF Practice",
    category: "Intermediate Formulas",
    description: "Apply Nested IF decision logic to classify real-world business situations.",
    realWorldTask: "Convert business thresholds into meaningful categories across six industries.",
    skills: ["Nested IF","Condition ordering","Threshold logic","Business classification","Decision automation"],
    activity: "Retail (Stock), Finance (Invoices), HR (Attendance), Logistics (Delivery), Banking (Credit Risk), Sales (Target)."
  },
  "step21_logical_ops": {
    level: 2, session: 1, chapter: 5,
    workbook: "Lessons/Level_2_Session_1_Chp_5_Practice_&_Solutions.xlsx",
    title: "Logical Operators (AND, OR, NOT)",
    category: "Intermediate Formulas",
    description: "Turn business rules into smart Excel decisions using AND, OR and NOT.",
    realWorldTask: "Use logical operators to make business decisions across Sales, HR and Banking scenarios. You will work with three different datasets and convert real business rules into TRUE/FALSE decisions.",
    skills: [
      "AND — all conditions must be TRUE",
      "OR — at least one condition must be TRUE",
      "NOT — reverses a logical result",
      "Combining AND + OR",
      "Combining AND + NOT",
      "Translating business rules into Excel formulas",
      "Testing formulas against real-world data",
      "Understanding why a formula returns TRUE or FALSE"
    ],
    activity: "WHY THREE DIFFERENT DATASETS? Logical operators are not industry-specific. The syntax stays the same, but the business rules change. Sales uses AND (bonus eligibility), HR uses AND + OR (reward eligibility), Banking uses AND + NOT (loan pre-screening). The goal is to learn the LOGIC, not memorize one formula.",
    scenarios: [
      {
        section: "01 — SALES & MARKETING",
        title: "BONUS ELIGIBILITY",
        rule: "An employee qualifies for a performance bonus only when Sales >= Rs10,000 AND Profit >= Rs2,000. AND means BOTH conditions must be TRUE. If Sales = Rs12,000 and Profit = Rs2,500, the result is TRUE (TRUE AND TRUE = TRUE). If Sales = Rs15,000 but Profit = Rs1,800, the result is FALSE (TRUE AND FALSE = FALSE). AND does not accept 'almost' — every required condition must pass.",
        steps: ["Open Sales_Practice.","Read the Sales and Profit columns.","Read the business rule.","Create an AND formula checking Sales >= 10000 AND Profit >= 2000.","Enter the formula in the yellow Formula column.","Copy the formula down.","Check whether the TRUE/FALSE result makes business sense.","Change one Sales or Profit value and observe how the result changes.","Only after completing the exercise, open Sales_Solutions."]
      },
      {
        section: "02 — HR & OPERATIONS",
        title: "REWARD ELIGIBILITY",
        rule: "An employee receives a reward if EITHER PATH A is true OR PATH B is true. PATH A: Present Days >= 20 AND Leave Days <= 1. PATH B: Overtime = \"Yes\" AND Performance >= 80. This is NOT simply AND-everything-together — there are two alternative paths. If either complete path is TRUE, the employee qualifies. This demonstrates OR + AND.",
        steps: ["Open HR_Practice.","Read Present Days, Leave Days, Overtime, Performance.","Translate the rule into two separate logical paths.","Build AND(...) for Path A.","Build AND(...) for Path B.","Combine both paths using OR(...).","Copy the formula down.","Change one input and predict the result before recalculating.","Check HR_Solutions."]
      },
      {
        section: "03 — BANKING & RISK",
        title: "LOAN PRE-SCREENING",
        rule: "An applicant is eligible only when Credit Score >= 700 AND Income >= Rs50,000 AND Existing Loan = \"No\" AND KYC Status = \"Verified\" AND NOT Blacklisted. This demonstrates AND + NOT. If Blacklist = \"Yes\", then NOT(F5=\"Yes\") returns FALSE, so the applicant fails the overall AND condition. NOT is used to 'allow everything except records meeting an exclusion condition.'",
        steps: ["Open Banking_Practice.","Review Credit Score, Income, Existing Loan, KYC Status, Blacklist.","Translate each business requirement into a logical condition.","Use AND to require all approval conditions.","Use NOT to exclude blacklisted applicants.","Copy the formula down.","Test by changing Credit Score, Income, Existing Loan, KYC Status, Blacklist.","Predict TRUE/FALSE before recalculating.","Compare your result with Banking_Solutions."]
      }
    ],
    workbookStructure: [
      { name: "Instructions", purpose: "Understand the rules and recommended workflow." },
      { name: "Sales_Practice", purpose: "Practice AND using bonus eligibility." },
      { name: "Sales_Solutions", purpose: "Compare your formulas and results." },
      { name: "HR_Practice", purpose: "Practice OR + AND using alternative reward paths." },
      { name: "HR_Solutions", purpose: "Check your HR logic." },
      { name: "Banking_Practice", purpose: "Practice AND + NOT using loan screening." },
      { name: "Banking_Solutions", purpose: "Check your banking logic." },
      { name: "Answer_Key", purpose: "Quick reference for logical operators and business meaning." }
    ],
    howTo: [
      "Study the Chapter 5 visual lesson.",
      "Understand AND, OR and NOT.",
      "Download the Excel practice file.",
      "Open the Instructions sheet.",
      "Start with Sales_Practice.",
      "Complete the formulas yourself.",
      "Move to HR_Practice.",
      "Complete the multi-condition logic.",
      "Move to Banking_Practice.",
      "Build the AND + NOT formula.",
      "Test your formulas by changing inputs.",
      "Open the corresponding Solutions sheet.",
      "Compare both FORMULA and RESULT.",
      "Read the explanation of why the result is TRUE/FALSE.",
      "Review the Answer_Key.",
      "Return to the LMS."
    ]
  },

  /* ===== LEVEL 1 — BASIC FORMULAS (Step 2): one shared workbook, 5 sheets =====
     All five topics point at the SAME workbook file but a DIFFERENT worksheet, so
     the learner is routed to the correct sheet automatically (no searching). The
     workbook already contains realistic datasets + a Solution/Check column. */
  "step02_math_text_functions": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    sheet: "01 SUM AVERAGE COUNT",
    title: "Basic Formulas — Practice & Solutions",
    category: "Excel Basics / Basic Formulas",
    description: "Practice the formulas you just learned using realistic business and workplace datasets. Complete the exercises in Excel first, then use the solution section to check your work.",
    realWorldTask: "Open the workbook and use SUM, AVERAGE and COUNT on a real sales report.",
    scenario: "Sales Report",
    dataset: "Date, Salesperson, Product, Sales (₹) and Units Sold for 5 transactions.",
    exercises: [
      "Total Sales using SUM",
      "Average Sales using AVERAGE",
      "Number of transactions using COUNT",
      "Total Units Sold",
      "Average Units Sold"
    ],
    skills: ["SUM", "AVERAGE", "COUNT", "Totals", "Averages"],
    activity: "Sales summary: Total Sales =SUM(D5:D9), Average Sales =AVERAGE(D5:D9), Transaction Count =COUNT(D5:D9).",
    workbookStructure: [
      { name: "00 INDEX", purpose: "Topic → scenario → sheet map and the recommended workflow." },
      { name: "01 SUM AVERAGE COUNT", purpose: "Sales Report — practice SUM, AVERAGE and COUNT." },
      { name: "02 MIN MAX", purpose: "Student Performance — practice MIN and MAX." },
      { name: "03 MATH OPERATORS", purpose: "Order Calculation — practice + - * / and %." },
      { name: "04 CELL REFERENCING", purpose: "Commission Calculator — practice relative, absolute and mixed references." },
      { name: "05 AUTOSUM SUBTOTAL", purpose: "Monthly Expense Tracker — practice AutoSum, SUM and SUBTOTAL." }
    ],
    howTo: [
      "Open the Excel practice workbook in Microsoft Excel.",
      "Choose your topic — start with the same topic you have just learned (SUM, AVERAGE, COUNT).",
      "Read the scenario — each sheet uses a realistic dataset instead of isolated formula examples.",
      "Solve it yourself — enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
      "Check your answer — use the Solution / Check section to compare your formula and result.",
      "Change the data — change the input values and verify that your formulas still work.",
      "Apply the skill — return to ResolvrPro and continue to the next topic."
    ],
    note: "Don't just copy the formula. Understand why the formula works.",
    tryFirst: "Try the exercise yourself before checking the solution."
  },
  "step02_logical_functions": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    sheet: "02 MIN MAX",
    title: "Basic Formulas — Practice & Solutions",
    category: "Excel Basics / Basic Formulas",
    description: "Practice MIN and MAX on a realistic student-performance dataset. Complete the exercises in Excel first, then use the solution section to check your work.",
    realWorldTask: "Open the workbook and use MIN and MAX on a student score sheet.",
    scenario: "Student Performance",
    dataset: "Student, Maths, Science, English and Total scores for 5 students.",
    exercises: [
      "Lowest Maths score (MIN)",
      "Highest Science score (MAX)",
      "Lowest English score (MIN)",
      "Highest Total score (MAX)",
      "Lowest Total score (MIN)"
    ],
    skills: ["MIN", "MAX", "Range", "Lowest value", "Highest value"],
    activity: "Ranges: Minimum Maths =MIN(B5:B9), Maximum Science =MAX(C5:C9), Minimum English =MIN(D5:D9).",
    workbookStructure: [
      { name: "00 INDEX", purpose: "Topic → scenario → sheet map and the recommended workflow." },
      { name: "01 SUM AVERAGE COUNT", purpose: "Sales Report — practice SUM, AVERAGE and COUNT." },
      { name: "02 MIN MAX", purpose: "Student Performance — practice MIN and MAX." },
      { name: "03 MATH OPERATORS", purpose: "Order Calculation — practice + - * / and %." },
      { name: "04 CELL REFERENCING", purpose: "Commission Calculator — practice relative, absolute and mixed references." },
      { name: "05 AUTOSUM SUBTOTAL", purpose: "Monthly Expense Tracker — practice AutoSum, SUM and SUBTOTAL." }
    ],
    howTo: [
      "Open the Excel practice workbook in Microsoft Excel.",
      "Choose your topic — start with the same topic you have just learned (MIN & MAX).",
      "Read the scenario — each sheet uses a realistic dataset instead of isolated formula examples.",
      "Solve it yourself — enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
      "Check your answer — use the Solution / Check section to compare your formula and result.",
      "Change the data — change the input values and verify that your formulas still work.",
      "Apply the skill — return to ResolvrPro and continue to the next topic."
    ],
    note: "Don't just copy the formula. Understand why the formula works.",
    tryFirst: "Try the exercise yourself before checking the solution."
  },
  "step02_date_time_functions": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    sheet: "03 MATH OPERATORS",
    title: "Basic Formulas — Practice & Solutions",
    category: "Excel Basics / Basic Formulas",
    description: "Practice the basic math operators (+, -, *, / and %) on a realistic order-and-discount dataset. Complete the exercises in Excel first, then use the solution section to check your work.",
    realWorldTask: "Open the workbook and build discounts, net amounts and totals with Excel operators.",
    scenario: "Order & Discount Calculation",
    dataset: "Item, Quantity, Price (₹), Discount % for 5 products, plus the workbook's solution columns.",
    exercises: [
      "Multiplication (Quantity × Price)",
      "Addition / Subtraction",
      "Division",
      "Percentage calculations",
      "Discount calculation (=Qty×Price×Disc%)",
      "Net amount calculation (=Qty×Price−Discount)"
    ],
    skills: ["Math Operators", "Multiplication", "Addition", "Subtraction", "Division", "Percentages", "Discount", "Net amount"],
    activity: "Order math: Discount =B5*C5*D5/100, Net Amount =B5*C5−E5, Total Net =SUM(F5:F9).",
    workbookStructure: [
      { name: "00 INDEX", purpose: "Topic → scenario → sheet map and the recommended workflow." },
      { name: "01 SUM AVERAGE COUNT", purpose: "Sales Report — practice SUM, AVERAGE and COUNT." },
      { name: "02 MIN MAX", purpose: "Student Performance — practice MIN and MAX." },
      { name: "03 MATH OPERATORS", purpose: "Order Calculation — practice + - * / and %." },
      { name: "04 CELL REFERENCING", purpose: "Commission Calculator — practice relative, absolute and mixed references." },
      { name: "05 AUTOSUM SUBTOTAL", purpose: "Monthly Expense Tracker — practice AutoSum, SUM and SUBTOTAL." }
    ],
    howTo: [
      "Open the Excel practice workbook in Microsoft Excel.",
      "Choose your topic — start with the same topic you have just learned (Basic Math Operators).",
      "Read the scenario — each sheet uses a realistic dataset instead of isolated formula examples.",
      "Solve it yourself — enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
      "Check your answer — use the Solution / Check section to compare your formula and result.",
      "Change the data — change the input values and verify that your formulas still work.",
      "Apply the skill — return to ResolvrPro and continue to the next topic."
    ],
    note: "Don't just copy the formula. Understand why the formula works.",
    tryFirst: "Try the exercise yourself before checking the solution."
  },
  "step02_lookup_functions": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    sheet: "04 CELL REFERENCING",
    title: "Basic Formulas — Practice & Solutions",
    category: "Excel Basics / Basic Formulas",
    description: "Practice relative, absolute and mixed cell references on a realistic commission-calculator dataset. Complete the exercises in Excel first, then use the solution section to check your work.",
    realWorldTask: "Open the workbook and build commission, bonus and total-earnings formulas using the right reference type.",
    scenario: "Employee Commission Calculator",
    dataset: "Employee, Sales (₹), Commission % and a shared global rate in $J$2, for 5 employees.",
    referenceGuide: [
      { type: "Relative", example: "B5", use: "Adjusts when the formula is copied down/right." },
      { type: "Absolute", example: "$J$2", use: "Locks both row and column — used for the shared rate." },
      { type: "Mixed", example: "$C5 or C$5", use: "Locks only the row or only the column." }
    ],
    exercises: [
      "Relative references",
      "Absolute references",
      "Mixed references",
      "Copying formulas",
      "Shared / global percentage (=$J$2)",
      "Commission calculations (=Sales×Rate)",
      "Bonus calculations"
    ],
    skills: ["Cell References", "Relative", "Absolute", "Mixed", "Copy formulas", "Commission", "Bonus"],
    activity: "Commission =B5*C5; Bonus =B5*$J$2 (absolute reference to the shared rate); Total =B5+D5+E5.",
    workbookStructure: [
      { name: "00 INDEX", purpose: "Topic → scenario → sheet map and the recommended workflow." },
      { name: "01 SUM AVERAGE COUNT", purpose: "Sales Report — practice SUM, AVERAGE and COUNT." },
      { name: "02 MIN MAX", purpose: "Student Performance — practice MIN and MAX." },
      { name: "03 MATH OPERATORS", purpose: "Order Calculation — practice + - * / and %." },
      { name: "04 CELL REFERENCING", purpose: "Commission Calculator — practice relative, absolute and mixed references." },
      { name: "05 AUTOSUM SUBTOTAL", purpose: "Monthly Expense Tracker — practice AutoSum, SUM and SUBTOTAL." }
    ],
    howTo: [
      "Open the Excel practice workbook in Microsoft Excel.",
      "Choose your topic — start with the same topic you have just learned (Cell Referencing).",
      "Read the scenario — each sheet uses a realistic dataset instead of isolated formula examples.",
      "Solve it yourself — enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
      "Check your answer — use the Solution / Check section to compare your formula and result.",
      "Change the data — change the input values and verify that your formulas still work.",
      "Apply the skill — return to ResolvrPro and continue to the next topic."
    ],
    note: "Don't just copy the formula. Understand why the formula works.",
    tryFirst: "Try the exercise yourself before checking the solution."
  },
  "step02_nested_formulas": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    sheet: "05 AUTOSUM SUBTOTAL",
    title: "Basic Formulas — Practice & Solutions",
    category: "Excel Basics / Basic Formulas",
    description: "Practice AutoSum, SUM, row/column totals, grand totals and SUBTOTAL (with filters) on a realistic monthly-expense tracker. Complete the exercises in Excel first, then use the solution section to check your work.",
    realWorldTask: "Open the workbook and build a practical expense report with AutoSum, SUM and SUBTOTAL.",
    scenario: "Monthly Expense Tracker",
    dataset: "Category with Jan–May amounts and a Row Total column, plus a TOTAL row of column sums.",
    exercises: [
      "AutoSum",
      "SUM",
      "Row totals",
      "Column totals",
      "Grand totals",
      "SUBTOTAL",
      "Filtering data",
      "Calculating totals only for visible rows"
    ],
    skills: ["AutoSum", "SUM", "Row totals", "Column totals", "Grand totals", "SUBTOTAL", "Filters", "Visible rows"],
    activity: "Row Total =SUM(B5:F5); January Total =SUM(B5:B9); TOTAL row =SUM of the column; SUBTOTAL responds to filtered rows.",
    workbookStructure: [
      { name: "00 INDEX", purpose: "Topic → scenario → sheet map and the recommended workflow." },
      { name: "01 SUM AVERAGE COUNT", purpose: "Sales Report — practice SUM, AVERAGE and COUNT." },
      { name: "02 MIN MAX", purpose: "Student Performance — practice MIN and MAX." },
      { name: "03 MATH OPERATORS", purpose: "Order Calculation — practice + - * / and %." },
      { name: "04 CELL REFERENCING", purpose: "Commission Calculator — practice relative, absolute and mixed references." },
      { name: "05 AUTOSUM SUBTOTAL", purpose: "Monthly Expense Tracker — practice AutoSum, SUM and SUBTOTAL." }
    ],
    filterChallenge: "FILTER + SUBTOTAL CHALLENGE — Turn on Excel filters, hide one or more categories, and compare SUM with SUBTOTAL. Notice how SUBTOTAL responds to filtered rows.",
    howTo: [
      "Open the Excel practice workbook in Microsoft Excel.",
      "Choose your topic — start with the same topic you have just learned (AutoSum).",
      "Read the scenario — each sheet uses a realistic dataset instead of isolated formula examples.",
      "Solve it yourself — enter the formulas yourself in Excel. Do NOT immediately look at the solution.",
      "Check your answer — use the Solution / Check section to compare your formula and result.",
      "Change the data — change the input values and verify that your formulas still work.",
      "Apply the skill — return to ResolvrPro and continue to the next topic."
    ],
    note: "Don't just copy the formula. Understand why the formula works.",
    tryFirst: "Try the exercise yourself before checking the solution."
  },

  /* ===== LEVEL 5 — AI-POWERED PROFESSIONAL (Chapters 1, 2, 3, 5) =====
     Chapter 4 (Automation & Productivity) has a visual lesson but NO practice
     workbook on disk, so it is intentionally absent -> Practice button hidden.
     All content below was read directly from the actual .xlsx files. */
  "step17_ai_problem_solving": {
    level: 5, session: 1, chapter: 1,
    workbook: "Lessons/Level_5_Session_1_Chp_1_Practice_&_Solutions.xlsx",
    title: "AI-Powered Business Problem Solving",
    category: "AI-Powered Professional",
    description: "Move from a vague business problem to a precise, analyzable problem definition with the help of AI.",
    problem: "Management states a vague complaint such as \"Our sales are down.\" A weak problem statement cannot be measured, analyzed or solved. The learner must convert that complaint into a precise, scoped problem with clear questions, KPIs, data requirements and an analysis plan.",
    context: "Business / Retail and E-Commerce. Two worked scenarios are provided: a retail sales decline and an e-commerce quarterly sales drop. Both represent real management situations where the first request is vague and must be decomposed before any analysis begins.",
    objective: "Define the problem in one precise sentence; write 5 analytical questions; select the right KPIs; identify required data, dimensions and time period; generate AI hypotheses and label them as unvalidated; and build a 5-step analysis plan with expected outputs.",
    dataset: "Example_1_Practice (retail): Month, Region, Channel, Product, Units, Sales, Cost, Customers. Example_2_Practice (e-commerce): Month, Quarter, Traffic, Orders, AOV, Sales, New/Repeat Customers, Conversion, Return Rate, Out-of-Stock.",
    task: "1) Define the problem in one precise sentence. 2) Write 5 analytical questions. 3) Select KPIs (Total Sales, Growth %, ASP, Units, Gross Margin %, Customer Contribution). 4) Identify required data, dimensions and period. 5) Ask AI for 5 hypotheses and label them as unvalidated. 6) Build a 5-step analysis plan with expected outputs.",
    workbookStructure: [
      { name: "START_HERE", purpose: "Learning objective, how-to-use, and the 7-step AI-Powered Problem-Solving Framework." },
      { name: "Example_1_Practice", purpose: "Retail scenario — define the problem, questions, KPIs, data and plan." },
      { name: "Example_1_Analysis", purpose: "Guided analysis track (define, KPI checklist, analysis plan)." },
      { name: "Example_1_Solution", purpose: "Model problem statement, questions, hypotheses and validation." },
      { name: "Example_2_Practice", purpose: "E-commerce scenario — confirm decline, check traffic/orders/AOV, drill down." },
      { name: "Example_2_Analysis", purpose: "Step-by-step AI-powered analysis track for the e-commerce case." },
      { name: "Example_2_Solution", purpose: "Model solution with quarter KPI checks and conclusion." },
      { name: "AI_Prompt_Tracks", purpose: "8 reusable AI prompt tracks (Clarify, Questions, KPIs, Data, Hypotheses, Plan, Challenge, Executive story) with verification rules." },
      { name: "Capstone_Checklist", purpose: "Self-assessment of the chapter's professional capabilities." }
    ],
    skills: ["Problem definition","Analytical questioning","KPI selection","Data requirement mapping","Root-cause vs correlation","AI hypothesis generation","AI verification","Analysis planning","Executive communication"],
    expectedOutput: "A one-line problem definition, 5 answerable analytical questions, a short KPI list with definitions, a data-requirements map, a labelled list of AI hypotheses (marked unvalidated), and a prioritized 5-step analysis plan.",
    solution: "Compare your work against Example_1_Solution and Example_2_Solution (model problem statements, questions, hypotheses and quarter KPI checks). Validate every AI suggestion against the data before treating it as a finding.",
    aiApplication: "Use the AI_Prompt_Tracks to clarify scope, generate questions, propose KPIs, define data needs, suggest hypotheses, sequence the plan, stress-test findings and draft the executive story. Rule: an AI suggestion is not a validated finding — every number must be traceable.",
    howTo: [
      "Study the Chapter 1 visual lesson (pages 1-2).",
      "Open START_HERE and read the Problem-Solving Framework.",
      "Complete Example_1_Practice (retail).",
      "Check Example_1_Analysis and Example_1_Solution.",
      "Complete Example_2_Practice (e-commerce).",
      "Check Example_2_Analysis and Example_2_Solution.",
      "Use AI_Prompt_Tracks to practice asking AI well.",
      "Finish Capstone_Checklist.",
      "Return to the LMS."
    ]
  },
  "step18_ai_data_analytics": {
    level: 5, session: 1, chapter: 2,
    workbook: "Lessons/Level_5_Session_1_Chp_2_Practice_&_Solutions.xlsx",
    title: "AI-Powered Data & Analytics",
    category: "AI-Powered Professional",
    description: "Understand, clean and analyze a real dataset, then use AI to generate and validate hypotheses.",
    problem: "A hospital wants to understand why its 30-day patient readmission rate is high. The raw patient dataset must be validated, analyzed and explained before any operational recommendation can be made.",
    context: "Healthcare. A patient readmissions dataset (Cardiology, Pulmonology, Orthopedics, General Medicine and more) with fields for department, age group, diagnosis, length of stay, multiple conditions, discharge type and follow-up.",
    objective: "Explain what 30-day readmission means; compute and interpret the readmission rate; compare departments, diagnoses, age groups and follow-up; and write an evidence-backed recommendation — using AI to generate hypotheses, then validating them with the data.",
    dataset: "Healthcare_Practice: Patient ID, Admission Date, Department, Age Group, Diagnosis, Discharge Type, Length of Stay, Multiple Conditions (120+ patient rows). Derived columns include 30-Day Readmission, Follow-up and Readmission Cost.",
    task: "Part A — Data Understanding: define readmission, identify the KPI denominator, list 5 segmentation dimensions, flag 2 fields that may cause data-quality issues. Part B — Analysis: overall readmission rate (COUNTIF/COUNTIFS), department & diagnosis rates (PivotTable/COUNTIFS), follow-up vs readmission, multiple-conditions vs readmission, length-of-stay comparison (AVERAGEIF), readmission cost (SUMIF).",
    workbookStructure: [
      { name: "START_HERE", purpose: "Scenario, learning track and 6 key business questions." },
      { name: "Healthcare_Practice", purpose: "Raw patient readmission dataset to analyze." },
      { name: "Practice_Activity", purpose: "Part A (data understanding) and Part B (analysis) task track." },
      { name: "Solution", purpose: "Core KPIs, model findings to test, and methodology notes." },
      { name: "AI_Prompt_Tracks", purpose: "Healthcare-specific AI prompts (Understand, Explore, Hypotheses, Analyze, Challenge, Action) with validation rules." },
      { name: "Mastery_Checklist", purpose: "Self-assessment of data & analytics capabilities." }
    ],
    skills: ["Data understanding","Data quality checks","COUNTIF / COUNTIFS","AVERAGEIF","PivotTables","Readmission-rate analysis","Segmentation","Hypothesis generation","Correlation vs causation","AI-assisted analysis","Evidence-backed recommendation"],
    expectedOutput: "An overall readmission rate, department- and diagnosis-specific rates, follow-up and comorbidity comparisons, a length-of-stay comparison and a cost estimate — plus a written recommendation that separates evidence from assumption.",
    solution: "Use the Solution sheet: Total Patients = COUNTA(Patient ID); Readmissions = COUNTIF(30-Day Readmission,\"Yes\"); Readmission Rate = Readmissions / Total Patients (primary KPI); Average Length of Stay = AVERAGE(Length of Stay); Follow-up Completion = COUNTIF(Follow-up,\"Yes\")/Total; Readmission Cost = SUMIF. Validate that Cardiology/Pulmonology and Heart Failure/COPD show higher rates, and that 'no follow-up' and 'multiple conditions' correlate with readmission — but remember correlation is not causation.",
    aiApplication: "Use AI_Prompt_Tracks to explain the dataset, generate 7 analytical questions, propose 5 testable hypotheses, suggest Excel formulas/PivotTables, challenge your finding as a skeptical reviewer, and recommend operational actions based only on validated evidence.",
    howTo: [
      "Study the Chapter 2 visual lesson (pages 1-2).",
      "Open START_HERE and read the 6 business questions.",
      "Open Healthcare_Practice and explore the dataset.",
      "Complete Practice_Activity (Parts A and B).",
      "Check the Solution sheet KPIs and findings.",
      "Use AI_Prompt_Tracks to generate and validate hypotheses.",
      "Finish Mastery_Checklist.",
      "Return to the LMS."
    ]
  },
  "step19_ai_dashboard_story": {
    level: 5, session: 1, chapter: 3,
    workbook: "Lessons/Level_5_Session_1_Chp_3_Practice_&_Solutions.xlsx",
    title: "AI-Powered Dashboard & Storytelling",
    category: "AI-Powered Professional",
    description: "Turn raw sales data into a decision-ready dashboard and a clear business story.",
    problem: "Online sales have weakened and management wants to know what happened, where, and what to do. A dashboard is only useful when it drives a clear, evidence-backed narrative.",
    context: "E-commerce. A 386-row sales dataset (Date, Month, Quarter, Region, Channel, Category, Product, Customer Type and measures) feeds a live, filterable executive dashboard.",
    objective: "Build/use a slicer-style dashboard (Region, Channel, Category, Quarter), read the executive KPIs (Total Sales, Orders, AOV), and convert validated findings into a 5-part story: Setup, Discovery, Meaning, Impact, Action.",
    dataset: "DATASET: 386 rows of e-commerce sales (Region, Channel, Category, Product, Customer Type, Sales, Orders, AOV and more). DASHBOARD_SOLUTION: KPI cards and trend visuals linked to the dataset via SUMPRODUCT slicers.",
    task: "Answer the storytelling questions: did sales actually decline and by how much; is the decline from fewer orders or lower AOV; which category/region/channel contributed; did customer mix change; did returns worsen; what action should management take. Use the dashboard filters to locate the driver, then write the story.",
    workbookStructure: [
      { name: "DASHBOARD_SOLUTION", purpose: "Executive dashboard with slicer-style filters and live KPI cards." },
      { name: "DATASET", purpose: "The 386-row e-commerce sales dataset powering the dashboard." },
      { name: "PROBLEM_TO_SOLVE", purpose: "The management question and the expected story structure." },
      { name: "STORY_EXPLANATION", purpose: "Full storytelling solution: storyboard, AI prompts and the professional rule." },
      { name: "AI_DASHBOARD_GUIDE", purpose: "7-step human+AI dashboard workflow and copy-ready master prompt." }
    ],
    skills: ["KPI selection","Slicer-style filtering","SUMPRODUCT dashboards","Trend analysis","Segmentation","Data storytelling","Executive communication","AI insight generation","Correlation vs causation","Recommendation"],
    expectedOutput: "A filtered view of the dashboard, a short written story (Setup to Action) backed by the dashboard evidence, and one or two evidence-based recommendations.",
    solution: "Use STORY_EXPLANATION: confirm the problem with KPI cards + sales trend; locate the driver with category/region/channel filters; explain impact via orders, AOV and return rate; quantify the business effect; then recommend an action. Validate every claim against the dashboard before presenting.",
    aiApplication: "Use AI_DASHBOARD_GUIDE prompts: Explore (find 5 patterns), Explain (3 plausible causes), Story (5-part narrative), Challenge (skeptical CFO review), Action (recommendations from validated findings). AI drafts; the human owns the decision.",
    howTo: [
      "Study the Chapter 3 visual lesson (pages 1-2).",
      "Open DASHBOARD_SOLUTION and use the slicer filters.",
      "Read PROBLEM_TO_SOLVE and the expected story structure.",
      "Explore the DATASET via the dashboard KPIs.",
      "Write your story using STORY_EXPLANATION as the model.",
      "Use AI_DASHBOARD_GUIDE prompts to refine insight and narrative.",
      "Return to the LMS."
    ]
  },
  "step24_ai_capstone": {
    level: 5, session: 1, chapter: 5,
    workbook: "Lessons/Level_5_Session_1_Chp_5_Practice_&_Solutions.xlsx",
    title: "AI Business Solution — Master Capstone",
    category: "AI-Powered Professional",
    description: "The final integration: turn historical banking data into a forecast and a decision-ready plan.",
    problem: "A bank must plan branch staffing, loan-processing capacity and funding for expected retail loan demand. Leadership needs a forecast and a clear narrative — not a single number.",
    context: "Banking. A retail loan-disbursement dataset (monthly Actual Loan Disbursement, Applications, Approved Loans, Approval Rate, Average Ticket) is used to build and compare forecasting models.",
    objective: "Use the historical data to forecast future loan demand with FORECAST.LINEAR, FORECAST.ETS and TREND, compare the models, identify where they disagree, and turn the validated forecast into an executive decision with Base/Upside/Downside scenarios.",
    dataset: "BANKING_DATASET: 12 months of retail loan disbursement (Month, Quarter, Actual, Applications, Approved Loans, Approval Rate, Average Ticket). FORECAST_MODEL: historical rows linked to the dataset plus 12 forecast rows.",
    task: "1) Read the business problem. 2) Build FORECAST.LINEAR, FORECAST.ETS and TREND for months 13-24. 3) Add a 3-month moving average. 4) Compare models and investigate material disagreement. 5) Build Base, Upside and Downside scenarios. 6) Write the executive story and recommended actions.",
    workbookStructure: [
      { name: "BANKING_DATASET", purpose: "12 months of actual retail loan-disbursement data." },
      { name: "FORECAST_MODEL", purpose: "Historical + 12 forecast rows using LINEAR, ETS, TREND and moving average." },
      { name: "FORECAST_STORY", purpose: "From data to decision: what to notice and banking use cases." },
      { name: "AI_GUIDE", purpose: "Copy-ready AI prompts and AI safety rules for forecasting." }
    ],
    skills: ["FORECAST.LINEAR","FORECAST.ETS","TREND","Moving average","Scenario planning","Variance analysis","Model comparison","AI-assisted forecasting","Executive storytelling","Risk-aware recommendation"],
    expectedOutput: "A 12-month forecast (three methods), a model-comparison note, Base/Upside/Downside scenarios, and an executive story with staffing, processing-capacity and funding recommendations.",
    solution: "Compare the three forecast methods: LINEAR answers 'what if the trend continues', ETS adds seasonality, TREND fits the line, and the moving average is a simple benchmark. If models disagree materially, investigate before deciding. Forecasts support decisions; they do not make them.",
    aiApplication: "Use AI_GUIDE prompts: Explore the data, Compare the three methods, Challenge as a skeptical CFO, build scenarios, draft the executive story, and recommend actions from validated forecasts. Rule: never treat an AI-generated number as evidence; separate facts, model output and assumptions.",
    howTo: [
      "Study the Chapter 5 visual lesson (page 1).",
      "Open BANKING_DATASET and read the business question.",
      "Open FORECAST_MODEL and build the three forecasts + moving average.",
      "Compare models and note disagreements.",
      "Build Base/Upside/Downside scenarios.",
      "Read FORECAST_STORY and write the executive recommendation.",
      "Use AI_GUIDE to challenge and refine.",
      "Return to the LMS."
    ]
  },
  /* ---- Working With Data (Step 8 / Level 1 "Session 3") practice workbooks ---- */
  "step08_sort_filter": {
    level: 1, session: 3, chapter: 1,
    workbook: "Lessons/Level_1_Session_3_Chp_1_Practice_&_Solutions.xlsx",
    title: "Sort & Filter Practice",
    category: "Working With Data",
    description: "Practise sorting, filtering and organising real datasets.",
    realWorldTask: "Reorder and narrow a messy export so the right rows are always easy to find.",
    skills: ["Sort","Custom sort","Auto filter","Filter by colour","Top 10 filter"],
    activity: "Sort a sales export, filter to a region, and isolate the top performers."
  },
  "step08_remove_duplicates": {
    level: 1, session: 3, chapter: 3,
    workbook: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx",
    title: "Data Cleaning Practice (Chapters 3–6)",
    category: "Working With Data",
    description: "One workbook covering Remove Duplicates (Ch 3), Data Validation (Ch 4), Text to Columns (Ch 5) and Flash Fill (Ch 6).",
    realWorldTask: "Clean a raw export end to end: de-duplicate, validate inputs, split columns and auto-fill patterns.",
    skills: ["Remove Duplicates","Data Validation","Text to Columns","Flash Fill"],
    activity: "Use the single Chp_3_to_6 workbook across chapters 3, 4, 5 and 6 — it is shared, not exclusive to one chapter."
  },
  "step08_text_to_columns": {
    level: 1, session: 3, chapter: 5,
    workbook: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx",
    title: "Data Cleaning Practice (Chapters 3–6)",
    category: "Working With Data",
    description: "Chapter 5 (Text to Columns) exercises from the shared Chp_3_to_6 workbook.",
    realWorldTask: "Split one combined column into separate, analysis-ready fields.",
    skills: ["Delimited split","Fixed width","Text to Columns"],
    activity: "Open the shared Chp_3_to_6 workbook and complete the Text to Columns task."
  },
  "step08_flash_fill": {
    level: 1, session: 3, chapter: 6,
    workbook: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx",
    title: "Data Cleaning Practice (Chapters 3–6)",
    category: "Working With Data",
    description: "Chapter 6 (Flash Fill) exercises from the shared Chp_3_to_6 workbook.",
    realWorldTask: "Let Excel detect the pattern and fill the rest automatically.",
    skills: ["Flash Fill","Pattern detection","Auto fill"],
    activity: "Open the shared Chp_3_to_6 workbook and complete the Flash Fill task."
  },
  /* ---- AutoSum (Step 2) page 2 practice workbook ---- */
  "step02_nested_formulas": {
    level: 1, session: 2, chapter: 5,
    workbook: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx",
    title: "AutoSum Practice",
    category: "Formulas & Functions",
    description: "Practise totalling ranges instantly with AutoSum and related shortcuts.",
    realWorldTask: "Build quick totals and running sums across a business dataset.",
    skills: ["AutoSum","SUM","Subtotals","Quick totals"],
    activity: "Use AutoSum to total each column and add a grand total row."
  },
  /* ---- Basic Visuals (Step 23 / Level 1 "Session 4") — one shared Chp_1_to_5 workbook ---- */
  "step23_create_charts": {
    level: 1, session: 4, chapter: 1,
    workbook: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx",
    sheet: "01 Create Charts",
    title: "Basic Visuals — Practice & Solutions",
    category: "Basic Visuals",
    description: "Practice creating charts from your data using the shared Basic Visuals workbook.",
    realWorldTask: "Turn a small sales table into a clear column chart.",
    scenario: "Monthly Sales",
    exercises: ["Select the data range","Insert a column chart","Move the chart to its own sheet","Resize and position the chart","Add the chart to a clean report layout"],
    skills: ["Insert Chart","Recommended Charts","Chart location","Chart sizing","Chart move"],
    workbookStructure: [
      { name: "START HERE", purpose: "Session 4 overview, sheet map and recommended workflow." },
      { name: "01 Create Charts", purpose: "Practice creating charts from data." },
      { name: "02 Chart Types", purpose: "Practice choosing the right chart type." },
      { name: "03 Edit Charts", purpose: "Practice editing chart data and layout." },
      { name: "04 Titles & Labels", purpose: "Practice adding titles, axis and data labels." },
      { name: "05 Format Charts", purpose: "Practice formatting chart colours and styles." },
      { name: "Solutions", purpose: "Check your charts against the model answers." }
    ],
    howTo: [
      "Study the Chapter 1 visual lesson (Create Charts).",
      "Open the workbook and read START HERE.",
      "Go to the 01 Create Charts sheet.",
      "Build the chart yourself in Excel.",
      "Compare with the Solutions sheet.",
      "Return to the LMS and mark the lesson complete."
    ]
  },
  "step23_chart_types": {
    level: 1, session: 4, chapter: 2,
    workbook: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx",
    sheet: "02 Chart Types",
    title: "Basic Visuals — Practice & Solutions",
    category: "Basic Visuals",
    description: "Practice choosing the right chart type for the message using the shared Basic Visuals workbook.",
    realWorldTask: "Decide whether a column, bar, line or pie chart best shows each dataset.",
    scenario: "Sales by Region vs Trend over Time",
    exercises: ["Pick a chart type for category comparison","Pick a chart type for time trends","Pick a chart type for part-to-whole","Change chart type on an existing chart","Explain why each choice fits"],
    skills: ["Column chart","Bar chart","Line chart","Pie chart","Chart type selection"],
    workbookStructure: [
      { name: "START HERE", purpose: "Session 4 overview, sheet map and recommended workflow." },
      { name: "01 Create Charts", purpose: "Practice creating charts from data." },
      { name: "02 Chart Types", purpose: "Practice choosing the right chart type." },
      { name: "03 Edit Charts", purpose: "Practice editing chart data and layout." },
      { name: "04 Titles & Labels", purpose: "Practice adding titles, axis and data labels." },
      { name: "05 Format Charts", purpose: "Practice formatting chart colours and styles." },
      { name: "Solutions", purpose: "Check your chart-type choices against the model answers." }
    ],
    howTo: [
      "Study the Chapter 2 visual lesson (Chart Types).",
      "Open the workbook and read START HERE.",
      "Go to the 02 Chart Types sheet.",
      "Choose the best chart type for each scenario.",
      "Compare with the Solutions sheet.",
      "Return to the LMS and mark the lesson complete."
    ]
  },
  "step23_edit_charts": {
    level: 1, session: 4, chapter: 3,
    workbook: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx",
    sheet: "03 Edit Charts",
    title: "Basic Visuals — Practice & Solutions",
    category: "Basic Visuals",
    description: "Practice editing chart data, layout and style using the shared Basic Visuals workbook.",
    realWorldTask: "Swap the data source, switch rows/columns and tidy a chart's layout.",
    scenario: "Quarterly Revenue",
    exercises: ["Change the chart data range","Switch row/column orientation","Edit the data source","Remove chart clutter","Update the chart after data changes"],
    skills: ["Select Data","Switch Row/Column","Edit Data Source","Chart layout","Refresh chart"],
    workbookStructure: [
      { name: "START HERE", purpose: "Session 4 overview, sheet map and recommended workflow." },
      { name: "01 Create Charts", purpose: "Practice creating charts from data." },
      { name: "02 Chart Types", purpose: "Practice choosing the right chart type." },
      { name: "03 Edit Charts", purpose: "Practice editing chart data and layout." },
      { name: "04 Titles & Labels", purpose: "Practice adding titles, axis and data labels." },
      { name: "05 Format Charts", purpose: "Practice formatting chart colours and styles." },
      { name: "Solutions", purpose: "Check your edits against the model answers." }
    ],
    howTo: [
      "Study the Chapter 3 visual lesson (Edit Charts).",
      "Open the workbook and read START HERE.",
      "Go to the 03 Edit Charts sheet.",
      "Edit the chart data and layout yourself.",
      "Compare with the Solutions sheet.",
      "Return to the LMS and mark the lesson complete."
    ]
  },
  "step23_titles_labels": {
    level: 1, session: 4, chapter: 4,
    workbook: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx",
    sheet: "04 Titles & Labels",
    title: "Basic Visuals — Practice & Solutions",
    category: "Basic Visuals",
    description: "Practice adding chart titles, axis labels and data labels using the shared Basic Visuals workbook.",
    realWorldTask: "Make a chart self-explanatory with a clear title and labelled axes.",
    scenario: "Product Performance",
    exercises: ["Add a chart title","Add axis titles","Show data labels","Position data labels","Remove redundant legend items"],
    skills: ["Chart Title","Axis Titles","Data Labels","Label position","Legend control"],
    workbookStructure: [
      { name: "START HERE", purpose: "Session 4 overview, sheet map and recommended workflow." },
      { name: "01 Create Charts", purpose: "Practice creating charts from data." },
      { name: "02 Chart Types", purpose: "Practice choosing the right chart type." },
      { name: "03 Edit Charts", purpose: "Practice editing chart data and layout." },
      { name: "04 Titles & Labels", purpose: "Practice adding titles, axis and data labels." },
      { name: "05 Format Charts", purpose: "Practice formatting chart colours and styles." },
      { name: "Solutions", purpose: "Check your labels against the model answers." }
    ],
    howTo: [
      "Study the Chapter 4 visual lesson (Add Titles, Labels).",
      "Open the workbook and read START HERE.",
      "Go to the 04 Titles & Labels sheet.",
      "Add titles and labels yourself.",
      "Compare with the Solutions sheet.",
      "Return to the LMS and mark the lesson complete."
    ]
  },
  "step23_format_charts": {
    level: 1, session: 4, chapter: 5,
    workbook: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx",
    sheet: "05 Format Charts",
    title: "Basic Visuals — Practice & Solutions",
    category: "Basic Visuals",
    description: "Practice formatting chart colours, fonts and effects using the shared Basic Visuals workbook.",
    realWorldTask: "Apply a clean, professional style so the chart reads at a glance.",
    scenario: "Executive Dashboard Chart",
    exercises: ["Apply a chart style","Change series colours","Format the plot area","Adjust fonts and text size","Add a clean professional finish"],
    skills: ["Chart Styles","Series colour","Plot area format","Font formatting","Professional finish"],
    workbookStructure: [
      { name: "START HERE", purpose: "Session 4 overview, sheet map and recommended workflow." },
      { name: "01 Create Charts", purpose: "Practice creating charts from data." },
      { name: "02 Chart Types", purpose: "Practice choosing the right chart type." },
      { name: "03 Edit Charts", purpose: "Practice editing chart data and layout." },
      { name: "04 Titles & Labels", purpose: "Practice adding titles, axis and data labels." },
      { name: "05 Format Charts", purpose: "Practice formatting chart colours and styles." },
      { name: "Solutions", purpose: "Check your formatting against the model answers." }
    ],
    howTo: [
      "Study the Chapter 5 visual lesson (Format Charts).",
      "Open the workbook and read START HERE.",
      "Go to the 05 Format Charts sheet.",
      "Format the chart yourself.",
      "Compare with the Solutions sheet.",
      "Return to the LMS and mark the lesson complete."
    ]
  },
  /* ---- Text Functions (Step 22 / Level 2 "Session 2") — one practice workbook per chapter ---- */
  "step22_left_right_mid": {
    level: 2, session: 2, chapter: 1,
    workbook: "Lessons/Level_2_Session_2_Chp_1_Practice_&_Solutions.xlsx",
    sheet: "Practice",
    title: "Text Functions — LEFT, RIGHT, MID — Practice & Solutions",
    category: "Text Functions",
    description: "Practice extracting parts of text using LEFT, RIGHT and MID.",
    realWorldTask: "Pull first name, last name and a code segment out of a combined text field.",
    scenario: "Customer export with one combined name column",
    exercises: ["Extract the first 3 characters","Extract the last 4 characters","Extract a middle substring by position","Split a full name into parts","Combine the pieces back with CONCAT"],
    skills: ["LEFT","RIGHT","MID","LEN","Text extraction"],
    workbookStructure: [
      { name: "Practice", purpose: "Exercises for LEFT, RIGHT, MID on realistic text." },
      { name: "Capstone", purpose: "Mixed Text Functions challenge (Session 2 combined workbook)." }
    ],
    howTo: [
      "Study the Chapter 1 visual lesson (LEFT, RIGHT, MID).",
      "Open the Chapter 1 practice workbook.",
      "Go to the Practice sheet.",
      "Solve the extraction tasks yourself in Excel.",
      "Check your answers, then continue to Chapter 2."
    ]
  },
  "step22_len_find_search": {
    level: 2, session: 2, chapter: 2,
    workbook: "Lessons/Level_2_Session_2_Chp_2_Practice_&_Solutions.xlsx",
    sheet: "Practice",
    title: "Text Functions — LEN, FIND, SEARCH — Practice & Solutions",
    category: "Text Functions",
    description: "Practice measuring and locating text with LEN, FIND and SEARCH.",
    realWorldTask: "Find the position of a delimiter and measure field lengths.",
    scenario: "Log lines and delimited identifiers",
    exercises: ["Count characters with LEN","Locate a substring with FIND","Locate a substring with SEARCH (case-insensitive)","Extract text after a found position","Handle text that is not found"],
    skills: ["LEN","FIND","SEARCH","ISERROR","Text location"],
    workbookStructure: [
      { name: "Practice", purpose: "Exercises for LEN, FIND, SEARCH on realistic text." },
      { name: "Capstone", purpose: "Mixed Text Functions challenge (Session 2 combined workbook)." }
    ],
    howTo: [
      "Study the Chapter 2 visual lesson (LEN, FIND, SEARCH).",
      "Open the Chapter 2 practice workbook.",
      "Go to the Practice sheet.",
      "Solve the location/measurement tasks yourself.",
      "Check your answers, then continue to Chapter 3."
    ]
  },
  "step22_case": {
    level: 2, session: 2, chapter: 3,
    workbook: "Lessons/Level_2_Session_2_Chp_3_Practice_&_Solutions.xlsx",
    sheet: "Practice",
    title: "Text Functions — UPPER, LOWER, PROPER — Practice & Solutions",
    category: "Text Functions",
    description: "Practice changing text case with UPPER, LOWER and PROPER.",
    realWorldTask: "Standardise a messy list of customer names to Proper Case.",
    scenario: "Imported names in mixed case",
    exercises: ["Convert to UPPER","Convert to LOWER","Convert to PROPER","Fix capitalisation of a name column","Combine with TRIM for clean output"],
    skills: ["UPPER","LOWER","PROPER","Case standardisation","Clean text"],
    workbookStructure: [
      { name: "Practice", purpose: "Exercises for UPPER, LOWER, PROPER on realistic text." },
      { name: "Capstone", purpose: "Mixed Text Functions challenge (Session 2 combined workbook)." }
    ],
    howTo: [
      "Study the Chapter 3 visual lesson (UPPER, LOWER, PROPER).",
      "Open the Chapter 3 practice workbook.",
      "Go to the Practice sheet.",
      "Standardise the case of each name yourself.",
      "Check your answers, then continue to Chapter 4."
    ]
  },
  "step22_trim_clean": {
    level: 2, session: 2, chapter: 4,
    workbook: "Lessons/Level_2_Session_2_Chp_4_Practice_&_Solutions.xlsx",
    sheet: "Practice",
    title: "Text Functions — TRIM, CLEAN — Practice & Solutions",
    category: "Text Functions",
    description: "Practice removing extra spaces and non-printing characters with TRIM and CLEAN.",
    realWorldTask: "Clean imported data that has hidden spaces and line characters.",
    scenario: "Pasted data with stray spaces",
    exercises: ["Remove leading/trailing spaces with TRIM","Remove non-printing characters with CLEAN","Combine TRIM and CLEAN","Compare dirty vs clean for a match","Prepare text for a lookup"],
    skills: ["TRIM","CLEAN","Space removal","Data hygiene","Lookup-ready text"],
    workbookStructure: [
      { name: "Practice", purpose: "Exercises for TRIM, CLEAN on realistic text." },
      { name: "Capstone", purpose: "Mixed Text Functions challenge (Session 2 combined workbook)." }
    ],
    howTo: [
      "Study the Chapter 4 visual lesson (TRIM, CLEAN).",
      "Open the Chapter 4 practice workbook.",
      "Go to the Practice sheet.",
      "Clean the dirty text yourself.",
      "Check your answers, then continue to Chapter 5."
    ]
  },
  "step22_concat_textjoin": {
    level: 2, session: 2, chapter: 5,
    workbook: "Lessons/Level_2_Session_2_Chp_5_Practice_&_Solutions.xlsx",
    sheet: "Practice",
    title: "Text Functions — CONCAT & TEXTJOIN — Practice & Solutions",
    category: "Text Functions",
    description: "Practice combining text with CONCAT and TEXTJOIN.",
    realWorldTask: "Build full names, addresses and labels from separate columns.",
    scenario: "Assembling a mailing label",
    exercises: ["Join two fields with CONCAT","Join several fields with TEXTJOIN","Add a delimiter with TEXTJOIN","Ignore empty cells","Build a readable full address"],
    skills: ["CONCAT","TEXTJOIN","Delimiters","Combine text","Labels"],
    workbookStructure: [
      { name: "Practice", purpose: "Exercises for CONCAT & TEXTJOIN on realistic text." },
      { name: "Capstone", purpose: "Mixed Text Functions challenge (Session 2 combined workbook)." }
    ],
    howTo: [
      "Study the Chapter 5 visual lesson (CONCAT & TEXTJOIN).",
      "Open the Chapter 5 practice workbook.",
      "Go to the Practice sheet.",
      "Build the combined text yourself.",
      "Check your answers."
    ]
  },

  /* ---- Lookup Functions (Step 3 / Level 2 "Session 3") — one practice workbook per chapter ---- */
  "step03_vlookup": {
    level: 2, session: 3, chapter: 1,
    workbook: "Lessons/Level_2_Session_3_Chp_1_Practice_&_Solutions.xlsx",
    sheet: "Banking Practice",
    title: "Lookup Functions - VLOOKUP - Practice & Solutions",
    category: "Lookup Functions",
    description: "Practice vertical lookups with VLOOKUP across realistic business datasets.",
    realWorldTask: "Pull customer, product and pricing details into a report using VLOOKUP.",
    scenario: "Banking / Retail / HR lookups",
    exercises: ["Look up a single value with exact match","Handle #N/A with IFERROR","Use approximate match for bands/grades","Build a lookup from a table","Verify results against the Solutions sheet"],
    skills: ["VLOOKUP","Exact match","Approximate match","IFERROR","Table lookup"],
    workbookStructure: [
      { name: "Banking Practice", purpose: "VLOOKUP tasks using a banking dataset." },
      { name: "Retail Practice", purpose: "VLOOKUP tasks using a retail dataset." },
      { name: "HR Practice", purpose: "VLOOKUP tasks using an HR dataset." },
      { name: "Solutions", purpose: "Check your VLOOKUP answers." }
    ],
    howTo: [
      "Study the Chapter 1 visual lesson (VLOOKUP, pages 1.1-1.3).",
      "Open the Chapter 1 practice workbook.",
      "Go to the Banking Practice sheet (or any chapter sheet).",
      "Solve the lookup tasks yourself in Excel.",
      "Compare with the Solutions sheet, then continue to Chapter 2."
    ]
  },
  "step03_xlookup": {
    level: 2, session: 3, chapter: 2,
    workbook: "Lessons/Level_2_Session_3_Chp_2_Practice_Solutions.xlsx",
    sheet: "Logistics Practice",
    title: "Lookup Functions - XLOOKUP - Practice & Solutions",
    category: "Lookup Functions",
    description: "Practice modern, flexible lookups with XLOOKUP.",
    realWorldTask: "Replace VLOOKUP with XLOOKUP for cleaner, safer lookups.",
    scenario: "Logistics / Healthcare / Education lookups",
    exercises: ["Look up values left or right of the key","Use IF NOT FOUND for missing data","Reverse search with last-to-first match","Use wildcards for partial matches","Verify against the Solutions sheet"],
    skills: ["XLOOKUP","If not found","Reverse search","Wildcard","Modern lookup"],
    workbookStructure: [
      { name: "Logistics Practice", purpose: "XLOOKUP tasks using a logistics dataset." },
      { name: "Healthcare Practice", purpose: "XLOOKUP tasks using a healthcare dataset." },
      { name: "Education Practice", purpose: "XLOOKUP tasks using an education dataset." },
      { name: "Solutions", purpose: "Check your XLOOKUP answers." }
    ],
    howTo: [
      "Study the Chapter 2 visual lesson (XLOOKUP, pages 2.1-2.3).",
      "Open the Chapter 2 practice workbook.",
      "Go to the Logistics Practice sheet (or any chapter sheet).",
      "Solve the lookup tasks yourself in Excel.",
      "Compare with the Solutions sheet, then continue to Chapter 3."
    ]
  },
  "step03_index_match": {
    level: 2, session: 3, chapter: 3,
    workbook: "Lessons/Level_2_Session_3_Chp_3_Practice_Solutions.xlsx",
    sheet: "Sales Challenge",
    title: "Lookup Functions - INDEX & MATCH - Practice & Solutions",
    category: "Lookup Functions",
    description: "Practice two-way and flexible lookups with INDEX & MATCH.",
    realWorldTask: "Build left, right and two-way lookups that VLOOKUP cannot do.",
    scenario: "Sales / Payroll / Target Matrix / Lookup Lab",
    exercises: ["Replace a column lookup with INDEX & MATCH","Build a two-way lookup (row + column)","Look up values to the left of the key","Combine MATCH with dynamic ranges","Verify against the Solutions sheet"],
    skills: ["INDEX","MATCH","Two-way lookup","Left lookup","Flexible lookup"],
    workbookStructure: [
      { name: "Sales Challenge", purpose: "INDEX & MATCH tasks using a sales dataset." },
      { name: "Payroll Challenge", purpose: "INDEX & MATCH tasks using a payroll dataset." },
      { name: "Target Matrix", purpose: "Two-way lookup practice." },
      { name: "Lookup Lab", purpose: "Mixed INDEX & MATCH exercises." },
      { name: "Solutions", purpose: "Check your INDEX & MATCH answers." }
    ],
    howTo: [
      "Study the Chapter 3 visual lesson (INDEX & MATCH, pages 3.1-3.2).",
      "Open the Chapter 3 practice workbook.",
      "Go to the Sales Challenge sheet (or any chapter sheet).",
      "Solve the lookup tasks yourself in Excel.",
      "Compare with the Solutions sheet, then continue to Chapter 4."
    ]
  },
  "step03_dynamic_lookups": {
    level: 2, session: 3, chapter: 4,
    workbook: "Lessons/Level_2_Session_3_Chp_4_Practice_and_Solutions.xlsx",
    sheet: "Start Here",
    title: "Lookup Functions - Dynamic Lookups - Practice & Solutions",
    category: "Lookup Functions",
    description: "Practice lookups that expand automatically as data grows.",
    realWorldTask: "Build resilient lookups using tables, structured references and dynamic arrays.",
    scenario: "Banking / Retail / Operations cases + final challenge",
    exercises: ["Convert a range to an Excel Table","Use structured references in lookups","Build a dynamic array lookup","Solve the Final Challenge","Verify against the Solutions sheet"],
    skills: ["Excel Tables","Structured references","Dynamic arrays","Spill","Resilient lookup"],
    workbookStructure: [
      { name: "Start Here", purpose: "Overview and recommended workflow." },
      { name: "Banking Case", purpose: "Dynamic lookup case using a banking dataset." },
      { name: "Retail Case", purpose: "Dynamic lookup case using a retail dataset." },
      { name: "Operations Case", purpose: "Dynamic lookup case using an operations dataset." },
      { name: "Final Challenge", purpose: "Combine all dynamic-lookup skills." },
      { name: "Solutions", purpose: "Check your dynamic-lookup answers." }
    ],
    howTo: [
      "Study the Chapter 4 visual lesson (Dynamic Lookups, pages 4.1-4.2).",
      "Open the Chapter 4 practice workbook.",
      "Read the Start Here sheet, then try a case sheet.",
      "Solve the dynamic-lookup tasks yourself in Excel.",
      "Compare with the Solutions sheet."
    ]
  }
,
  /* ---- Data Analysis Basics (Step 4 / Level 2 "Session 4") - one combined practice workbook for all 5 chapters ---- */
  "step04_pivot_tables": {
    level: 2, session: 4, chapter: 1,
    workbook: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    sheet: "PRACTICE TASKS",
    title: "Session 4 - Data Analysis Basics - Pivot Tables - Final Practice & Solutions",
    category: "Data Analysis Basics",
    description: "Session 4 Final Practice Workbook. Apply Pivot Tables across real-world Retail, Banking and Manufacturing datasets.",
    realWorldTask: "Build your first PivotTable summary from the raw industry datasets (Retail, Banking, Manufacturing).",
    scenario: "Retail / Banking / Manufacturing analysis",
    exercises: [
      "Create a PivotTable from raw data",
      "Select appropriate Rows and Columns",
      "Add Values and summarize Sales / Balance / Production",
      "Compare categories, regions, account types or plants",
      "Check your answer on the SOLUTIONS sheet"
    ],
    skills: ["PivotTable","Rows","Columns","Values","Summarize","Group"],
    workbookStructure: [
      { name: "START HERE", purpose: "Overview and recommended workflow for the Session 4 practice workbook." },
      { name: "RETAIL DATA", purpose: "Raw retail dataset for PivotTable practice." },
      { name: "BANKING DATA", purpose: "Raw banking dataset for PivotTable practice." },
      { name: "MANUFACTURING DATA", purpose: "Raw manufacturing dataset for PivotTable practice." },
      { name: "PRACTICE TASKS", purpose: "Pivot Table, grouping, values-area, chart and calculated-field tasks." },
      { name: "SOLUTIONS", purpose: "Check your Session 4 answers (use only after attempting the tasks)." }
    ],
    howTo: [
      "Study Chapter 1 (Pivot Tables, page 1.1).",
      "Open the Session 4 Final Practice Workbook.",
      "Read START HERE, then build a PivotTable from the RETAIL / BANKING / MANUFACTURING DATA sheet.",
      "Attempt the PRACTICE TASKS yourself in Excel.",
      "Compare with the SOLUTIONS sheet, then move to Chapter 2."
    ]
  },
  "step04_group_sort_filter": {
    level: 2, session: 4, chapter: 2,
    workbook: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    sheet: "PRACTICE TASKS",
    title: "Session 4 - Data Analysis Basics - Group Sort Filter - Final Practice & Solutions",
    category: "Data Analysis Basics",
    description: "Session 4 Final Practice Workbook. Group, sort and filter PivotTables across Retail, Banking and Manufacturing datasets.",
    realWorldTask: "Turn a basic PivotTable into a useful analytical report by grouping, sorting and filtering.",
    scenario: "Retail / Banking / Manufacturing analysis",
    exercises: [
      "Group dates by Month / Quarter",
      "Sort highest to lowest",
      "Filter categories, regions, account types and production shifts",
      "Use multiple filters and format PivotTable fields correctly"
    ],
    skills: ["Group","Sort","Filter","Multiple filters","Field formatting"],
    workbookStructure: [
      { name: "START HERE", purpose: "Overview and recommended workflow." },
      { name: "RETAIL DATA", purpose: "Raw retail dataset." },
      { name: "BANKING DATA", purpose: "Raw banking dataset." },
      { name: "MANUFACTURING DATA", purpose: "Raw manufacturing dataset." },
      { name: "PRACTICE TASKS", purpose: "Grouping, sorting and filtering tasks." },
      { name: "SOLUTIONS", purpose: "Check your answers (after attempting tasks)." }
    ],
    howTo: [
      "Study Chapter 2 (Group, Sort, Filter).",
      "Open the Session 4 Final Practice Workbook.",
      "On a PRACTICE TASKS PivotTable, group dates, sort and apply filters.",
      "Compare with the SOLUTIONS sheet, then move to Chapter 3."
    ]
  },
  "step04_values_area": {
    level: 2, session: 4, chapter: 3,
    workbook: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    sheet: "PRACTICE TASKS",
    title: "Session 4 - Data Analysis Basics - Values Area - Final Practice & Solutions",
    category: "Data Analysis Basics",
    description: "Session 4 Final Practice Workbook. Configure the Values area with Sum, Count, Average and % of Grand Total.",
    realWorldTask: "Decide whether Sum, Count, Average or % of Total answers the business question.",
    scenario: "Retail / Banking / Manufacturing analysis",
    exercises: [
      "Switch the Values area from Sum to Count",
      "Use Average and % of Grand Total",
      "Add multiple value fields",
      "Apply correct number formatting"
    ],
    skills: ["Sum","Count","Average","% of Grand Total","Number formatting"],
    workbookStructure: [
      { name: "START HERE", purpose: "Overview and recommended workflow." },
      { name: "RETAIL DATA", purpose: "Raw retail dataset." },
      { name: "BANKING DATA", purpose: "Raw banking dataset." },
      { name: "MANUFACTURING DATA", purpose: "Raw manufacturing dataset." },
      { name: "PRACTICE TASKS", purpose: "Values-area exercises." },
      { name: "SOLUTIONS", purpose: "Check your answers (after attempting tasks)." }
    ],
    howTo: [
      "Study Chapter 3 (Values Area).",
      "Open the Session 4 Final Practice Workbook.",
      "Edit the Values area of a PRACTICE TASKS PivotTable (Sum/Count/Average/% of Total).",
      "Compare with the SOLUTIONS sheet, then move to Chapter 4."
    ]
  },
  "step04_pivot_charts": {
    level: 2, session: 4, chapter: 4,
    workbook: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    sheet: "PRACTICE TASKS",
    title: "Session 4 - Data Analysis Basics - Pivot Charts - Final Practice & Solutions",
    category: "Data Analysis Basics",
    description: "Session 4 Final Practice Workbook. Create PivotCharts that communicate one clear business message.",
    realWorldTask: "Convert PivotTable insight into a chart that communicates one clear business message.",
    scenario: "Retail / Banking / Manufacturing analysis",
    exercises: [
      "Create a PivotChart from a PivotTable",
      "Compare categories and show trends",
      "Compare actual vs target with a meaningful title",
      "Choose the right chart type (chart stays linked to its PivotTable)"
    ],
    skills: ["PivotChart","Trend","Actual vs Target","Chart type"],
    workbookStructure: [
      { name: "START HERE", purpose: "Overview and recommended workflow." },
      { name: "RETAIL DATA", purpose: "Raw retail dataset." },
      { name: "BANKING DATA", purpose: "Raw banking dataset." },
      { name: "MANUFACTURING DATA", purpose: "Raw manufacturing dataset." },
      { name: "PRACTICE TASKS", purpose: "PivotChart tasks." },
      { name: "SOLUTIONS", purpose: "Check your answers (after attempting tasks)." }
    ],
    howTo: [
      "Study Chapter 4 (Pivot Charts).",
      "Open the Session 4 Final Practice Workbook.",
      "Create a PivotChart from a PRACTICE TASKS PivotTable.",
      "Compare with the SOLUTIONS sheet, then move to Chapter 5."
    ]
  },
  "step04_calc_field": {
    level: 2, session: 4, chapter: 5,
    workbook: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    sheet: "PRACTICE TASKS",
    title: "Session 4 - Data Analysis Basics - Basic Calculated Field - Final Practice & Solutions",
    category: "Data Analysis Basics",
    description: "Session 4 Final Practice Workbook. Create calculated fields (Profit, Profit Margin %, Achievement %, Defect %, Interest Earned, Cost/Unit).",
    realWorldTask: "Create a new analytical metric instead of simply reporting raw source fields.",
    scenario: "Retail / Banking / Manufacturing analysis",
    exercises: [
      "Create a Profit and Profit Margin % field",
      "Create Achievement % and Defect % fields",
      "Create Interest Earned and Cost/Unit fields",
      "Know when calculated fields are preferable to modifying source data"
    ],
    skills: ["Calculated field","Profit","Profit Margin %","Achievement %","Defect %","Interest Earned","Cost/Unit"],
    workbookStructure: [
      { name: "START HERE", purpose: "Overview and recommended workflow." },
      { name: "RETAIL DATA", purpose: "Raw retail dataset." },
      { name: "BANKING DATA", purpose: "Raw banking dataset." },
      { name: "MANUFACTURING DATA", purpose: "Raw manufacturing dataset." },
      { name: "PRACTICE TASKS", purpose: "Calculated-field exercises." },
      { name: "SOLUTIONS", purpose: "Check your answers (after attempting tasks)." }
    ],
    howTo: [
      "Study Chapter 5 (Basic Calculated Field, pages 5.1-5.2).",
      "Open the Session 4 Final Practice Workbook.",
      "Add calculated fields to a PRACTICE TASKS PivotTable (Profit, Margin, etc.).",
      "Compare with the SOLUTIONS sheet to finish Session 4."
    ]
  },

  /* ---- Advanced Formulas (Step 9 / Level 3 "Session 1") - per-chapter practice workbooks ---- */
  "step09_index_match_adv": {
    level: 3, session: 1, chapter: 1,
    workbook: "Lessons/Level_3_Session_1_Chp_1_Advanced_INDEX_MATCH_Hospitality_Practice.xlsx",
    sheet: "Practice",
    title: "Level 3 Session 1 - Chapter 1 - INDEX + MATCH (Advanced) - Hospitality Practice",
    category: "Advanced Formulas",
    description: "Practice advanced INDEX + MATCH using a hotel operations dataset.",
    realWorldTask: "Practice advanced INDEX + MATCH using a hotel operations dataset. Build dynamic row lookups, two-way lookups, user-driven selections and business reporting outputs.",
    scenario: "Hospitality / Hotel operations",
    exercises: [
      "Build a dynamic row lookup for a hotel operations record",
      "Create a two-way lookup (room type x season)",
      "Drive a user-selected report with INDEX + MATCH",
      "Produce a business reporting output from the lookup"
    ],
    skills: ["INDEX","MATCH","Two-way lookup","Dynamic row","User-driven selection"],
    workbookStructure: [
      { name: "Practice", purpose: "Hospitality INDEX + MATCH tasks." },
      { name: "Solutions", purpose: "Check your advanced INDEX + MATCH answers." }
    ],
    howTo: [
      "Study Chapter 1 (INDEX + MATCH Advanced).",
      "Open the Chapter 1 Hospitality practice workbook.",
      "Build the dynamic and two-way lookups yourself in Excel.",
      "Compare with the Solutions sheet."
    ]
  },
  "step09_xlookup_adv": {
    level: 3, session: 1, chapter: 2,
    workbook: "Lessons/Level_3_Session_1_Chp_2_Advanced_XLOOKUP_Logistics_Practice.xlsx",
    sheet: "Practice",
    title: "Level 3 Session 1 - Chapter 2 - XLOOKUP (Advanced) - Logistics Practice",
    category: "Advanced Formulas",
    description: "Practice advanced XLOOKUP using shipment and logistics data.",
    realWorldTask: "Practice advanced XLOOKUP using shipment and logistics data. Work with multi-column returns, last-match lookups, error handling, cross-sheet lookups and chained lookup scenarios.",
    scenario: "Logistics / Shipments",
    exercises: [
      "Return multiple columns with one XLOOKUP",
      "Use last-match logic for the latest shipment",
      "Handle errors with IFERROR / XLOOKUP defaults",
      "Chain XLOOKUP across sheets for a logistics report"
    ],
    skills: ["XLOOKUP","Multi-column return","Last match","Error handling","Cross-sheet"],
    workbookStructure: [
      { name: "Practice", purpose: "Logistics XLOOKUP tasks." },
      { name: "Solutions", purpose: "Check your advanced XLOOKUP answers." }
    ],
    howTo: [
      "Study Chapter 2 (XLOOKUP Advanced).",
      "Open the Chapter 2 Logistics practice workbook.",
      "Build the multi-column and last-match lookups yourself in Excel.",
      "Compare with the Solutions sheet."
    ]
  },
  "step09_offset": {
    level: 3, session: 1, chapter: 3,
    workbook: "Lessons/Level_3_Session_1_Chp_3_OFFSET_Retail_Practice.xlsx",
    sheet: "Practice",
    title: "Level 3 Session 1 - Chapter 3 - OFFSET - Retail Practice",
    category: "Advanced Formulas",
    description: "Practice OFFSET with retail sales data. Build rolling windows, dynamic ranges, moving analysis and dynamic reporting ranges.",
    realWorldTask: "Practice OFFSET with retail sales data. Build rolling windows, dynamic ranges, moving analysis and dynamic reporting ranges. NOTE: OFFSET is volatile - understand when INDEX or structured references may be a better alternative.",
    scenario: "Retail / Sales",
    exercises: [
      "Build a rolling N-period window with OFFSET + COUNTA",
      "Create a dynamic reporting range that grows with data",
      "Compute a moving average with OFFSET",
      "Know when to prefer INDEX / structured references over volatile OFFSET"
    ],
    skills: ["OFFSET","Dynamic range","Rolling window","Volatile","Moving average"],
    workbookStructure: [
      { name: "Practice", purpose: "Retail OFFSET tasks." },
      { name: "Solutions", purpose: "Check your OFFSET answers." }
    ],
    howTo: [
      "Study Chapter 3 (OFFSET).",
      "Open the Chapter 3 Retail practice workbook.",
      "Build the rolling / dynamic ranges yourself in Excel (note OFFSET is volatile).",
      "Compare with the Solutions sheet."
    ]
  },
  "step09_indirect": {
    level: 3, session: 1, chapter: 4,
    workbook: "Lessons/Level_3_Session_1_Chp_4_INDIRECT_Education_Dependent_Dropdowns_Practice.xlsx",
    sheet: "Practice",
    title: "Level 3 Session 1 - Chapter 4 - INDIRECT - Education Dependent Dropdowns Practice",
    category: "Advanced Formulas",
    description: "Practice INDIRECT by building text-to-reference logic, dynamic references and dependent dropdowns.",
    realWorldTask: "Practice INDIRECT by building text-to-reference logic, dynamic references and dependent dropdowns. Build Course -> Module -> Lesson selections and dynamic reference scenarios.",
    scenario: "Education / Courses",
    exercises: [
      "Convert text into a cell reference with INDIRECT",
      "Build a dynamic worksheet reference",
      "Create Course -> Module -> Lesson dependent dropdowns (INDIRECT + Data Validation)",
      "Switch data sources dynamically with INDIRECT"
    ],
    skills: ["INDIRECT","Text to reference","Dynamic worksheet","Dependent dropdowns","Data Validation"],
    workbookStructure: [
      { name: "Practice", purpose: "Education INDIRECT / dependent-dropdown tasks." },
      { name: "Solutions", purpose: "Check your INDIRECT answers." }
    ],
    howTo: [
      "Study Chapter 4 (INDIRECT) - both pages 4.1 and 4.2.",
      "Open the Chapter 4 Education practice workbook.",
      "Build the dependent dropdowns and dynamic references yourself in Excel.",
      "Compare with the Solutions sheet."
    ]
  },
  "step09_combinations": {
    level: 3, session: 1, chapter: 5,
    workbook: "Lessons/Level_3_Session_1_Chp_5_CHOOSE_MATCH_INDEX_Healthcare_Practice.xlsx",
    sheet: "Practice",
    title: "Level 3 Session 1 - Chapter 5 - CHOOSE + MATCH + INDEX - Healthcare Practice",
    category: "Advanced Formulas",
    description: "Practice combining CHOOSE, MATCH and INDEX to build dynamic metric selectors, scenario selectors and management KPI logic.",
    realWorldTask: "Practice combining CHOOSE, MATCH and INDEX to build dynamic metric selectors, scenario selectors and management KPI logic.",
    scenario: "Healthcare operations",
    exercises: [
      "Build a dynamic metric selector (Sales / Profit / Units) with CHOOSE + MATCH + INDEX",
      "Create a scenario selector that swaps the returned dataset",
      "Assemble management KPI logic from the combined functions",
      "Verify the selector against several metrics"
    ],
    skills: ["CHOOSE","MATCH","INDEX","Metric selector","Scenario selector","KPI logic"],
    workbookStructure: [
      { name: "Practice", purpose: "Healthcare CHOOSE + MATCH + INDEX tasks." },
      { name: "Solutions", purpose: "Check your combined-function answers." }
    ],
    howTo: [
      "Study Chapter 5 (CHOOSE + MATCH + INDEX) - pages 5.1 and 5.2.",
      "Open the Chapter 5 Healthcare practice workbook.",
      "Build the metric / scenario selectors yourself in Excel.",
      "Compare with the Solutions sheet."
    ]
  },
  /* ---- Level 3 Session 2 (Step 10 / Data Analysis) — single Session practice workbook on Chapter 5 ---- */
  /* NOTE: the physical file is named "Session_4" but belongs to Session 2 per the project structure. */
  "step10_pivot_insights": {
    level: 3, session: 2, chapter: 5,
    workbook: "Lessons/Level_3_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    title: "Level 3 Session 2 — Chapters 1–5 Practice",
    badge: "PRACTICE PROJECT",
    ctaLabel: "OPEN PRACTICE EXCEL",
    sheet: "PRACTICE",
    skills: ["Advanced PivotTables", "Slicers & Timelines", "Calculated Fields", "Show Values As", "Pivot Insights"],
    realWorldTask: "Apply the concepts from Chapters 1–5 using a complete business dataset. Work through the practice problems first, then use the solution sheet to verify your formulas, analysis and final results.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice project" },
      { name: "RETAIL DATA", purpose: "Retail dataset for practice" },
      { name: "BANKING DATA", purpose: "Banking dataset for practice" },
      { name: "HEALTHCARE DATA", purpose: "Healthcare dataset for practice" },
      { name: "PIVOT FIELD MAP", purpose: "Field reference for building pivots" },
      { name: "PRACTICE", purpose: "Solve these exercises yourself" },
      { name: "SOLUTION", purpose: "Check your formulas and results" },
      { name: "INSIGHTS LAB", purpose: "Extra analysis challenges" },
      { name: "CHECKLIST", purpose: "Self-check before you finish" }
    ]
  },
  "step11_combo_charts": {
    level: 3, session: 3, chapter: 1,
    workbook: "Lessons/Level_3_Session_3_Chp_1_Combo_Charts_Practice_Solutions.xlsx",
    title: "Combo Charts Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Column + Line Charts","Secondary Axis","KPI + Dimension","Dual Metric Dashboards","Business Storytelling"],
    realWorldTask: "Build a Column + Line combo chart showing Revenue (columns) and Margin % (line) on a secondary axis. Practice combining KPIs and dimensions for executive reporting.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "RETAIL DATA", purpose: "Retail dataset for combo charts" },
      { name: "PRACTICE", purpose: "Solve the exercises yourself" },
      { name: "SOLUTION", purpose: "Check your formulas and charts" },
      { name: "CHECKLIST", purpose: "Self-check before finishing" }
    ]
  },
  "step11_dynamic_charts": {
    level: 3, session: 3, chapter: 2,
    workbook: "Lessons/Level_3_Session_3_Chp_2_Dynamic_Charts_Practice_Solutions.xlsx",
    title: "Dynamic Charts Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Dynamic Ranges","OFFSET","INDEX","Dropdown Selectors","Dynamic KPIs"],
    realWorldTask: "Build chart sources that grow automatically using OFFSET and INDEX, then connect a dropdown selector so the chart updates without manual range edits.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "SALES DATA", purpose: "Dynamic source dataset" },
      { name: "PRACTICE", purpose: "Build the dynamic ranges and charts" },
      { name: "SOLUTION", purpose: "Check your dynamic chart logic" }
    ]
  },
  "step11_conditional_formatting": {
    level: 3, session: 3, chapter: 3,
    workbook: "Lessons/Level_3_Session_3_Chp_3_Conditional_Formatting_Practice_Solutions.xlsx",
    title: "Conditional Formatting Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Color Scales","Icon Sets","Formula Rules","Full Row Highlight","TAT MIS Scenarios"],
    realWorldTask: "Apply KPI thresholds and SLA breach rules to a TAT MIS report using color scales, icon sets and formula-based row highlighting.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "MIS DATA", purpose: "TAT MIS dataset" },
      { name: "PRACTICE", purpose: "Apply the rules yourself" },
      { name: "SOLUTION", purpose: "Check your formatting rules" }
    ]
  },
  "step11_data_bars_scales": {
    level: 3, session: 3, chapter: 4,
    workbook: "Lessons/Level_3_Session_3_Chp_4_Data_Bars_Color_Scales_Icon_Sets_Practice_Solutions.xlsx",
    title: "Data Bars, Color Scales & Icon Sets Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Data Bars","Color Scales","Icon Sets","Rule Priority","Business Signals"],
    realWorldTask: "Choose the right in-cell signal for each business question: data bars for magnitude, color scales for deviation, icon sets for status.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "KPI DATA", purpose: "Business KPI dataset" },
      { name: "PRACTICE", purpose: "Apply the signals" },
      { name: "SOLUTION", purpose: "Check your signal choices" }
    ]
  },
  "step11_dashboard_design": {
    level: 3, session: 3, chapter: 5,
    workbook: "Lessons/Level_3_Session_3_Chp_5_Basic_Dashboard_Design_Layouts_Practice_Solutions.xlsx",
    title: "Basic Dashboard Design Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Dashboard Layout","KPI Cards","Chart Selection","Filter Controls","Design Rules"],
    realWorldTask: "Plan and build a decision-ready dashboard: choose the right chart types, lay out KPI cards, add filters and apply clarity rules.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "RAW DATA", purpose: "Base dataset" },
      { name: "DASHBOARD PLAN", purpose: "Layout planning" },
      { name: "PRACTICE", purpose: "Build the dashboard" },
      { name: "SOLUTION", purpose: "Check your dashboard design" }
    ]
  },
  /* ---- Level 3 Session 4 (Step 12 / Power Query Basics) ---- */
  "step12_get_data": {
    level: 3, session: 4, chapter: 1,
    workbook: "Lessons/Level_3_Session_4_Ch1_Ch2_Power_Query_Practice_Solutions.xlsx",
    title: "Power Query Basics — Get Data Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Get Data","Import Sources","Query Connection"],
    realWorldTask: "Connect to files, folders or databases and preview the data before loading.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "PRACTICE", purpose: "Connect and import sources" },
      { name: "SOLUTION", purpose: "Check your import setup" }
    ]
  },
  "step12_clean_transform": {
    level: 3, session: 4, chapter: 2,
    workbook: "Lessons/Level_3_Session_4_Chp_1_to_5_Practice_Solutions.xlsx",
    title: "Power Query Basics — Clean & Transform Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Transform","Remove columns","Promote headers"],
    realWorldTask: "Shape messy imports into clean, analysis-ready tables.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "PRACTICE", purpose: "Clean and reshape data" },
      { name: "SOLUTION", purpose: "Check your transform steps" }
    ]
  },
  "step12_split_merge_pivot": {
    level: 3, session: 4, chapter: 3,
    workbook: "Lessons/Level_3_Session_4_Chp_3_Split_Merge_Pivot_Practice_Solutions.xlsx",
    title: "Power Query Basics — Split, Merge, Pivot Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Split column","Merge queries","Pivot"],
    realWorldTask: "Split text, combine tables and pivot data into summary formats.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "PRACTICE", purpose: "Split, merge and pivot data" },
      { name: "SOLUTION", purpose: "Check your transformations" }
    ]
  },
  "step12_append_queries": {
    level: 3, session: 4, chapter: 4,
    workbook: "Lessons/Level_3_Session_4_Chp_4_Append_Queries_Practice_Solutions.xlsx",
    title: "Power Query Basics — Append Queries Practice",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Append queries","Stack data","Combine files"],
    realWorldTask: "Combine multiple source files into one unified query table.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "PRACTICE", purpose: "Append multiple sources" },
      { name: "SOLUTION", purpose: "Check your combined query" }
    ]
  },
  "step12_load_to": {
    level: 3, session: 4, chapter: 5,
    workbook: "Lessons/Level_3_Session_4_Chp_5_Load_to_Table_Pivot_Practice_Solutions.xlsx",
    title: "Load to Table / Pivot — Practice + Solutions",
    badge: "PRACTICE WORKBOOK",
    ctaLabel: "PRACTICE",
    sheet: "PRACTICE",
    skills: ["Load to table","Data model","Pivot load"],
    realWorldTask: "Load transformed data to Excel tables, the data model or PivotTables.",
    workbookStructure: [
      { name: "START HERE", purpose: "How to use this practice" },
      { name: "PRACTICE", purpose: "Load results into Excel" },
      { name: "SOLUTION", purpose: "Check your load outputs" }
    ]
  }
};

const LEARNING_PATH = [
  {
    step: 1,
    code: "01",
    section: "Excel Basics",
    subtitle: "Build A Confident Foundation",
    description: "Master the Excel interface, enter and edit data accurately, format cells professionally and write your first formulas.",
    level: "Beginner",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Create a daily sales tracker.",
    objectives: [
      "Navigate the Excel interface, ribbon and workbook structure with confidence",
      "Enter, edit and clean data accurately",
      "Apply professional cell formatting",
      "Write and copy basic formulas correctly",
      "Work faster using essential keyboard shortcuts"
    ],
    topics: [
      { id: "step01_interface_navigation", title: "Excel interface & workbook basics",  level: "Beginner", summary: "Understand the Excel interface, ribbon and workbook structure.", keywords: ["ribbon","workbook","worksheet","tabs","name box","navigation"], lessonImage: null, lessonImages: SESSION1_CHAPTERS[1], practiceFile: null, solutionFile: null },
      { id: "step01_data_entry_editing", title: "Rows, Columns, Cells, Ranges",      level: "Beginner", summary: "Work with rows, columns, individual cells and ranges.", keywords: ["rows","columns","cells","ranges","selection"], lessonImage: null, lessonImages: SESSION1_CHAPTERS[2], practiceFile: null, solutionFile: null },
      { id: "step01_cell_formatting", title: "Data types & formats",              level: "Beginner", summary: "Apply the right data types and number formats.", keywords: ["data types","number format","text","date","currency"], lessonImage: null, lessonImages: SESSION1_CHAPTERS[3], practiceFile: null, solutionFile: null },
      { id: "step01_basic_formulas", title: "Save, Open, Print",                level: "Beginner", summary: "Save, open and print workbooks correctly.", keywords: ["save","open","print","file"], lessonImage: null, lessonImages: SESSION1_CHAPTERS[4], practiceFile: null, solutionFile: null },
      { id: "step01_common_shortcuts", title: "Basic data entry tips",            level: "Beginner", summary: "Enter data faster and more accurately.", keywords: ["data entry","autofill","tips","fill handle"], lessonImage: null, lessonImages: SESSION1_CHAPTERS[5], practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 2,
    code: "02",
    section: "Formulas & Functions",
    subtitle: "Turn Data Into Calculations",
    description: "Use Excel's function library to calculate, transform text, handle dates and build decision logic.",
    level: "Beginner",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Calculate employee bonus.",
    objectives: [
      "Apply math and text functions to real data",
      "Build decision logic with IF, AND, OR and IFS",
      "Calculate durations and deadlines with date and time functions",
      "Retrieve values using lookup functions",
      "Combine functions into reliable nested formulas"
    ],
    topics: [
      { id: "step02_math_text_functions", title: "SUM, AVERAGE, COUNT",  level: "Beginner",     summary: "Use the core aggregation functions SUM, AVERAGE and COUNT.", keywords: ["sum","average","count","aggregate","statistics"], lessonImage: "Lessons/Excel Mastery - Level 1 - Session 2 - Chp - 1.png", practiceFile: null, solutionFile: null },
      { id: "step02_logical_functions", title: "MIN, MAX",        level: "Beginner",     summary: "Find the smallest and largest values with MIN and MAX.", keywords: ["min","max","smallest","largest","range"], lessonImage: "Lessons/Excel Mastery - Level 1 - Session 2 - Chp - 2.png", practiceFile: null, solutionFile: null },
      { id: "step02_date_time_functions", title: "Basic Math Operators",  level: "Beginner", summary: "Add, subtract, multiply and divide with +, -, *, /.", keywords: ["operators","math","addition","subtraction","multiply","divide"], lessonImage: "Lessons/Excel Mastery - Level 1 - Session 2 - Chp - 3.png", practiceFile: null, solutionFile: null },
      { id: "step02_lookup_functions", title: "Cell Referencing (Relative, Absolute)",          level: "Beginner", summary: "Use relative and absolute references with $ in formulas.", keywords: ["cell reference","relative","absolute","dollar sign","$"], lessonImage: "Lessons/Excel Mastery - Level 1 - Session 2 - Chp - 4.png", practiceFile: null, solutionFile: null },
      { id: "step02_nested_formulas", title: "AutoSum",            level: "Beginner", summary: "Add up ranges instantly with the AutoSum button.", keywords: ["autosum","sum button","quick sum","sigma"], lessonImages: chp(1, 2, 5, 2), practiceFile: "Lessons/Level_1_Session_2_Chp_5.2_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 3,
    code: "03",
    section: "Lookup & References",
    subtitle: "Connect Data Across Tables",
    description: "Retrieve and relate data across sheets and tables using classic and modern lookup techniques.",
    level: "Intermediate",
    lessonImage: "Lessons/Step 3 - Syllabus-Roadmap.png",
    stepLessonId: "step03_lookup_references",
    realWorldExample: "Fetch product prices from a lookup list.",
    objectives: [
      "Use VLOOKUP correctly and know its limits",
      "Replace legacy lookups with XLOOKUP",
      "Build flexible two-way lookups with INDEX & MATCH",
      "Create dynamic lookups that adapt as data grows"
    ],
    topics: [
      { id: "step03_vlookup", title: "VLOOKUP",                 level: "Intermediate", summary: "Retrieve values from a table with VLOOKUP and avoid its pitfalls.", keywords: ["vlookup","exact match","approximate match","lookup table","#n/a","reference"], lessonImages: chp(2, 3, 1, 3), practiceFile: "Lessons/Level_2_Session_3_Chp_1_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step03_xlookup", title: "XLOOKUP",                 level: "Intermediate", summary: "Use the modern, flexible replacement for VLOOKUP and HLOOKUP.", keywords: ["xlookup","if not found","reverse search","modern lookup","match mode","search mode"], lessonImages: chp(2, 3, 2, 3), practiceFile: "Lessons/Level_2_Session_3_Chp_2_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step03_index_match", title: "INDEX & MATCH",       level: "Intermediate", summary: "Build powerful left, right and two-way lookups with INDEX & MATCH.", keywords: ["index","match","two way lookup","left lookup","array","flexible lookup"], lessonImages: chp(2, 3, 3, 2), practiceFile: "Lessons/Level_2_Session_3_Chp_3_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step03_dynamic_lookups", title: "Dynamic Lookups", level: "Advanced",     summary: "Create lookups that expand automatically with your data.", keywords: ["dynamic","indirect","offset","tables","structured references","spill","dynamic array"], lessonImages: chp(2, 3, 4, 2), practiceFile: "Lessons/Level_2_Session_3_Chp_4_Practice_and_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 4,
    code: "4",
    section: "Data Analysis Basics",
    subtitle: "Pivot Tables & Analytical Summaries",
    description: "Summarize and analyze data with Pivot Tables and Pivot Charts.",
    level: "Intermediate",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Build a monthly sales summary from raw transaction rows.",
    objectives: [
      "Create and configure Pivot Tables",
      "Group, sort and filter pivot data",
      "Visualize pivots with Pivot Charts"
    ],
    topics: [
      { id: "step04_pivot_tables", title: "Pivot Tables (Create)", level: "Intermediate", summary: "Build a Pivot Table from a data range.", keywords: ["pivot table","create","summarize"], lessonImages: chp(2, 4, 1, 2), practiceFile: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Open the START HERE sheet, then choose the Retail, Banking or Manufacturing dataset and build your first PivotTable from raw rows.",
        "Add Rows, Columns (where useful) and Values; summarize Sales, Balance or Production by category, region, account type or plant."
      ] },
      { id: "step04_group_sort_filter", title: "Group, Sort, Filter", level: "Intermediate", summary: "Organize and narrow pivot results.", keywords: ["group","sort","filter"], lessonImages: chp(2, 4, 2, 1), practiceFile: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "On any PRACTICE TASKS PivotTable, group dates by Month/Quarter, sort highest to lowest and apply category/region/account-type filters.",
        "Use multiple filters and format the PivotTable fields so the basic summary becomes a useful analytical report."
      ] },
      { id: "step04_values_area", title: "Values Area", level: "Intermediate", summary: "Configure value field settings and aggregations.", keywords: ["values area","sum","count","aggregation"], lessonImages: chp(2, 4, 3, 1), practiceFile: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "In the PRACTICE TASKS workbook, change the Values area from Sum to Count, Average and % of Grand Total.",
        "Add multiple value fields and apply correct number formatting; decide whether Sum, Count, Average or % of Total answers the business question."
      ] },
      { id: "step04_pivot_charts", title: "Pivot Charts", level: "Intermediate", summary: "Chart a Pivot Table for visual insight.", keywords: ["pivot chart","chart"], lessonImages: chp(2, 4, 4, 1), practiceFile: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Create a PivotChart from a PivotTable in the PRACTICE TASKS workbook; compare categories and show trends.",
        "Use a meaningful title and the right chart type; remember the PivotChart stays linked to its PivotTable structure."
      ] },
      { id: "step04_calc_field", title: "Basic Calculated Field", level: "Intermediate", summary: "Add a calculated field inside a Pivot Table.", keywords: ["calculated field","formula"], lessonImages: chp(2, 4, 5, 2), practiceFile: "Lessons/Level_2_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "On the first Calculated-Field page, open the PRACTICE TASKS workbook and create a Profit and Profit Margin % field inside the PivotTable.",
        "On the second page, add Achievement %, Defect %, Interest Earned and Cost/Unit fields; understand when calculated fields beat editing source data."
      ] }
    ]
  },
  {
    step: 8,
    code: "08",
    section: "Working With Data",
    subtitle: "Clean, Shape & Prepare Data",
    description: "Turn messy raw data into analysis-ready tables.",
    level: "Beginner",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Clean an exported report before analysis.",
    objectives: [
      "Sort, filter and find data fast",
      "Remove duplicates and validate input",
      "Split and combine text cleanly",
      "Use Flash Fill to automate entry"
    ],
    topics: [
      { id: "step08_sort_filter", title: "Sort & Filter", level: "Beginner", summary: "Organise and narrow down data with sort and filter.", keywords: ["sort","filter","auto filter","custom sort"], lessonImages: chp(1, 3, 1, 1), practiceFile: "Lessons/Level_1_Session_3_Chp_1_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step08_find_replace", title: "Find & Replace", level: "Beginner", summary: "Locate and replace values and formats quickly.", keywords: ["find","replace","go to special"], lessonImages: chp(1, 3, 2, 1), practiceFile: null, solutionFile: null },
      { id: "step08_remove_duplicates", title: "Remove Duplicates", level: "Beginner", summary: "Eliminate duplicate rows safely.", keywords: ["remove duplicates","unique","dedupe"], lessonImages: chp(1, 3, 3, 1), practiceFile: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step08_data_validation", title: "Data Validation", level: "Beginner", summary: "Control what users can enter with dropdowns and rules.", keywords: ["data validation","dropdown","input message"], lessonImages: chp(1, 3, 4, 2), practiceFile: null, solutionFile: null },
      { id: "step08_text_to_columns", title: "Text to Columns", level: "Beginner", summary: "Split one column into several.", keywords: ["text to columns","delimited","fixed width"], lessonImages: chp(1, 3, 5, 1), practiceFile: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step08_flash_fill", title: "Flash Fill", level: "Beginner", summary: "Automatically fill patterns without formulas.", keywords: ["flash fill","pattern","auto fill"], lessonImages: chp(1, 3, 6, 1), practiceFile: "Lessons/Level_1_Session_3_Chp_3_to_6_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 9,
    code: "09",
    section: "Advanced Formulas",
    subtitle: "Master Complex Lookups & References",
    description: "Build robust, advanced formulas with modern lookup and reference functions.",
    level: "Advanced",
    lessonImage: "Lessons/Step 9 - Syllabus-Roadmap.png",
    stepLessonId: "step09_advanced_formulas",
    realWorldExample: "Build a dynamic, error-proof reporting formula.",
    objectives: [
      "Combine INDEX, MATCH and CHOOSE",
      "Use OFFSET and INDIRECT safely",
      "Build flexible two-way lookups"
    ],
    topics: [
      { id: "step09_index_match_adv", title: "INDEX + MATCH (Advanced)", level: "Advanced", summary: "Advanced two-way and multi-criteria lookups.", keywords: ["index","match","two way lookup","advanced lookup"], lessonImages: chp(3, 1, 1, 1), practiceFile: "Lessons/Level_3_Session_1_Chp_1_Advanced_INDEX_MATCH_Hospitality_Practice.xlsx", solutionFile: null, pageExplanations: [
        "Extend basic INDEX + MATCH into dynamic two-way lookups with dynamic row/column selection.",
        "Combine INDEX + MATCH with other functions for flexible, business-ready lookup structures."
      ] },
      { id: "step09_xlookup_adv", title: "XLOOKUP (Advanced)", level: "Advanced", summary: "Modern, flexible lookups with XLOOKUP.", keywords: ["xlookup","reverse search","wildcard"], lessonImages: chp(3, 1, 2, 1), practiceFile: "Lessons/Level_3_Session_1_Chp_2_Advanced_XLOOKUP_Logistics_Practice.xlsx", solutionFile: null, pageExplanations: [
        "Use XLOOKUP with dynamic return arrays, calculated arrays and multiple-condition logic.",
        "Apply advanced XLOOKUP error handling, first/last match and approximate/exact decisions in a dashboard."
      ] },
      { id: "step09_offset", title: "OFFSET", level: "Advanced", summary: "Build dynamic ranges with OFFSET.", keywords: ["offset","dynamic range","volatile"], lessonImages: chp(3, 1, 3, 1), practiceFile: "Lessons/Level_3_Session_1_Chp_3_OFFSET_Retail_Practice.xlsx", solutionFile: null, pageExplanations: [
        "Build dynamic, variable-height/width rolling ranges with OFFSET + COUNTA / MATCH.",
        "Drive dynamic chart sources and rolling averages; note OFFSET is volatile and when INDEX/non-volatile alternatives are better."
      ] },
      { id: "step09_indirect", title: "INDIRECT", level: "Advanced", summary: "Create references from text with INDIRECT.", keywords: ["indirect","text reference","volatile"], lessonImages: chp(3, 1, 4, 2), practiceFile: "Lessons/Level_3_Session_1_Chp_4_INDIRECT_Education_Dependent_Dropdowns_Practice.xlsx", solutionFile: null, pageExplanations: [
        "Convert text into dynamic cell, worksheet and named-range references with INDIRECT.",
        "Build Region -> State -> City dependent dropdowns and dynamic source selection; note INDIRECT is volatile and when to prefer INDEX/XLOOKUP/structured references/Power Query."
      ] },
      { id: "step09_combinations", title: "CHOOSE, MATCH, INDEX Combinations", level: "Advanced", summary: "Combine CHOOSE, MATCH and INDEX for complex logic.", keywords: ["choose","match","index","combinations"], lessonImages: chp(3, 1, 5, 2), practiceFile: "Lessons/Level_3_Session_1_Chp_5_CHOOSE_MATCH_INDEX_Healthcare_Practice.xlsx", solutionFile: null, pageExplanations: [
        "Use CHOOSE + MATCH + INDEX to build a Metric selector (Sales / Profit / Units).",
        "Combine all five advanced formula techniques into one professional dynamic dashboard model."
      ] }
    ],
    finalProject: {
      workbook: "Lessons/Level_3_Session_1_Chp_1_to_5_Advanced_Dynamic_Dashboard_Project.xlsx",
      title: "FINAL SESSION PROJECT — Advanced Dynamic Dashboard",
      desc: "You have completed all five advanced formula topics. Now combine them into one professional dynamic dashboard.",
      projectOf: "step09_combinations"
    }
  },
  {
    step: 10,
    code: "10",
    section: "Data Analysis",
    subtitle: "Go Deeper With Pivot Tables",
    description: "Advanced PivotTable analysis, calculations and insights.",
    level: "Advanced",
    lessonImage: "Lessons/Step 10 - Syllabus-Roadmap.png",
    stepLessonId: "step10_data_analysis",
    realWorldExample: "Summarise a large dataset into actionable insight.",
    objectives: [
      "Build advanced PivotTables",
      "Use calculated fields and Show Values As",
      "Extract insights from Pivots"
    ],
    topics: [
      { id: "step10_advanced_pivots", title: "Advanced Pivot Tables", level: "Advanced", summary: "Grouping, calculated items and advanced layouts.", keywords: ["pivot","grouping","calculated item"], lessonImages: chp(3, 2, 1, 2), practiceFile: null, solutionFile: null },
      { id: "step10_slicers_timelines", title: "Slicers & Timelines", level: "Advanced", summary: "Interactive filtering with slicers and timelines.", keywords: ["slicer","timeline","interactive filter"], lessonImages: chp(3, 2, 2, 2), practiceFile: null, solutionFile: null },
      { id: "step10_pivot_calc", title: "Pivot Table Calculations", level: "Advanced", summary: "Calculated fields and items in Pivots.", keywords: ["calculated field","calculated item","pivot formula"], lessonImages: chp(3, 2, 3, 1), practiceFile: null, solutionFile: null },
      { id: "step10_show_values_as", title: "Show Values As", level: "Advanced", summary: "Percent of, running total and other summaries.", keywords: ["show values as","percent of","running total"], lessonImages: chp(3, 2, 4, 1), practiceFile: null, solutionFile: null },
      { id: "step10_pivot_insights", title: "Get Pivot Insights", level: "Advanced", summary: "Use Pivot insights and recommendations.", keywords: ["pivot insights","recommendations","analyze data"], lessonImages: chp(3, 2, 5, 1), practiceFile: "Lessons/Level_3_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 11,
    code: "11",
    section: "Data Visualization",
    subtitle: "Design Clear, Dynamic Charts",
    description: "Advanced charting and conditional formatting for dashboards.",
    level: "Advanced",
    lessonImage: "Lessons/Step 11 - Syllabus-Roadmap.png",
    stepLessonId: null,
    realWorldExample: "Build a dynamic chart that updates with the data.",
    objectives: [
      "Combine chart types with combo charts",
      "Build dynamic, interactive charts",
      "Apply conditional formatting at scale",
      "Use data bars, color scales and icon sets",
      "Design a clear dashboard layout"
    ],
    challengeFile: "Lessons/Level_3_Session_3_Chp_5_Basic_Dashboard_Design_Layouts_Practice_Solutions.xlsx",
    challengeTitle: "SESSION 3 FINAL CHALLENGE — Decision-Ready Dashboard",
    challengeDesc: "Combine combo charts, dynamic sources, conditional formatting and dashboard design into one business-ready dashboard.",
    topics: [
      { id: "step11_combo_charts", title: "Combo Charts", level: "Advanced", summary: "Mix chart types on one axis.", keywords: ["combo chart","secondary axis","mixed chart"], lessonImages: chp(3, 3, 1, 3), practiceFile: "Lessons/Level_3_Session_3_Chp_1_Combo_Charts_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Build a Column + Line combo chart to show Revenue (columns) and Margin % (line) together.",
        "Understand when to use a secondary axis and how to format it so the story is clear.",
        "Combine KPIs with dimension breakdowns in one chart — the core of executive reporting."
      ] },
      { id: "step11_dynamic_charts", title: "Dynamic Charts", level: "Advanced", summary: "Charts that respond to controls.", keywords: ["dynamic chart","dynamic range","interactive"], lessonImages: chp(3, 3, 2, 3), practiceFile: "Lessons/Level_3_Session_3_Chp_2_Dynamic_Charts_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Use OFFSET and INDEX to build chart sources that grow automatically.",
        "Replace fixed ranges with dynamic row/column selectors tied to dropdowns.",
        "Build a chart that updates when the user selects a new KPI or dimension."
      ] },
      { id: "step11_conditional_formatting", title: "Conditional Formatting", level: "Advanced", summary: "Rules, formulas and top/bottom formatting.", keywords: ["conditional formatting","rules","heatmap"], lessonImages: chp(3, 3, 3, 4), practiceFile: "Lessons/Level_3_Session_3_Chp_3_Conditional_Formatting_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Apply KPI thresholds with color scales and icon sets.",
        "Build report-level rules (full-row highlight) using a formula-based condition.",
        "Practice TAT MIS scenarios — highlight SLA breaches automatically."
      ] },
      { id: "step11_data_bars_scales", title: "Data Bars, Color Scales, Icon Sets", level: "Advanced", summary: "In-cell visualisations at scale.", keywords: ["data bars","color scales","icon sets"], lessonImages: chp(3, 3, 4, 1), practiceFile: "Lessons/Level_3_Session_3_Chp_4_Data_Bars_Color_Scales_Icon_Sets_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Choose the right in-cell signal for the business question.",
        "Apply data bars for magnitude, color scales for deviation, icon sets for status.",
        "Combine multiple rules without creating visual noise."
      ] },
      { id: "step11_dashboard_design", title: "Dashboard Design Basics", level: "Advanced", summary: "Layout and design principles for dashboards.", keywords: ["dashboard design","layout","kpi"], lessonImages: chp(3, 3, 5, 3), practiceFile: "Lessons/Level_3_Session_3_Chp_5_Basic_Dashboard_Design_Layouts_Practice_Solutions.xlsx", solutionFile: null, pageExplanations: [
        "Plan a dashboard layout before placing a single chart.",
        "Design KPI cards, chart placement and filter controls for clarity.",
        "Apply design rules (contrast, alignment, whitespace) so the dashboard tells a story."
      ] }
    ]
  },
  {
    step: 12,
    code: "12",
    section: "Power Query Basics",
    subtitle: "Import & Transform Data",
    description: "Get data from anywhere and clean it with Power Query.",
    level: "Advanced",
    lessonImage: "Lessons/Step 12 - Syllabus-Roadmap.png",
    stepLessonId: null,
    realWorldExample: "Import and reshape a messy export automatically.",
    objectives: [
      "Get data from many sources",
      "Clean and transform columns",
      "Append and load queries"
    ],
    topics: [
      { id: "step12_get_data", title: "Get Data (Import)", level: "Advanced", summary: "Connect to files, folders and databases.", keywords: ["get data","import","power query source"], lessonImages: chp(3,4,1,3), lessonImage: null, practiceFile: "Lessons/Level_3_Session_4_Ch1_Ch2_Power_Query_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step12_clean_transform", title: "Clean & Transform Data", level: "Advanced", summary: "Shape data with Power Query steps.", keywords: ["transform","clean","reshape"], lessonImages: chp(3,4,2,2), lessonImage: null, practiceFile: "Lessons/Level_3_Session_4_Chp_1_to_5_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step12_split_merge_pivot", title: "Split, Merge, Pivot", level: "Advanced", summary: "Split columns, merge and pivot data.", keywords: ["split column","merge","pivot"], lessonImages: chp(3,4,3,1), lessonImage: null, practiceFile: "Lessons/Level_3_Session_4_Chp_3_Split_Merge_Pivot_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step12_append_queries", title: "Append Queries", level: "Advanced", summary: "Stack queries into one table.", keywords: ["append","combine queries"], lessonImages: chp(3,4,4,3), lessonImage: null, practiceFile: "Lessons/Level_3_Session_4_Chp_4_Append_Queries_Practice_Solutions.xlsx", solutionFile: null },
      { id: "step12_load_to", title: "Load to Table / Pivot", level: "Advanced", summary: "Load results to a table or Pivot.", keywords: ["load to","connection only","pivot"], lessonImages: chp(3,4,5,4), lessonImage: null, practiceFile: "Lessons/Level_3_Session_4_Chp_5_Load_to_Table_Pivot_Practice_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 13,
    code: "13",
    section: "Power Query Advanced",
    subtitle: "Automate Data Prep End To End",
    description: "Advanced Power Query transformations, parameters and refresh automation.",
    level: "Advanced",
    lessonImage: "Lessons/Step 13 - Syllabus-Roadmap.png",
    stepLessonId: "step13_power_query_advanced",
    realWorldExample: "Build a reusable, parameterised import.",
    objectives: [
      "Apply advanced transformations",
      "Use custom columns and parameters",
      "Automate refresh"
    ],
    topics: [
      { id: "step13_advanced_transform", title: "Advanced Transformations", level: "Advanced", summary: "Advanced column and row transformations.", keywords: ["advanced transform","unpivot","group by"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step13_custom_columns", title: "Custom Columns", level: "Advanced", summary: "Add columns with M formulas.", keywords: ["custom column","m formula","add column"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step13_merge_vs_append", title: "Merge vs Append", level: "Advanced", summary: "When to merge and when to append queries.", keywords: ["merge","append","join"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step13_parameters", title: "Parameters", level: "Advanced", summary: "Drive queries with parameters.", keywords: ["parameter","dynamic source"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step13_refresh_automation", title: "Refresh Automation", level: "Advanced", summary: "Automate refresh across queries.", keywords: ["refresh","automation","scheduled"], lessonImage: null, practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 14,
    code: "14",
    section: "Power Pivot & DAX",
    subtitle: "Model Data & Write Measures",
    description: "Build a data model and write basic DAX measures.",
    level: "Advanced",
    lessonImage: "Lessons/Step 14 - Syllabus-Roadmap.png",
    stepLessonId: "step14_power_pivot_dax",
    realWorldExample: "Model sales and write a YTD measure.",
    objectives: [
      "Understand the data model",
      "Build relationships and measures",
      "Write basic DAX"
    ],
    topics: [
      { id: "step14_data_model", title: "Data Model Concepts", level: "Advanced", summary: "Tables, relationships and the model.", keywords: ["data model","star schema","relationships"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step14_relationships", title: "Relationships", level: "Advanced", summary: "Connect tables with relationships.", keywords: ["relationship","foreign key","cardinality"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step14_measures_vs_cols", title: "Measures vs Calculated Columns", level: "Advanced", summary: "Choose measures or calculated columns.", keywords: ["measure","calculated column","difference"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step14_basic_dax", title: "Basic DAX (SUM, COUNT, CALCULATE, FILTER)", level: "Advanced", summary: "Core DAX functions for measures.", keywords: ["dax","sum","count","calculate","filter"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step14_time_intelligence", title: "Time Intelligence (YTD, MTD, etc.)", level: "Advanced", summary: "Period calculations with DAX.", keywords: ["time intelligence","ytd","mtd","dates"], lessonImage: null, practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 15,
    code: "15",
    section: "Dashboarding",
    subtitle: "Build Interactive Dashboards",
    description: "Design professional, interactive dashboards.",
    level: "Advanced",
    lessonImage: "Lessons/Step 15 - Syllabus-Roadmap.png",
    stepLessonId: "step15_dashboarding",
    realWorldExample: "Build a KPI dashboard with slicers.",
    objectives: [
      "Plan dashboard layout",
      "Add KPI cards and dynamic titles",
      "Make dashboards interactive"
    ],
    topics: [
      { id: "step15_dashboard_layout", title: "Dashboard Layout", level: "Advanced", summary: "Plan and structure a dashboard.", keywords: ["layout","grid","structure"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step15_kpi_cards", title: "KPI Cards", level: "Advanced", summary: "Build clear KPI cards.", keywords: ["kpi","card","metric"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step15_dynamic_titles", title: "Dynamic Titles", level: "Advanced", summary: "Titles that update with selections.", keywords: ["dynamic title","interactive title"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step15_interactive_dashboards", title: "Interactive Dashboards", level: "Advanced", summary: "Connect controls to visuals.", keywords: ["interactive","dashboard","controls"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step15_slicers_timelines_dd", title: "Slicers, Timelines, Dropdowns", level: "Advanced", summary: "Interactive filters for dashboards.", keywords: ["slicer","timeline","dropdown"], lessonImage: null, practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 16,
    code: "16",
    section: "Automation & VBA (Basics)",
    subtitle: "Automate Repetitive Work",
    description: "Record, edit and write basic macros with VBA.",
    level: "Advanced",
    lessonImage: "Lessons/Step 16 - Syllabus-Roadmap.png",
    stepLessonId: "step16_automation_vba",
    realWorldExample: "Automate a monthly report with a macro.",
    objectives: [
      "Record and edit macros",
      "Learn VBA basics",
      "Automate repetitive tasks"
    ],
    topics: [
      { id: "step16_macro_recorder", title: "Excel Macro Recorder", level: "Advanced", summary: "Record actions into a macro.", keywords: ["macro recorder","record"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step16_edit_macros", title: "Edit Macros", level: "Advanced", summary: "Tweak recorded macros in the editor.", keywords: ["edit macro","vbe","editor"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step16_vba_basics", title: "VBA Basics (Variables, Loops, If)", level: "Advanced", summary: "Core VBA: variables, loops and conditions.", keywords: ["vba","variables","loops","if"], lessonImage: null, practiceFile: null, solutionFile: null },
      { id: "step16_automate_repetitive", title: "Automate Repetitive Tasks", level: "Advanced", summary: "Turn recurring work into a macro.", keywords: ["automate","repetitive","macro"], lessonImage: null, practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 17,
    code: "17",
    section: "AI-POWERED BUSINESS PROBLEM SOLVING",
    subtitle: "Turn a business problem into an AI-assisted analysis plan",
    description: "Use AI to understand a business problem and convert it into an actionable analysis plan.",
    level: "AI-Powered Professional",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Frame a profitability-decline problem into solvable analysis questions.",
    objectives: [
      "Understand requirements and business questions",
      "Identify KPIs and data requirements",
      "Use AI-assisted problem framing and root-cause thinking",
      "Plan the analysis with what-if thinking and assumptions"
    ],
    topics: [
      { id: "step17_ai_problem_solving", title: "AI-POWERED BUSINESS PROBLEM SOLVING", level: "AI-Powered Professional", summary: "Use AI to understand a business problem and turn it into an actionable analysis plan.", keywords: ["ai","business problem","problem solving","requirements","kpi","root cause","what-if","assumptions","analysis planning"], lessonImages: chp(5,1,1,2), practiceFile: "Lessons/Level_5_Session_1_Chp_1_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 18,
    code: "18",
    section: "AI-POWERED DATA & ANALYTICS",
    subtitle: "Raw data to reliable business insight",
    description: "Use AI together with Excel, SQL and analytical skills to turn raw data into reliable business insights.",
    level: "AI-Powered Professional",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Clean, validate and analyze a messy business dataset with AI assistance.",
    objectives: [
      "Understand, clean and validate data",
      "Excel and SQL analysis with AI assistance",
      "Segmentation, trends, forecasting and variance analysis",
      "AI anomaly detection and formula/query generation"
    ],
    topics: [
      { id: "step18_ai_data_analytics", title: "AI-POWERED DATA & ANALYTICS", level: "AI-Powered Professional", summary: "Use AI with Excel, SQL and analytics skills to turn raw data into reliable business insight.", keywords: ["ai","data analytics","data cleaning","data validation","excel analysis","sql analysis","segmentation","trend","forecasting","variance","anomaly detection"], lessonImages: chp(5,1,2,2), practiceFile: "Lessons/Level_5_Session_1_Chp_2_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 19,
    code: "19",
    section: "AI-POWERED DASHBOARD & STORYTELLING",
    subtitle: "From analysis to decision-ready story",
    description: "Transform analysis into a decision-ready business story with dashboards and executive communication.",
    level: "AI-Powered Professional",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Build an executive dashboard that tells a clear, decision-ready story.",
    objectives: [
      "Select KPIs and plan dashboards",
      "Excel and Power BI dashboard design",
      "AI insight generation and data storytelling",
      "Executive summary and action recommendations"
    ],
    topics: [
      { id: "step19_ai_dashboard_story", title: "AI-POWERED DASHBOARD & STORYTELLING", level: "AI-Powered Professional", summary: "Transform analysis into a decision-ready business story with dashboards and executive communication.", keywords: ["ai","dashboard","storytelling","kpi","power bi","visualization","executive","insight","recommendation","presentation"], lessonImages: chp(5,1,3,2), practiceFile: "Lessons/Level_5_Session_1_Chp_3_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 20,
    code: "20",
    section: "AI-POWERED AUTOMATION & PRODUCTIVITY",
    subtitle: "Reduce repetitive analytical and reporting work",
    description: "Reduce repetitive analytical and reporting work using AI and automation.",
    level: "AI-Powered Professional",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Automate a recurring management report with human review.",
    objectives: [
      "Excel automation and Power BI reporting",
      "SQL workflows and recurring reports",
      "AI workflows, agents and automated summaries",
      "Workflow design with human review and documentation"
    ],
    topics: [
      { id: "step20_ai_automation", title: "AI-POWERED AUTOMATION & PRODUCTIVITY", level: "AI-Powered Professional", summary: "Reduce repetitive analytical and reporting work using AI and automation.", keywords: ["ai","automation","productivity","excel automation","power bi reporting","sql workflow","recurring report","ai agent","workflow","documentation"], lessonImages: chp(5,1,4,1), practiceFile: null, solutionFile: null }
    ]
  },
  {
    step: 24,
    code: "24",
    section: "AI BUSINESS SOLUTION — MASTER CAPSTONE",
    subtitle: "The final graduation project",
    description: "Independently solve a realistic business problem using Levels 1-4 skills plus AI.",
    level: "AI-Powered Professional",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Diagnose declining profitability and deliver an AI-powered executive solution.",
    objectives: [
      "Work end-to-end: problem to executive presentation",
      "Integrate Excel, SQL, Power BI, analytics, automation and AI",
      "Build root-cause, forecast and dashboard analysis",
      "Deliver insights, recommendations and automation"
    ],
    topics: [
      { id: "step24_ai_capstone", title: "AI BUSINESS SOLUTION — MASTER CAPSTONE", level: "AI-Powered Professional", summary: "The graduation project: solve a realistic business problem using all learned skills plus AI.", keywords: ["ai","capstone","master","graduation","business solution","executive presentation","end-to-end"], lessonImages: chp(5,1,5,1), practiceFile: "Lessons/Level_5_Session_1_Chp_5_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 21,
    code: "21",
    section: "Intermediate Formulas",
    subtitle: "Conditional & Multi-Criteria Logic",
    description: "Build decision logic and multi-criteria calculations.",
    level: "Intermediate",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Score records against multiple criteria.",
    objectives: [
      "Use SUMIF/COUNTIF family",
      "Nest IF and logical functions",
      "Apply conditional math"
    ],
    topics: [
      { id: "step21_sumif", title: "IF, SUMIF, COUNTIF", level: "Intermediate", summary: "Single-criterion logical tests, sums and counts.", keywords: ["if","sumif","countif","criteria","single criterion"], lessonImage: null, lessonImages: chp(2, 1, 1, 1), practiceFile: "Lessons/Level_1_Session_2_Chp_1.1_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step21_sumifs", title: "SUMIFS, COUNTIFS", level: "Intermediate", summary: "Multi-criteria sums and counts.", keywords: ["sumifs","countifs","multiple criteria"], lessonImage: null, lessonImages: chp(2, 1, 2, 2), practiceFile: "Lessons/Level_2_Session_1_Chp_2_Practice_&_Solutions.xlsx", solutionFile: null, pageExplanations: [
    `<div class="exp-h">SUMIFS — Sum With Multiple Conditions</div><div class="exp-b">SUMIFS answers: <b>"How much total meets MULTIPLE conditions?"</b></div><div class="exp-flow">SUM &rarr; add everything &nbsp;·&nbsp; SUMIF &rarr; add when ONE condition is true &nbsp;·&nbsp; <b>SUMIFS &rarr; add when MULTIPLE conditions are true</b></div><div class="exp-ex"><div class="exp-q">Sales: Pen | North | ₹1,200 · Pen | South | ₹800 · Notebook | North | ₹2,000 · Pen | North | ₹1,500<br>Total <b>Pen</b> sales in <b>North</b>?</div><div class="exp-f">=SUMIFS(C2:C5, A2:A5, "Pen", B2:B5, "North") &rarr; <b>₹2,700</b></div><div class="exp-n">Sum range <code>C2:C5</code> · Condition 1 Product = Pen · Condition 2 Region = North &mdash; <b>ALL conditions must be satisfied.</b></div></div>`,
    `<div class="exp-h">COUNTIFS — Count With Multiple Conditions</div><div class="exp-b">COUNTIFS answers: <b>"How many records meet MULTIPLE conditions?"</b></div><div class="exp-flow">COUNT &rarr; count numbers &nbsp;·&nbsp; COUNTIF &rarr; count when ONE condition is true &nbsp;·&nbsp; <b>COUNTIFS &rarr; count when MULTIPLE conditions are true</b></div><div class="exp-ex"><div class="exp-q">Pen | North | Completed · Pen | South | Completed · Notebook | North | Completed · Pen | North | Cancelled<br>How many <b>Pen</b> orders in <b>North</b> are <b>Completed</b>?</div><div class="exp-f">=COUNTIFS(A2:A5, "Pen", B2:B5, "North", C2:C5, "Completed") &rarr; <b>1</b></div><div class="exp-n">Product = Pen <b>AND</b> Region = North <b>AND</b> Status = Completed &mdash; only rows satisfying ALL conditions are counted.</div></div>`
  ] },
      { id: "step21_averageif", title: "AVERAGEIF, AVERAGEIFS", level: "Intermediate", summary: "Conditional averages.", keywords: ["averageif","averageifs"], lessonImage: null, lessonImages: SESSION2_CHAPTERS[3], practiceFile: null, solutionFile: null, practicePending: true, practicePendingNote: "Practice workbook for AVERAGEIF / AVERAGEIFS will be added to this topic.", pageExplanations: [
    `<div class="exp-h">AVERAGEIF &amp; AVERAGEIFS — Conditional Averages</div><div class="exp-b">AVERAGEIF finds the average when <b>ONE</b> condition is true; AVERAGEIFS when <b>MULTIPLE</b> conditions are true.</div><div class="exp-ex"><div class="exp-q">Product | Region | Sales<br>Pen | North | 1000 · Pen | South | 800 · Notebook | North | 2000 · Pen | North | 1500<br>Average <b>Pen</b> sales?</div><div class="exp-f">=AVERAGEIF(A2:A5, "Pen", C2:C5) &rarr; <b>1100</b></div><div class="exp-n">Average range <code>C2:C5</code> · Condition Product = Pen.</div></div><div class="exp-ex"><div class="exp-q">Average <b>Pen</b> sales in <b>North</b>?</div><div class="exp-f">=AVERAGEIFS(C2:C5, A2:A5, "Pen", B2:B5, "North")</div><div class="exp-n"><b>AVERAGEIF = ONE condition</b> &nbsp;·&nbsp; <b>AVERAGEIFS = MULTIPLE conditions</b>.</div></div>`
  ] },
      { id: "step21_nested_if", title: "Nested IF", level: "Intermediate", summary: "Layered conditional logic.", keywords: ["nested if","if","condition"], lessonImage: null, lessonImages: SESSION2_CHAPTERS[4], practiceFile: "Lessons/Level_2_Session_1_Chp_4_Practice_&_Solutions.xlsx", solutionFile: null, pageExplanations: [
    `<div class="exp-h">Nested IF — Layered Conditional Logic</div><div class="exp-b">A Nested IF checks multiple conditions <b>in sequence</b>, from the outermost (left) to the innermost.</div><div class="exp-flow">Condition 1? &rarr; YES: result &nbsp;·&nbsp; NO &darr; Condition 2? &rarr; YES: result &nbsp;·&nbsp; NO &darr; &hellip; &rarr; otherwise: final result</div><div class="exp-n">The <b>first TRUE</b> condition determines the result. Order matters.</div>`,
    `<div class="exp-h">Nested IF — Real-World Classification</div><div class="exp-b">Nested IF converts a business value into a category. Three examples:</div><div class="exp-ex"><div class="exp-q">INVENTORY &mdash; Stock levels</div><div class="exp-f">=IF(B2&gt;=100,"Overstock", IF(B2&gt;=50,"Healthy", IF(B2&gt;=20,"Low Stock","Critical")))</div></div><div class="exp-ex"><div class="exp-q">INVOICE &mdash; Days overdue</div><div class="exp-f">=IF(B2=0,"Paid", IF(B2&lt;=7,"Due Soon", IF(B2&lt;=30,"Overdue","Critical")))</div></div><div class="exp-ex"><div class="exp-q">CREDIT RISK &mdash; Score</div><div class="exp-f">=IF(B2&gt;=80,"Low Risk", IF(B2&gt;=60,"Medium Risk", IF(B2&gt;=40,"High Risk","Critical Risk")))</div></div></div>`
  ] },
      { id: "step21_logical_ops", title: "Logical Operators (AND, OR, NOT)", level: "Intermediate", summary: "Combine conditions with AND, OR and NOT logic.", keywords: ["and","or","not","logical","logical operators"], lessonImage: null, lessonImages: chp(2, 1, 5, 1), practiceFile: "Lessons/Level_2_Session_1_Chp_5_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  },
  {
    step: 22,
    code: "22",
    section: "Text Functions",
    subtitle: "Clean & Combine Text",
    description: "Extract, reshape and join text with Excel functions.",
    level: "Intermediate",
    lessonImage: null,
    stepLessonId: null,
    realWorldExample: "Tidy a messy exported name column.",
    objectives: [
      "Use LEFT, RIGHT and MID to extract text",
      "Measure and locate with LEN, FIND and SEARCH",
      "Standardise case with UPPER, LOWER and PROPER",
      "Clean with TRIM and CLEAN, and combine with CONCAT and TEXTJOIN"
    ],
    topics: [
      { id: "step22_left_right_mid", title: "LEFT, RIGHT, MID", level: "Intermediate", summary: "Extract parts of text.", keywords: ["left","right","mid","extract text"], lessonImages: chp(2, 2, 1, 1), practiceFile: "Lessons/Level_2_Session_2_Chp_1_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step22_len_find_search", title: "LEN, FIND, SEARCH", level: "Intermediate", summary: "Measure and locate text.", keywords: ["len","find","search","text length"], lessonImages: chp(2, 2, 2, 1), practiceFile: "Lessons/Level_2_Session_2_Chp_2_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step22_case",            title: "UPPER, LOWER, PROPER", level: "Intermediate", summary: "Change text case.", keywords: ["upper","lower","proper","case"], lessonImages: chp(2, 2, 3, 1), practiceFile: "Lessons/Level_2_Session_2_Chp_3_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step22_trim_clean",      title: "TRIM, CLEAN", level: "Intermediate", summary: "Remove extra spaces and non-printing characters.", keywords: ["trim","clean","clean text"], lessonImages: chp(2, 2, 4, 1), practiceFile: "Lessons/Level_2_Session_2_Chp_4_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step22_concat_textjoin", title: "CONCAT & TEXTJOIN", level: "Intermediate", summary: "Combine text strings.", keywords: ["concat","textjoin","combine text"], lessonImages: chp(2, 2, 5, 1), practiceFile: "Lessons/Level_2_Session_2_Chp_5_Practice_&_Solutions.xlsx", solutionFile: null }
    ],
    /* Mixed real-world challenge (combined 1-5 workbook) — NOT attached to a single chapter. */
    challengeFile: "Lessons/Level_2_Session_2_Chp_1_to_5_Practice_&_Solutions.xlsx",
    challengeTitle: "Text Functions — Mixed Real-World Challenge",
    challengeSheet: "Capstone"
  },
  {
    step: 23,
    code: "23",
    section: "Basic Visuals",
    subtitle: "Communicate With Simple Charts",
    description: "Turn numbers into clear charts that communicate at a glance.",
    level: "Beginner",
    lessonImage: "Lessons/Step 23 - Syllabus-Roadmap.png",
    stepLessonId: "step23_basic_visuals",
    realWorldExample: "Build a monthly sales chart.",
    objectives: [
      "Create a chart from your data",
      "Choose the right chart type",
      "Edit and refine charts",
      "Add titles, labels and formatting"
    ],
    topics: [
      { id: "step23_create_charts", title: "Create Charts", level: "Beginner", summary: "Insert a chart from your data.", keywords: ["create chart","insert chart","chart wizard"], lessonImages: chp(1, 4, 1, 1), practiceFile: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step23_chart_types", title: "Chart Types", level: "Beginner", summary: "Pick the right chart type for the message.", keywords: ["chart types","column","bar","line","pie"], lessonImages: chp(1, 4, 2, 1), practiceFile: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step23_edit_charts", title: "Edit Charts", level: "Beginner", summary: "Change data, layout and style of a chart.", keywords: ["edit chart","chart data","chart layout"], lessonImages: chp(1, 4, 3, 1), practiceFile: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step23_titles_labels", title: "Add Titles, Labels", level: "Beginner", summary: "Add chart titles, axis labels and data labels.", keywords: ["chart title","axis labels","data labels"], lessonImages: chp(1, 4, 4, 1), practiceFile: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx", solutionFile: null },
      { id: "step23_format_charts", title: "Format Charts", level: "Beginner", summary: "Style charts with colors, fonts and effects.", keywords: ["format chart","chart style","colors"], lessonImages: chp(1, 4, 5, 1), practiceFile: "Lessons/Level_1_Session_4_Chp_1_to_5_Practice_&_Solutions.xlsx", solutionFile: null }
    ]
  }
  ]


  /* ==========================================================================
     CURRICULUM LEVELS  (Beginner → Expert)
     ========================================================================== */
  const LEVELS = [
    { id: "level-1", num: 1, name: "Beginner",        subtitle: "Excel Basics to Confidence",       color: "green",
      description: "Start from zero and build rock-solid everyday Excel confidence." },
    { id: "level-2", num: 2, name: "Intermediate",    subtitle: "Build Real-World Skills",          color: "blue",
      description: "Solve real problems with formulas, lookups and data tools." },
    { id: "level-3", num: 3, name: "Advanced",        subtitle: "Analyze Deeply & Build Reports",   color: "purple",
      description: "Analyze data, visualize insight and automate prep." },
    { id: "level-4", num: 4, name: "Advanced Pro",    subtitle: "Automate & Build Solutions",        color: "orange",
      description: "Model data and automate with Power tools and VBA." },
    { id: "level-5", num: 5, name: "AI-Powered Professional", subtitle: "Think Smarter • Analyze Deeper • Deliver Faster", color: "emerald",
      description: "The final professional layer — use AI plus every learned skill to solve real business problems." }
  ];

  /* ==========================================================================
     LEVEL → STEP MAP  (ordered, partition view — each level is a subset)
     label = friendly module name shown in the sidebar level curriculum.
     ========================================================================== */
  const LEVEL_STEP_MAP = {
    "level-1": [1, {step:2, label:"Basic Formulas"}, {step:8, label:"Working With Data"}, {step:23, label:"Basic Visuals"}],   /* Beginner: Excel Basics, Basic Formulas, Working With Data, Basic Visuals */
    "level-2": [{step:21, label:"Intermediate Formulas"}, {step:22, label:"Text Functions"}, {step:3, label:"Lookup Functions"}, {step:4, label:"Data Analysis Basics"}],   /* Intermediate */
    "level-3": [{step:9, label:"Advanced Formulas"}, {step:10, label:"Data Analysis"}, {step:11, label:"Data Visualization"}, {step:12, label:"Power Query Basics"}],   /* Advanced: 4 attached modules */
    "level-4": [{step:13, label:"Power Query Advanced"}, {step:14, label:"Power Pivot & DAX"}, {step:15, label:"Dashboarding"}, {step:16, label:"Automation & VBA (Basics)"}],   /* Advanced Pro: 4 attached modules */
    "level-5": [{step:17, label:"AI-POWERED BUSINESS PROBLEM SOLVING"}, {step:18, label:"AI-POWERED DATA & ANALYTICS"}, {step:19, label:"AI-POWERED DASHBOARD & STORYTELLING"}, {step:20, label:"AI-POWERED AUTOMATION & PRODUCTIVITY"}, {step:24, label:"AI BUSINESS SOLUTION — MASTER CAPSTONE"}]   /* AI-Powered Professional: 5 modules */
  };

  /* ==========================================================================
     EXCEL REFERENCE  (ribbon + advanced features, informational)
     ========================================================================== */
  const EXCEL_REFERENCE = [
    { group: "Home", topics: [
      { id: "ref_home_clipboard", title: "Clipboard", keywords: ["copy","cut","paste","format painter"] },
      { id: "ref_home_font", title: "Font", keywords: ["bold","italic","font size","fill color"] },
      { id: "ref_home_align", title: "Alignment", keywords: ["align","wrap text","merge"] },
      { id: "ref_home_number", title: "Number", keywords: ["number format","currency","percent"] }
    ]},
    { group: "Insert", topics: [
      { id: "ref_insert_tables", title: "Tables", keywords: ["table","pivot"] },
      { id: "ref_insert_charts", title: "Charts", keywords: ["chart","graph"] },
      { id: "ref_insert_illustrations", title: "Illustrations", keywords: ["picture","shape"] },
      { id: "ref_insert_links", title: "Links", keywords: ["hyperlink","link"] }
    ]},
    { group: "Page Layout", topics: [
      { id: "ref_pl_themes", title: "Themes", keywords: ["theme","colors"] },
      { id: "ref_pl_page", title: "Page Setup", keywords: ["margins","orientation"] },
      { id: "ref_pl_scale", title: "Scale to Fit", keywords: ["fit","scale"] },
      { id: "ref_pl_sheet", title: "Sheet Options", keywords: ["gridlines","headings"] }
    ]},
    { group: "Formulas", topics: [
      { id: "ref_fx_library", title: "Function Library", keywords: ["function","fx"] },
      { id: "ref_fx_defined", title: "Defined Names", keywords: ["name","range"] },
      { id: "ref_fx_audit", title: "Formula Auditing", keywords: ["trace","error"] },
      { id: "ref_fx_calc", title: "Calculation", keywords: ["calc","manual"] }
    ]},
    { group: "Data", topics: [
      { id: "ref_data_get", title: "Get & Transform", keywords: ["power query","get data"] },
      { id: "ref_data_sort", title: "Sort & Filter", keywords: ["sort","filter"] },
      { id: "ref_data_tools", title: "Data Tools", keywords: ["text to columns","flash fill"] },
      { id: "ref_data_whatif", title: "What-If", keywords: ["goal seek","scenario"] }
    ]},
    { group: "Review", topics: [
      { id: "ref_rv_proof", title: "Proofing", keywords: ["spelling","thesaurus"] },
      { id: "ref_rv_notes", title: "Comments", keywords: ["comment","note"] },
      { id: "ref_rv_protect", title: "Protect", keywords: ["protect sheet","lock"] },
      { id: "ref_rv_share", title: "Share", keywords: ["share","co-author"] }
    ]},
    { group: "View", topics: [
      { id: "ref_v_freeze", title: "Freeze Panes", keywords: ["freeze","split"] },
      { id: "ref_v_show", title: "Show", keywords: ["gridlines","formula bar"] },
      { id: "ref_v_zoom", title: "Zoom", keywords: ["zoom","100%"] },
      { id: "ref_v_window", title: "Window", keywords: ["new window","arrange"] }
    ]},
    { group: "Developer", topics: [
      { id: "ref_dev_code", title: "Code (VBA)", keywords: ["vba","editor"] },
      { id: "ref_dev_controls", title: "Controls", keywords: ["button","checkbox"] },
      { id: "ref_dev_xml", title: "XML", keywords: ["xml","schema"] },
      { id: "ref_dev_addins", title: "Add-ins", keywords: ["add-in","com"] }
    ]},
    { group: "Power Query", topics: [
      { id: "ref_pq_get", title: "Get Data", keywords: ["import","source"] },
      { id: "ref_pq_transform", title: "Transform", keywords: ["clean","shape"] },
      { id: "ref_pq_combine", title: "Combine", keywords: ["merge","append"] },
      { id: "ref_pq_refresh", title: "Refresh", keywords: ["refresh","load"] }
    ]},
    { group: "Power Pivot & DAX", topics: [
      { id: "ref_pp_model", title: "Data Model", keywords: ["model","relationship"] },
      { id: "ref_pp_measures", title: "Measures (DAX)", keywords: ["dax","measure","calculate","calculate column"] },
      { id: "ref_pp_kpi", title: "KPIs", keywords: ["kpi","target"] },
      { id: "ref_pp_diagram", title: "Diagram View", keywords: ["diagram","view"] }
    ]},
    { group: "VBA", topics: [
      { id: "ref_vba_editor", title: "VBA Editor", keywords: ["editor","vbe"] },
      { id: "ref_vba_modules", title: "Modules", keywords: ["module","code"] },
      { id: "ref_vba_procedures", title: "Procedures & Functions", keywords: ["sub","function"] },
      { id: "ref_vba_events", title: "Events", keywords: ["event","worksheet"] }
    ]},
    { group: "Corporate Projects", topics: [
      { id: "ref_cp_reports", title: "Monthly Reports", keywords: ["report","monthly"] },
      { id: "ref_cp_dash", title: "Executive Dashboards", keywords: ["dashboard","exec"] },
      { id: "ref_cp_models", title: "Financial Models", keywords: ["finance","model"] },
      { id: "ref_cp_trackers", title: "Trackers", keywords: ["tracker","log"] }
    ]},
    { group: "Excel Shortcuts", topics: [
      { id: "ref_sc_nav", title: "Navigation Shortcuts", keywords: ["ctrl","arrow"] },
      { id: "ref_sc_edit", title: "Editing Shortcuts", keywords: ["f2","ctrl c"] },
      { id: "ref_sc_format", title: "Formatting Shortcuts", keywords: ["ctrl b","alt"] },
      { id: "ref_sc_select", title: "Selection Shortcuts", keywords: ["ctrl a","shift"] }
    ]},
    { group: "Tips & Best Practices", topics: [
      { id: "ref_tip_clean", title: "Clean Data Habits", keywords: ["clean","tidy"] },
      { id: "ref_tip_speed", title: "Speed Tips", keywords: ["speed","efficiency"] },
      { id: "ref_tip_errors", title: "Avoiding Errors", keywords: ["error","check"] },
      { id: "ref_tip_audit", title: "Audit & Review", keywords: ["audit","review"] }
    ]}
  ];
