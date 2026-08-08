/* ============================================================
   CareerPilot — data.js
   Central mock data + LocalStorage data layer.
   Every other script depends on this file, so load it first.
   ============================================================ */

/* ---------- LocalStorage keys (single source of truth) ---------- */
const STORAGE_KEYS = {
  users: "careerPilotUsers",
  currentUser: "careerPilotCurrentUser",
  jobs: "careerPilotJobs",
  savedJobs: "careerPilotSavedJobs",
  applications: "careerPilotApplications",
  interviews: "careerPilotInterviews",
  notifications: "careerPilotNotifications",
  resume: "careerPilotResume",
  settings: "careerPilotSettings",
  theme: "careerPilotTheme",
  seeded: "careerPilotSeeded"
};

/* ---------- Safe storage helpers (never crash on bad JSON) ---------- */
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (err) {
    console.warn("CareerPilot: corrupted data for " + key + ", resetting.", err);
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error("CareerPilot: could not save " + key, err);
    return false;
  }
}

/* ---------- Static option lists (reused by filters & forms) ---------- */
const JOB_CATEGORIES = [
  "Software Development",
  "Data Science",
  "Data Analytics",
  "UI/UX",
  "Marketing",
  "Finance",
  "Human Resources",
  "Cybersecurity"
];

const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract"];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const LOCATIONS = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Pune", "Delhi", "Kochi", "Remote"];
const APPLICATION_STATUSES = ["Applied", "Under Review", "Shortlisted", "Interview", "Rejected"];

/* ---------- 20 realistic mock job listings ---------- */
const JOBS_SEED = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Solutions",
    logo: "TN",
    location: "Chennai",
    mode: "Hybrid",
    category: "Software Development",
    type: "Full Time",
    experience: "0-2 years",
    salary: "₹5-8 LPA",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    posted: "2 days ago",
    about: "TechNova Solutions builds enterprise web platforms for logistics and retail clients across South India.",
    description: "We are looking for a Frontend Developer to craft responsive, accessible interfaces for our customer-facing dashboards. You will work closely with designers and backend engineers to ship features every sprint.",
    responsibilities: [
      "Translate Figma designs into pixel-accurate, responsive pages",
      "Build reusable component libraries in JavaScript",
      "Optimise page performance and Core Web Vitals",
      "Participate in code reviews and daily stand-ups"
    ],
    requirements: [
      "Strong fundamentals in HTML5, CSS3 and modern JavaScript",
      "Understanding of responsive and mobile-first design",
      "Familiarity with Git and browser developer tools",
      "B.E / B.Tech / B.Sc in Computer Science or related field"
    ],
    benefits: ["Health insurance", "Flexible hybrid schedule", "Annual learning budget", "Performance bonus"]
  },
  {
    id: 2,
    title: "Junior Data Scientist",
    company: "InsightEdge Analytics",
    logo: "IE",
    location: "Bangalore",
    mode: "On-site",
    category: "Data Science",
    type: "Full Time",
    experience: "0-2 years",
    salary: "₹7-11 LPA",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL", "Statistics"],
    posted: "4 days ago",
    about: "InsightEdge Analytics delivers predictive modelling services to fintech and healthcare organisations.",
    description: "Join our modelling team to turn messy operational data into forecasting models that guide client decisions. Ideal for a fresh graduate with strong statistics fundamentals.",
    responsibilities: [
      "Clean, explore and visualise large structured datasets",
      "Build and validate regression and classification models",
      "Present findings to non-technical stakeholders",
      "Document experiments and maintain reproducible notebooks"
    ],
    requirements: [
      "Proficiency in Python and the scientific stack",
      "Working knowledge of SQL joins and aggregations",
      "Understanding of hypothesis testing and model evaluation",
      "Degree in Data Science, Statistics or Computer Science"
    ],
    benefits: ["Relocation support", "Certification sponsorship", "Team offsites", "Group medical cover"]
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Meridian Retail Group",
    logo: "MR",
    location: "Hyderabad",
    mode: "On-site",
    category: "Data Analytics",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹6-9 LPA",
    skills: ["SQL", "Power BI", "Excel", "Python"],
    posted: "1 day ago",
    about: "Meridian Retail Group operates 180+ stores nationwide and runs a growing e-commerce arm.",
    description: "Own the reporting layer for our merchandising team: build dashboards, monitor category performance and surface insights that influence buying decisions.",
    responsibilities: [
      "Design and maintain Power BI dashboards for category managers",
      "Write optimised SQL queries against the sales warehouse",
      "Automate weekly and monthly reporting cycles",
      "Investigate anomalies in sales and inventory data"
    ],
    requirements: [
      "Hands-on SQL experience with large tables",
      "Experience building BI dashboards",
      "Strong Excel modelling skills",
      "Clear written and verbal communication"
    ],
    benefits: ["Store discount", "Provident fund", "Annual bonus", "Hybrid Fridays"]
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Pixelforge Studio",
    logo: "PF",
    location: "Pune",
    mode: "Hybrid",
    category: "UI/UX",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹5-9 LPA",
    skills: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
    posted: "6 days ago",
    about: "Pixelforge Studio is a product design consultancy working with early-stage SaaS founders.",
    description: "Shape end-to-end product experiences, from discovery workshops to polished high-fidelity screens and handoff-ready specifications.",
    responsibilities: [
      "Run user interviews and translate insights into flows",
      "Produce wireframes, prototypes and final UI screens",
      "Maintain and extend the studio design system",
      "Collaborate with developers during implementation"
    ],
    requirements: [
      "Portfolio showing shipped digital products",
      "Expert-level Figma skills",
      "Understanding of accessibility guidelines",
      "Ability to justify design decisions with reasoning"
    ],
    benefits: ["Design tool stipend", "Conference passes", "4-day onsite week", "Wellness allowance"]
  },
  {
    id: 5,
    title: "Backend Developer (Node.js)",
    company: "Arcadia Cloud Labs",
    logo: "AC",
    location: "Bangalore",
    mode: "Remote",
    category: "Software Development",
    type: "Full Time",
    experience: "2-4 years",
    salary: "₹10-16 LPA",
    skills: ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
    posted: "3 days ago",
    about: "Arcadia Cloud Labs builds developer infrastructure used by SaaS teams in 14 countries.",
    description: "Design and operate the APIs behind our provisioning platform, with a focus on reliability, observability and clean service boundaries.",
    responsibilities: [
      "Design REST endpoints and data models",
      "Write integration tests and improve CI pipelines",
      "Monitor production services and handle incidents",
      "Mentor interns on backend best practices"
    ],
    requirements: [
      "Solid Node.js and SQL experience",
      "Understanding of authentication and authorisation",
      "Comfortable with containers and cloud deployment",
      "Bias toward well-documented, testable code"
    ],
    benefits: ["Fully remote", "Home office budget", "Stock options", "Unlimited sick leave"]
  },
  {
    id: 6,
    title: "Cybersecurity Analyst",
    company: "SentinelKey Security",
    logo: "SK",
    location: "Mumbai",
    mode: "On-site",
    category: "Cybersecurity",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹8-12 LPA",
    skills: ["SIEM", "Network Security", "Incident Response", "Linux"],
    posted: "5 days ago",
    about: "SentinelKey Security runs a 24x7 managed security operations centre for BFSI clients.",
    description: "Monitor client environments, triage alerts and lead first-line response for security incidents across our SOC.",
    responsibilities: [
      "Triage SIEM alerts and escalate genuine threats",
      "Perform log analysis across network and endpoint sources",
      "Document incidents and contribute to post-mortems",
      "Tune detection rules to reduce false positives"
    ],
    requirements: [
      "Understanding of TCP/IP, DNS and common attack patterns",
      "Exposure to any SIEM platform",
      "Comfort with Linux command line",
      "Security certification (CEH / Security+) is a plus"
    ],
    benefits: ["Shift allowance", "Certification reimbursement", "Cab facility", "Medical insurance"]
  },
  {
    id: 7,
    title: "Machine Learning Intern",
    company: "Nexora AI",
    logo: "NX",
    location: "Remote",
    mode: "Remote",
    category: "Data Science",
    type: "Internship",
    experience: "Fresher",
    salary: "₹25,000 /month",
    skills: ["Python", "TensorFlow", "NLP", "Git"],
    posted: "Today",
    about: "Nexora AI develops document-understanding models for insurance and legal workflows.",
    description: "A six-month internship working alongside ML engineers on text extraction and classification pipelines. Strong performers receive full-time offers.",
    responsibilities: [
      "Prepare and annotate training datasets",
      "Run fine-tuning experiments and track metrics",
      "Build small evaluation dashboards",
      "Summarise weekly findings for the research team"
    ],
    requirements: [
      "Coursework or projects in machine learning",
      "Python proficiency and basic deep learning knowledge",
      "Curiosity and willingness to read papers",
      "Final-year student or recent graduate"
    ],
    benefits: ["Fully remote", "Mentorship", "Pre-placement offer", "Certificate of completion"]
  },
  {
    id: 8,
    title: "Digital Marketing Executive",
    company: "BrightWave Media",
    logo: "BW",
    location: "Delhi",
    mode: "On-site",
    category: "Marketing",
    type: "Full Time",
    experience: "0-2 years",
    salary: "₹3.5-6 LPA",
    skills: ["SEO", "Google Ads", "Content Writing", "Analytics"],
    posted: "1 week ago",
    about: "BrightWave Media is a performance marketing agency serving D2C brands.",
    description: "Plan and execute paid and organic campaigns for a portfolio of consumer brands, reporting on ROI every fortnight.",
    responsibilities: [
      "Run and optimise Google and Meta ad campaigns",
      "Publish SEO-optimised blog and landing page copy",
      "Track KPIs in Google Analytics and report to clients",
      "Coordinate with designers on creative assets"
    ],
    requirements: [
      "Understanding of digital marketing funnels",
      "Strong writing skills in English",
      "Basic spreadsheet and analytics ability",
      "Any graduate with a marketing interest"
    ],
    benefits: ["Performance incentives", "Certification support", "Young team culture", "Casual dress"]
  },
  {
    id: 9,
    title: "Financial Analyst",
    company: "Ledgerline Capital",
    logo: "LC",
    location: "Mumbai",
    mode: "On-site",
    category: "Finance",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹7-11 LPA",
    skills: ["Financial Modelling", "Excel", "Valuation", "SQL"],
    posted: "3 days ago",
    about: "Ledgerline Capital advises mid-market companies on fundraising and M&A transactions.",
    description: "Support deal teams with financial models, industry research and investor-ready presentations.",
    responsibilities: [
      "Build three-statement and DCF models",
      "Prepare pitch decks and information memorandums",
      "Conduct sector and comparable-company research",
      "Maintain deal trackers and data rooms"
    ],
    requirements: [
      "Advanced Excel and modelling skills",
      "Understanding of accounting fundamentals",
      "Attention to numerical detail",
      "B.Com / BBA / CFA Level 1 preferred"
    ],
    benefits: ["Deal bonus", "CFA sponsorship", "Health cover", "Gym membership"]
  },
  {
    id: 10,
    title: "HR Executive — Talent Acquisition",
    company: "Corevance Consulting",
    logo: "CV",
    location: "Chennai",
    mode: "On-site",
    category: "Human Resources",
    type: "Full Time",
    experience: "0-2 years",
    salary: "₹3-5 LPA",
    skills: ["Recruitment", "Communication", "MS Office", "Sourcing"],
    posted: "2 days ago",
    about: "Corevance Consulting provides staffing and HR advisory services to IT and manufacturing firms.",
    description: "Manage the end-to-end hiring cycle for technology roles, from sourcing candidates to coordinating offer rollouts.",
    responsibilities: [
      "Source candidates through job boards and referrals",
      "Screen profiles and conduct first-round calls",
      "Schedule interviews and maintain the ATS",
      "Support onboarding documentation"
    ],
    requirements: [
      "Excellent spoken and written communication",
      "Comfort with high-volume coordination",
      "MBA HR or any graduate with HR interest",
      "Organised and deadline-driven"
    ],
    benefits: ["Monthly incentives", "Paid leave", "Employee referral bonus", "Skill workshops"]
  },
  {
    id: 11,
    title: "Full Stack Developer",
    company: "Kavery Digital",
    logo: "KD",
    location: "Kochi",
    mode: "Hybrid",
    category: "Software Development",
    type: "Full Time",
    experience: "2-4 years",
    salary: "₹8-14 LPA",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    posted: "5 days ago",
    about: "Kavery Digital builds custom web platforms for education and healthcare organisations in Kerala.",
    description: "Work across the stack on client projects — from database schema to polished UI — in small, autonomous teams.",
    responsibilities: [
      "Develop features across frontend and backend",
      "Participate in client requirement discussions",
      "Write clean, maintainable and tested code",
      "Deploy and monitor applications"
    ],
    requirements: [
      "Experience with a JavaScript frontend framework",
      "Server-side JavaScript and database design skills",
      "Ability to work directly with clients",
      "Portfolio or GitHub profile"
    ],
    benefits: ["Hybrid working", "Annual appraisal", "Family insurance", "Festival bonus"]
  },
  {
    id: 12,
    title: "Business Intelligence Intern",
    company: "Vertex Logistics",
    logo: "VL",
    location: "Pune",
    mode: "On-site",
    category: "Data Analytics",
    type: "Internship",
    experience: "Fresher",
    salary: "₹18,000 /month",
    skills: ["Excel", "SQL", "Tableau", "Data Cleaning"],
    posted: "1 day ago",
    about: "Vertex Logistics moves freight across 400 routes and is modernising its analytics stack.",
    description: "Support the BI team in building operational dashboards that track fleet utilisation and delivery performance.",
    responsibilities: [
      "Clean and consolidate operational spreadsheets",
      "Assist in building Tableau dashboards",
      "Write basic SQL extracts",
      "Prepare weekly performance summaries"
    ],
    requirements: [
      "Final-year student in CS / Statistics / Commerce",
      "Comfort with Excel formulas and pivot tables",
      "Basic SQL knowledge",
      "Eye for detail"
    ],
    benefits: ["Stipend", "Mentoring", "Internship certificate", "Cafeteria access"]
  },
  {
    id: 13,
    title: "Product Designer",
    company: "Lumina Health",
    logo: "LH",
    location: "Bangalore",
    mode: "Hybrid",
    category: "UI/UX",
    type: "Full Time",
    experience: "3-5 years",
    salary: "₹14-20 LPA",
    skills: ["Figma", "User Research", "Interaction Design", "Accessibility"],
    posted: "1 week ago",
    about: "Lumina Health builds patient-facing digital care products used by 2 million people.",
    description: "Own the design of core patient journeys, balancing clinical accuracy with a calm, reassuring experience.",
    responsibilities: [
      "Lead discovery and usability testing sessions",
      "Design flows for complex, regulated workflows",
      "Champion accessibility across the product",
      "Partner with PMs on roadmap definition"
    ],
    requirements: [
      "3+ years designing consumer or health products",
      "Strong systems thinking and craft",
      "Experience with accessibility standards",
      "Confident stakeholder communication"
    ],
    benefits: ["ESOPs", "Mental health support", "Hybrid model", "Parental leave"]
  },
  {
    id: 14,
    title: "Python Developer",
    company: "Datastride Systems",
    logo: "DS",
    location: "Hyderabad",
    mode: "On-site",
    category: "Software Development",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹6-10 LPA",
    skills: ["Python", "Django", "REST APIs", "PostgreSQL"],
    posted: "4 days ago",
    about: "Datastride Systems builds data-processing platforms for telecom operators.",
    description: "Develop and maintain Python services that ingest and transform millions of records daily.",
    responsibilities: [
      "Build and maintain Django-based APIs",
      "Write efficient data-processing scripts",
      "Optimise slow database queries",
      "Contribute to architecture discussions"
    ],
    requirements: [
      "Strong Python fundamentals",
      "Experience with a web framework",
      "Relational database knowledge",
      "Understanding of version control workflows"
    ],
    benefits: ["Insurance", "Skill certification", "Flexible hours", "Annual retreat"]
  },
  {
    id: 15,
    title: "Content Marketing Associate",
    company: "Nordwind Labs",
    logo: "NL",
    location: "Remote",
    mode: "Remote",
    category: "Marketing",
    type: "Part Time",
    experience: "0-2 years",
    salary: "₹20,000 /month",
    skills: ["Content Writing", "SEO", "Research", "Editing"],
    posted: "2 days ago",
    about: "Nordwind Labs publishes technical content for developer-focused software companies.",
    description: "Write clear, well-researched technical articles and case studies for B2B software clients on a part-time schedule.",
    responsibilities: [
      "Research and draft long-form technical articles",
      "Optimise content for target keywords",
      "Incorporate editorial feedback quickly",
      "Maintain the content calendar"
    ],
    requirements: [
      "Excellent English writing ability",
      "Interest in technology topics",
      "Self-directed and deadline-reliable",
      "Writing samples required"
    ],
    benefits: ["Work from anywhere", "Flexible hours", "Per-article bonus", "Byline credit"]
  },
  {
    id: 16,
    title: "Cloud Support Engineer",
    company: "Stratosfy Technologies",
    logo: "ST",
    location: "Chennai",
    mode: "Hybrid",
    category: "Software Development",
    type: "Contract",
    experience: "1-3 years",
    salary: "₹7-10 LPA",
    skills: ["AWS", "Linux", "Networking", "Troubleshooting"],
    posted: "6 days ago",
    about: "Stratosfy Technologies manages cloud infrastructure for growing SaaS companies.",
    description: "A 12-month contract role supporting customer cloud environments, handling escalations and improving runbooks.",
    responsibilities: [
      "Resolve infrastructure tickets within SLA",
      "Diagnose networking and compute issues on AWS",
      "Automate repetitive operations tasks",
      "Improve internal documentation"
    ],
    requirements: [
      "Working knowledge of AWS core services",
      "Comfortable in a Linux shell",
      "Calm under production pressure",
      "Any cloud certification is a plus"
    ],
    benefits: ["Contract completion bonus", "Certification vouchers", "Hybrid schedule", "Overtime pay"]
  },
  {
    id: 17,
    title: "Quantitative Research Intern",
    company: "Aureus Quant",
    logo: "AQ",
    location: "Mumbai",
    mode: "On-site",
    category: "Finance",
    type: "Internship",
    experience: "Fresher",
    salary: "₹30,000 /month",
    skills: ["Python", "Statistics", "Probability", "Backtesting"],
    posted: "3 days ago",
    about: "Aureus Quant is a systematic trading firm operating in Indian equity and derivatives markets.",
    description: "Research and backtest signal ideas under the guidance of senior quantitative researchers.",
    responsibilities: [
      "Clean and align market time-series data",
      "Implement and evaluate trading signals",
      "Run statistical significance checks",
      "Present research in weekly reviews"
    ],
    requirements: [
      "Strong probability and statistics background",
      "Python and NumPy proficiency",
      "Analytical problem-solving mindset",
      "Final-year student in a quantitative discipline"
    ],
    benefits: ["High stipend", "Research mentorship", "Full-time conversion", "Lunch provided"]
  },
  {
    id: 18,
    title: "Security Operations Intern",
    company: "Cryptline Defence",
    logo: "CD",
    location: "Bangalore",
    mode: "On-site",
    category: "Cybersecurity",
    type: "Internship",
    experience: "Fresher",
    salary: "₹20,000 /month",
    skills: ["Networking", "Linux", "Python", "Vulnerability Scanning"],
    posted: "1 week ago",
    about: "Cryptline Defence provides penetration testing and compliance services to enterprises.",
    description: "Learn practical offensive and defensive security while assisting consultants on live engagements.",
    responsibilities: [
      "Run automated vulnerability scans",
      "Assist in drafting assessment reports",
      "Reproduce and verify reported findings",
      "Maintain the internal testing lab"
    ],
    requirements: [
      "Fundamentals of networking and operating systems",
      "Familiarity with common security tools",
      "Ethical mindset and confidentiality",
      "Pursuing a CS or IT degree"
    ],
    benefits: ["Lab access", "Certification discount", "Internship certificate", "Job referral"]
  },
  {
    id: 19,
    title: "Operations Analyst",
    company: "Harborline Exports",
    logo: "HE",
    location: "Kochi",
    mode: "On-site",
    category: "Data Analytics",
    type: "Full Time",
    experience: "0-2 years",
    salary: "₹4-6.5 LPA",
    skills: ["Excel", "SQL", "Process Improvement", "Reporting"],
    posted: "4 days ago",
    about: "Harborline Exports ships agricultural produce to 20 international markets.",
    description: "Analyse shipment, cost and vendor data to identify inefficiencies across the export pipeline.",
    responsibilities: [
      "Prepare daily operations dashboards",
      "Analyse shipment delays and cost overruns",
      "Coordinate with warehouse and logistics teams",
      "Recommend process improvements"
    ],
    requirements: [
      "Strong Excel skills and analytical thinking",
      "Basic SQL preferred",
      "Good coordination and follow-up ability",
      "Any graduate"
    ],
    benefits: ["Provident fund", "Annual bonus", "Subsidised meals", "Growth path to lead role"]
  },
  {
    id: 20,
    title: "Associate Data Engineer",
    company: "Orbitflow Data",
    logo: "OD",
    location: "Delhi",
    mode: "Hybrid",
    category: "Data Science",
    type: "Full Time",
    experience: "1-3 years",
    salary: "₹9-14 LPA",
    skills: ["Python", "SQL", "Airflow", "Spark", "ETL"],
    posted: "2 days ago",
    about: "Orbitflow Data builds and operates data platforms for media and e-commerce companies.",
    description: "Build reliable batch and streaming pipelines that feed analytics and machine learning workloads.",
    responsibilities: [
      "Develop ETL pipelines with Python and Airflow",
      "Model warehouse tables for analytics use cases",
      "Monitor pipeline reliability and data quality",
      "Collaborate with analysts on data requirements"
    ],
    requirements: [
      "Solid Python and SQL skills",
      "Exposure to any orchestration tool",
      "Understanding of data warehousing concepts",
      "Engineering or science degree"
    ],
    benefits: ["Hybrid working", "Learning stipend", "Health insurance", "Quarterly bonus"]
  }
];

/* ---------- Default demo account ---------- */
const DEMO_USER = {
  id: "user-demo",
  name: "Demo Student",
  email: "demo@careerpilot.com",
  password: "123456",
  interest: "Data Science",
  phone: "+91 98765 43210",
  location: "Chennai, India",
  bio: "Final-year B.Sc Computer Science with Data Science student passionate about analytics and product engineering.",
  avatar: "",
  linkedin: "",
  github: "",
  createdAt: new Date().toISOString()
};

/* ---------- Default settings ---------- */
const DEFAULT_SETTINGS = {
  jobAlerts: true,
  applicationUpdates: true,
  interviewReminders: true,
  profileVisibility: "public"
};

/* ============================================================
   Data access API — every page uses these helpers
   ============================================================ */
const DB = {
  /* ---- Users ---- */
  getUsers() {
    const users = readStore(STORAGE_KEYS.users, []);
    return Array.isArray(users) ? users : [];
  },
  saveUsers(users) {
    return writeStore(STORAGE_KEYS.users, users);
  },
  findUserByEmail(email) {
    const target = String(email || "").trim().toLowerCase();
    return DB.getUsers().find((u) => u.email.toLowerCase() === target) || null;
  },
  addUser(user) {
    const users = DB.getUsers();
    users.push(user);
    DB.saveUsers(users);
    return user;
  },
  updateUser(updated) {
    const users = DB.getUsers().map((u) => (u.id === updated.id ? Object.assign({}, u, updated) : u));
    DB.saveUsers(users);
    const current = DB.getCurrentUser();
    if (current && current.id === updated.id) DB.setCurrentUser(Object.assign({}, current, updated));
    return updated;
  },

  /* ---- Session ---- */
  getCurrentUser() {
    return readStore(STORAGE_KEYS.currentUser, null);
  },
  setCurrentUser(user) {
    const safe = Object.assign({}, user);
    delete safe.password; // never keep the password in the session object
    return writeStore(STORAGE_KEYS.currentUser, safe);
  },
  clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    sessionStorage.removeItem(STORAGE_KEYS.currentUser);
  },
  isLoggedIn() {
    return DB.getCurrentUser() !== null;
  },

  /* ---- Jobs ---- */
  getJobs() {
    const jobs = readStore(STORAGE_KEYS.jobs, []);
    return Array.isArray(jobs) && jobs.length ? jobs : JOBS_SEED;
  },
  getJobById(id) {
    return DB.getJobs().find((job) => String(job.id) === String(id)) || null;
  },

  /* ---- Saved jobs ---- */
  getSavedJobs() {
    const saved = readStore(STORAGE_KEYS.savedJobs, []);
    return Array.isArray(saved) ? saved : [];
  },
  saveSavedJobs(list) {
    return writeStore(STORAGE_KEYS.savedJobs, list);
  },

  /* ---- Applications ---- */
  getApplications() {
    const apps = readStore(STORAGE_KEYS.applications, []);
    return Array.isArray(apps) ? apps : [];
  },
  saveApplications(list) {
    return writeStore(STORAGE_KEYS.applications, list);
  },

  /* ---- Interviews ---- */
  getInterviews() {
    const list = readStore(STORAGE_KEYS.interviews, []);
    return Array.isArray(list) ? list : [];
  },
  saveInterviews(list) {
    return writeStore(STORAGE_KEYS.interviews, list);
  },

  /* ---- Notifications ---- */
  getNotifications() {
    const list = readStore(STORAGE_KEYS.notifications, []);
    return Array.isArray(list) ? list : [];
  },
  saveNotifications(list) {
    return writeStore(STORAGE_KEYS.notifications, list);
  },
  addNotification(notification) {
    const list = DB.getNotifications();
    list.unshift(
      Object.assign(
        { id: "ntf-" + Date.now(), read: false, date: new Date().toISOString(), icon: "fa-bell", type: "info" },
        notification
      )
    );
    DB.saveNotifications(list);
  },

  /* ---- Resume ---- */
  getResume() {
    return readStore(STORAGE_KEYS.resume, null);
  },
  saveResume(resume) {
    return writeStore(STORAGE_KEYS.resume, resume);
  },

  /* ---- Settings ---- */
  getSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, readStore(STORAGE_KEYS.settings, {}));
  },
  saveSettings(settings) {
    return writeStore(STORAGE_KEYS.settings, Object.assign({}, DB.getSettings(), settings));
  }
};

/* ============================================================
   initializeDemoData()
   Runs on every page load, but only fills in data that is
   missing — it never overwrites data created by the user.
   ============================================================ */
function initializeDemoData() {
  // Jobs catalogue
  if (!localStorage.getItem(STORAGE_KEYS.jobs)) {
    writeStore(STORAGE_KEYS.jobs, JOBS_SEED);
  }

  // Demo account
  const users = DB.getUsers();
  if (!users.some((u) => u.email.toLowerCase() === DEMO_USER.email)) {
    users.push(Object.assign({}, DEMO_USER));
    DB.saveUsers(users);
  }

  // Settings
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    writeStore(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }

  // Seed-once collections (applications, interviews, notifications) are
  // populated in later phases; the flag guarantees a single seeding pass.
  if (!localStorage.getItem(STORAGE_KEYS.seeded)) {
    if (!localStorage.getItem(STORAGE_KEYS.savedJobs)) writeStore(STORAGE_KEYS.savedJobs, []);
    if (!localStorage.getItem(STORAGE_KEYS.applications)) writeStore(STORAGE_KEYS.applications, []);
    if (!localStorage.getItem(STORAGE_KEYS.interviews)) writeStore(STORAGE_KEYS.interviews, []);
    if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
      writeStore(STORAGE_KEYS.notifications, [
        {
          id: "ntf-welcome",
          title: "Welcome to CareerPilot",
          message: "Complete your profile to get better job matches.",
          type: "info",
          icon: "fa-rocket",
          read: false,
          date: new Date().toISOString()
        }
      ]);
    }
    localStorage.setItem(STORAGE_KEYS.seeded, "true");
  }
}

// Initialise as soon as this script loads.
initializeDemoData();
