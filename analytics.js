/* CareerPilot — analytics.js : Chart.js dashboards */
bootPage("analytics", "Analytics", "Insights from your job search", function () {
  const apps = DB.getApplications();
  const el = document.getElementById("pageContent");
  const interviews = DB.getInterviews();
  const responded = apps.filter(function (a) { return a.status !== "Applied"; }).length;
  const rate = apps.length ? Math.round((responded / apps.length) * 100) : 0;

  el.innerHTML =
    '<div class="page-head"><div><h2>Career Analytics</h2><p>Understand what is working in your applications.</p></div></div>' +
    '<div class="stat-grid">' +
      statCard("", "fa-paper-plane", apps.length, "Total applications", "") +
      statCard("green", "fa-percent", rate + "%", "Response rate", "") +
      statCard("amber", "fa-calendar-check", interviews.length, "Interviews", "") +
      statCard("teal", "fa-bookmark", DB.getSavedJobs().length, "Saved jobs", "") +
    '</div>' +
    (apps.length
      ? '<div class="grid-3"><div class="chart-card"><h3 style="font-size:1rem;margin-bottom:10px">Applications by status</h3><canvas id="statusChart"></canvas></div>' +
        '<div class="chart-card"><h3 style="font-size:1rem;margin-bottom:10px">Applications over time</h3><canvas id="timeChart"></canvas></div>' +
        '<div class="chart-card"><h3 style="font-size:1rem;margin-bottom:10px">Top companies</h3><canvas id="companyChart"></canvas></div></div>'
      : emptyState("fa-chart-pie", "No data yet", "Apply to jobs and your analytics will build up here."));

  if (!apps.length || typeof Chart === "undefined") return;

  const css = getComputedStyle(document.documentElement);
  const text = css.getPropertyValue("--text").trim() || "#0f172a";
  Chart.defaults.color = text;
  Chart.defaults.font.family = "Inter, sans-serif";

  const statusCounts = APPLICATION_STATUSES.map(function (s) { return apps.filter(function (a) { return a.status === s; }).length; });
  new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: { labels: APPLICATION_STATUSES, datasets: [{ data: statusCounts, backgroundColor: ["#0284c7", "#d97706", "#2563eb", "#16a34a", "#dc2626"], borderWidth: 0 }] },
    options: { plugins: { legend: { position: "bottom" } }, cutout: "62%" }
  });

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    months.push({ key: d.getFullYear() + "-" + d.getMonth(), label: d.toLocaleString("en-IN", { month: "short" }) });
  }
  const perMonth = months.map(function (m) {
    return apps.filter(function (a) { const d = new Date(a.appliedAt); return d.getFullYear() + "-" + d.getMonth() === m.key; }).length;
  });
  new Chart(document.getElementById("timeChart"), {
    type: "line",
    data: { labels: months.map(function (m) { return m.label; }), datasets: [{ label: "Applications", data: perMonth, borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,.18)", fill: true, tension: 0.35 }] },
    options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
  });

  const byCompany = {};
  apps.forEach(function (a) { byCompany[a.company] = (byCompany[a.company] || 0) + 1; });
  const top = Object.keys(byCompany).slice(0, 6);
  new Chart(document.getElementById("companyChart"), {
    type: "bar",
    data: { labels: top, datasets: [{ label: "Applications", data: top.map(function (c) { return byCompany[c]; }), backgroundColor: "#14b8a6", borderRadius: 8 }] },
    options: { indexAxis: "y", scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }
  });
});
