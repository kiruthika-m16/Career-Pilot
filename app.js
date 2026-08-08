/* ============================================================
   CareerPilot — app.js
   Renders the shared shell (sidebar + topbar), seeds rich demo
   records and exposes helpers used by every module page.
   Load order: data.js -> common.js -> app.js -> <page>.js
   ============================================================ */

/* ---------------- Navigation model ---------------- */
const NAV_GROUPS = [
  {
    title: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "fa-gauge-high", href: "dashboard.html" },
      { id: "jobs", label: "Job Search", icon: "fa-magnifying-glass", href: "jobs.html" },
      { id: "saved", label: "Saved Jobs", icon: "fa-bookmark", href: "saved-jobs.html" }
    ]
  },
  {
    title: "Track",
    items: [
      { id: "applications", label: "Applications", icon: "fa-diagram-project", href: "applications.html" },
      { id: "interviews", label: "Interviews", icon: "fa-calendar-check", href: "interviews.html" },
      { id: "analytics", label: "Analytics", icon: "fa-chart-pie", href: "analytics.html" }
    ]
  },
  {
    title: "Career",
    items: [
      { id: "resume", label: "Resume Builder", icon: "fa-file-lines", href: "resume.html" },
      { id: "notifications", label: "Notifications", icon: "fa-bell", href: "notifications.html", badge: "unread" }
    ]
  },
  {
    title: "Account",
    items: [
      { id: "profile", label: "My Profile", icon: "fa-user", href: "profile.html" },
      { id: "settings", label: "Settings", icon: "fa-gear", href: "settings.html" }
    ]
  }
];

/* ---------------- Demo records (seeded once) ---------------- */
function daysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(10, 30, 0, 0);
  return d.toISOString();
}

function seedRichDemoData() {
  if (localStorage.getItem("careerPilotRichSeed")) return;

  if (DB.getApplications().length === 0) {
    const seed = [
      { jobId: 1, status: "Interview", applied: daysFromNow(-18) },
      { jobId: 2, status: "Shortlisted", applied: daysFromNow(-14) },
      { jobId: 4, status: "Under Review", applied: daysFromNow(-10) },
      { jobId: 6, status: "Applied", applied: daysFromNow(-7) },
      { jobId: 9, status: "Rejected", applied: daysFromNow(-30) },
      { jobId: 12, status: "Applied", applied: daysFromNow(-4) },
      { jobId: 15, status: "Under Review", applied: daysFromNow(-2) },
      { jobId: 20, status: "Interview", applied: daysFromNow(-9) }
    ];
    const jobs = DB.getJobs();
    DB.saveApplications(
      seed.map(function (row, index) {
        const job = jobs.find(function (j) { return j.id === row.jobId; }) || jobs[0];
        return {
          id: "app-seed-" + (index + 1),
          jobId: job.id,
          title: job.title,
          company: job.company,
          logo: job.logo,
          location: job.location,
          salary: job.salary,
          status: row.status,
          appliedAt: row.applied,
          updatedAt: row.applied,
          notes: "",
          history: [{ status: "Applied", date: row.applied }].concat(
            row.status === "Applied" ? [] : [{ status: row.status, date: row.applied }]
          )
        };
      })
    );
  }

  if (DB.getInterviews().length === 0) {
    DB.saveInterviews([
      { id: "int-1", company: "TechNova Solutions", role: "Frontend Developer", date: daysFromNow(2), mode: "Online", round: "Technical Round 1", notes: "Revise JavaScript closures and React state.", status: "Upcoming" },
      { id: "int-2", company: "Orbitflow Data", role: "Associate Data Engineer", date: daysFromNow(5), mode: "Online", round: "HR Round", notes: "Prepare salary expectation and relocation answer.", status: "Upcoming" },
      { id: "int-3", company: "InsightEdge Analytics", role: "Junior Data Scientist", date: daysFromNow(-6), mode: "On-site", round: "Case Study", notes: "Went well — asked about model evaluation metrics.", status: "Completed" }
    ]);
  }

  if (DB.getSavedJobs().length === 0) DB.saveSavedJobs([3, 5, 11]);

  const notes = DB.getNotifications();
  if (notes.length <= 1) {
    DB.saveNotifications(
      [
        { id: "ntf-1", title: "Interview scheduled", message: "TechNova Solutions scheduled your technical round.", type: "success", icon: "fa-calendar-check", read: false, date: daysFromNow(-1) },
        { id: "ntf-2", title: "Application shortlisted", message: "InsightEdge Analytics moved you to Shortlisted.", type: "info", icon: "fa-star", read: false, date: daysFromNow(-3) },
        { id: "ntf-3", title: "New jobs match your profile", message: "5 new Data Science roles were posted this week.", type: "info", icon: "fa-briefcase", read: true, date: daysFromNow(-5) }
      ].concat(notes)
    );
  }

  localStorage.setItem("careerPilotRichSeed", "true");
}

/* ---------------- Shell rendering ---------------- */
function unreadCount() {
  return DB.getNotifications().filter(function (n) { return !n.read; }).length;
}

function avatarMarkup(user, className) {
  const cls = "avatar " + (className || "");
  if (user && user.avatar) {
    return '<div class="' + cls + '"><img src="' + escapeHtml(user.avatar) + '" alt="Profile photo of ' + escapeHtml(user.name) + '" /></div>';
  }
  return '<div class="' + cls + '">' + escapeHtml(getInitials(user ? user.name : "U")) + "</div>";
}

function renderShell(activeId, title, subtitle) {
  const user = DB.getCurrentUser();
  const unread = unreadCount();
  const collapsed = localStorage.getItem("careerPilotSidebar") === "collapsed";

  const nav = NAV_GROUPS.map(function (group) {
    const links = group.items.map(function (item) {
      const badge = item.badge === "unread" && unread ? '<span class="pill">' + unread + "</span>" : "";
      return (
        '<a class="side-link' + (item.id === activeId ? " active" : "") + '" href="' + item.href + '">' +
        '<i class="fa-solid ' + item.icon + '" aria-hidden="true"></i>' +
        '<span class="side-label">' + item.label + "</span>" + badge +
        "</a>"
      );
    }).join("");
    return '<p class="side-group-title">' + group.title + "</p>" + links;
  }).join("");

  const sidebar =
    '<aside class="sidebar' + (collapsed ? " collapsed" : "") + '" id="sidebar">' +
      '<div class="side-head">' +
        '<a class="logo" href="dashboard.html" style="text-decoration:none">' +
          '<span class="logo-mark"><i class="fa-solid fa-compass"></i></span>' +
          '<span class="logo-text">Career<span>Pilot</span></span>' +
        "</a>" +
        '<button class="side-toggle" id="sidebarToggle" title="Collapse sidebar" aria-label="Collapse sidebar"><i class="fa-solid fa-bars"></i></button>' +
      "</div>" +
      '<nav class="side-nav">' + nav + "</nav>" +
      '<div class="side-foot">' +
        '<button class="btn btn-outline btn-sm" id="shellLogout"><i class="fa-solid fa-right-from-bracket"></i> <span class="side-label">Logout</span></button>' +
      "</div>" +
    "</aside>";

  const topbar =
    '<header class="topbar">' +
      '<button class="icon-btn" id="mobileMenu" aria-label="Open navigation"><i class="fa-solid fa-bars"></i></button>' +
      "<div><h1>" + escapeHtml(title) + "</h1>" +
        (subtitle ? '<div class="sub">' + escapeHtml(subtitle) + "</div>" : "") +
      "</div>" +
      '<div class="top-spacer"></div>' +
      '<button class="icon-btn" data-action="toggle-theme" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>' +
      '<button class="icon-btn" id="bellBtn" aria-label="Notifications"><i class="fa-solid fa-bell"></i>' +
        (unread ? '<span class="dot">' + unread + "</span>" : "") +
      "</button>" +
      '<a class="top-user" href="profile.html" style="text-decoration:none;color:inherit">' +
        avatarMarkup(user) +
        '<div class="who"><strong>' + escapeHtml(user ? user.name : "Guest") + "</strong>" +
        "<span>" + escapeHtml(user && user.interest ? user.interest : "Student") + "</span></div>" +
      "</a>" +
    "</header>";

  document.body.classList.add("app-body");
  const mount = document.getElementById("appShell");
  if (!mount) return;
  mount.className = "app-shell";
  mount.innerHTML =
    sidebar +
    '<div class="app-main">' + topbar + '<div class="page" id="pageContent"></div></div>' +
    '<div class="sidebar-backdrop" id="sidebarBackdrop"></div>';

  // Move the page markup written in the HTML file into the shell.
  const template = document.getElementById("pageTemplate");
  if (template) document.getElementById("pageContent").innerHTML = template.innerHTML;

  wireShell();
  applyTheme(getTheme());
}

function wireShell() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  document.getElementById("sidebarToggle").addEventListener("click", function () {
    if (window.innerWidth <= 992) {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
      return;
    }
    sidebar.classList.toggle("collapsed");
    localStorage.setItem("careerPilotSidebar", sidebar.classList.contains("collapsed") ? "collapsed" : "expanded");
  });

  document.getElementById("mobileMenu").addEventListener("click", function () {
    sidebar.classList.add("open");
    backdrop.classList.add("show");
  });
  backdrop.addEventListener("click", function () {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  });

  document.getElementById("shellLogout").addEventListener("click", logout);
  document.querySelectorAll("[data-action='toggle-theme']").forEach(function (btn) {
    btn.addEventListener("click", toggleTheme);
  });
  document.getElementById("bellBtn").addEventListener("click", toggleNotificationDropdown);
}

function toggleNotificationDropdown() {
  const existing = document.getElementById("notifDrop");
  if (existing) { existing.remove(); return; }

  const list = DB.getNotifications().slice(0, 8);
  const body = list.length
    ? list.map(function (n) {
        return (
          '<div class="drop-item' + (n.read ? "" : " unread") + '" data-notif="' + n.id + '">' +
          '<i class="fa-solid ' + (n.icon || "fa-bell") + '"></i><div>' +
          "<strong>" + escapeHtml(n.title) + "</strong>" +
          "<p>" + escapeHtml(n.message) + "</p>" +
          "<small>" + formatDate(n.date) + "</small></div></div>"
        );
      }).join("")
    : '<p class="text-muted" style="padding:16px;text-align:center">No notifications yet.</p>';

  const drop = document.createElement("div");
  drop.className = "dropdown";
  drop.id = "notifDrop";
  drop.innerHTML =
    "<header><span>Notifications</span>" +
    '<button class="link-btn" id="markAllRead">Mark all read</button></header>' +
    body +
    '<div style="padding:8px"><a class="btn btn-ghost btn-sm btn-block" href="notifications.html">View all</a></div>';
  document.body.appendChild(drop);

  drop.querySelector("#markAllRead").addEventListener("click", function () {
    DB.saveNotifications(DB.getNotifications().map(function (n) { return Object.assign({}, n, { read: true }); }));
    drop.remove();
    showToast("success", "All caught up", "Every notification is marked as read.");
    setTimeout(function () { window.location.reload(); }, 500);
  });

  drop.querySelectorAll("[data-notif]").forEach(function (item) {
    item.addEventListener("click", function () { window.location.href = "notifications.html"; });
  });

  setTimeout(function () {
    document.addEventListener("click", function close(event) {
      if (!drop.contains(event.target) && event.target.closest("#bellBtn") === null) {
        drop.remove();
        document.removeEventListener("click", close);
      }
    });
  }, 0);
}

/* ---------------- Shared domain helpers ---------------- */
const STATUS_BADGE = {
  Applied: "badge-info",
  "Under Review": "badge-warning",
  Shortlisted: "badge-primary",
  Interview: "badge-success",
  Rejected: "badge-danger"
};

function statusBadge(status) {
  return '<span class="badge ' + (STATUS_BADGE[status] || "badge-info") + '">' + escapeHtml(status) + "</span>";
}

function isJobSaved(jobId) {
  return DB.getSavedJobs().some(function (id) { return String(id) === String(jobId); });
}

function toggleSavedJob(jobId) {
  const saved = DB.getSavedJobs();
  const exists = saved.some(function (id) { return String(id) === String(jobId); });
  const next = exists
    ? saved.filter(function (id) { return String(id) !== String(jobId); })
    : saved.concat([jobId]);
  DB.saveSavedJobs(next);
  showToast(exists ? "info" : "success", exists ? "Removed from saved" : "Job saved", exists ? "The job was removed from your saved list." : "You can find it under Saved Jobs.");
  return !exists;
}

function hasApplied(jobId) {
  return DB.getApplications().some(function (app) { return String(app.jobId) === String(jobId); });
}

function applyToJob(job) {
  if (hasApplied(job.id)) {
    showToast("warning", "Already applied", "You have already applied to this role.");
    return false;
  }
  const now = new Date().toISOString();
  const apps = DB.getApplications();
  apps.unshift({
    id: generateId("app"),
    jobId: job.id,
    title: job.title,
    company: job.company,
    logo: job.logo,
    location: job.location,
    salary: job.salary,
    status: "Applied",
    appliedAt: now,
    updatedAt: now,
    notes: "",
    history: [{ status: "Applied", date: now }]
  });
  DB.saveApplications(apps);
  DB.addNotification({
    title: "Application submitted",
    message: "You applied for " + job.title + " at " + job.company + ".",
    type: "success",
    icon: "fa-paper-plane"
  });
  showToast("success", "Application submitted", job.title + " at " + job.company + ".");
  return true;
}

function jobCardMarkup(job) {
  const saved = isJobSaved(job.id);
  return (
    '<article class="job-card">' +
      '<div class="job-top">' +
        '<div class="company-logo">' + escapeHtml(job.logo) + "</div>" +
        "<div><h4>" + escapeHtml(job.title) + "</h4>" +
        '<div class="co">' + escapeHtml(job.company) + "</div></div>" +
        '<button class="save-btn' + (saved ? " saved" : "") + '" data-save="' + job.id + '" title="Save job" aria-label="Save job">' +
          '<i class="' + (saved ? "fa-solid" : "fa-regular") + ' fa-bookmark"></i></button>' +
      "</div>" +
      '<div class="job-meta">' +
        '<span><i class="fa-solid fa-location-dot"></i>' + escapeHtml(job.location) + "</span>" +
        '<span><i class="fa-solid fa-briefcase"></i>' + escapeHtml(job.type) + "</span>" +
        '<span><i class="fa-solid fa-building"></i>' + escapeHtml(job.mode) + "</span>" +
        '<span><i class="fa-solid fa-clock"></i>' + escapeHtml(job.posted) + "</span>" +
      "</div>" +
      '<div class="chips">' + job.skills.slice(0, 4).map(function (s) { return '<span class="chip">' + escapeHtml(s) + "</span>"; }).join("") + "</div>" +
      '<div class="job-foot">' +
        '<span class="salary">' + escapeHtml(job.salary) + "</span>" +
        '<a class="btn btn-primary btn-sm" href="job-details.html?id=' + job.id + '">View details</a>' +
      "</div>" +
    "</article>"
  );
}

function wireSaveButtons(container, onChange) {
  container.querySelectorAll("[data-save]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const nowSaved = toggleSavedJob(btn.getAttribute("data-save"));
      btn.classList.toggle("saved", nowSaved);
      btn.innerHTML = '<i class="' + (nowSaved ? "fa-solid" : "fa-regular") + ' fa-bookmark"></i>';
      if (typeof onChange === "function") onChange();
    });
  });
}

/**
 * Standard boot sequence for every protected module page.
 */
function bootPage(activeId, title, subtitle, render) {
  if (!requireAuth()) return;
  seedRichDemoData();
  document.addEventListener("DOMContentLoaded", function () {
    renderShell(activeId, title, subtitle);
    try {
      render(DB.getCurrentUser());
    } catch (err) {
      console.error("CareerPilot page error", err);
      showToast("error", "Something went wrong", "This section could not be rendered.");
    }
  });
}

/* ---------------- Shared UI fragments ---------------- */
function statCard(tone, icon, value, label, trend) {
  return (
    '<div class="stat-card ' + tone + '">' +
      '<div class="ico"><i class="fa-solid ' + icon + '"></i></div>' +
      "<strong>" + value + "</strong><span>" + label + "</span>" +
      (trend ? '<div class="trend">' + escapeHtml(trend) + "</div>" : "") +
    "</div>"
  );
}

function emptyState(icon, title, message) {
  return (
    '<div class="empty-state"><div class="empty-icon"><i class="fa-solid ' + icon + '"></i></div>' +
    "<h3>" + escapeHtml(title) + "</h3><p>" + escapeHtml(message) + "</p></div>"
  );
}

/** Shared resume score so dashboard and builder always agree. */
function computeResumeScore(resume) {
  if (!resume) return 0;
  let score = 0;
  if (resume.fullName && resume.email && resume.phone) score += 20;
  if (resume.summary && resume.summary.length > 60) score += 15;
  if ((resume.education || []).length) score += 15;
  if ((resume.experience || []).length) score += 15;
  if ((resume.projects || []).length) score += 15;
  if ((resume.skills || []).length >= 5) score += 12;
  if ((resume.certifications || []).length) score += 8;
  return Math.min(score, 100);
}

function textField(id, label, value, icon) {
  return '<div class="field"><label for="' + id + '">' + label + '</label><div class="input-wrap">' +
    '<i class="fa-solid ' + icon + '"></i><input id="' + id + '" value="' + escapeHtml(value) + '" /></div></div>';
}
