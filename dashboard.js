/* CareerPilot — dashboard.js : overview, stats, activity, deadlines */

bootPage("dashboard", "Dashboard", "Your career at a glance", function (user) {
  const apps = DB.getApplications();
  const saved = DB.getSavedJobs();
  const interviews = DB.getInterviews();
  const jobs = DB.getJobs();
  const upcoming = interviews
    .filter(function (i) { return new Date(i.date) >= new Date(); })
    .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

  const shortlisted = apps.filter(function (a) { return a.status === "Shortlisted" || a.status === "Interview"; }).length;
  const responseRate = apps.length ? Math.round((apps.filter(function (a) { return a.status !== "Applied"; }).length / apps.length) * 100) : 0;

  const resume = DB.getResume();
  const resumeScore = resume ? computeResumeScore(resume) : 0;

  const recommended = jobs
    .filter(function (j) { return user.interest ? j.category === user.interest : true; })
    .filter(function (j) { return !hasApplied(j.id); })
    .slice(0, 3);

  const recent = apps.slice().sort(function (a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); }).slice(0, 5);

  document.getElementById("pageContent").innerHTML =
    '<div class="page-head"><div>' +
      "<h2>" + greetingByHour() + ", " + escapeHtml(user.name.split(" ")[0]) + " 👋</h2>" +
      "<p>Here is what is happening with your job hunt today.</p></div>" +
      '<a class="btn btn-primary" href="jobs.html"><i class="fa-solid fa-magnifying-glass"></i> Find jobs</a>' +
    "</div>" +

    '<div class="stat-grid">' +
      statCard("", "fa-paper-plane", apps.length, "Applications sent", "Across " + new Set(apps.map(function (a) { return a.company; })).size + " companies") +
      statCard("green", "fa-star", shortlisted, "Shortlisted / Interview", responseRate + "% response rate") +
      statCard("amber", "fa-calendar-check", upcoming.length, "Upcoming interviews", upcoming.length ? "Next: " + formatDate(upcoming[0].date) : "Nothing scheduled") +
      statCard("teal", "fa-bookmark", saved.length, "Saved jobs", jobs.length + " jobs in catalogue") +
    "</div>" +

    '<div class="split">' +
      '<section class="card">' +
        '<div class="section-title"><h3>Recent applications</h3><a class="link-btn" href="applications.html">View all</a></div>' +
        (recent.length
          ? '<div class="table-wrap"><table><thead><tr><th>Role</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead><tbody>' +
            recent.map(function (a) {
              return "<tr><td><strong>" + escapeHtml(a.title) + "</strong></td><td>" + escapeHtml(a.company) +
                "</td><td>" + statusBadge(a.status) + "</td><td>" + formatDate(a.appliedAt) + "</td></tr>";
            }).join("") + "</tbody></table></div>"
          : emptyState("fa-paper-plane", "No applications yet", "Apply to your first job to start tracking progress.")) +
      "</section>" +

      '<aside style="display:grid;gap:16px">' +
        '<section class="card">' +
          '<div class="section-title"><h3>Resume strength</h3></div>' +
          '<strong style="font-size:2rem">' + resumeScore + "%</strong>" +
          '<div class="progress" style="margin:10px 0 12px"><span style="width:' + resumeScore + '%"></span></div>' +
          '<p class="text-muted" style="font-size:.83rem">' +
            (resumeScore >= 80 ? "Excellent — your resume is recruiter ready." : "Add more sections to improve your score.") + "</p>" +
          '<a class="btn btn-outline btn-sm btn-block" style="margin-top:12px" href="resume.html"><i class="fa-solid fa-file-lines"></i> Open resume builder</a>' +
        "</section>" +

        '<section class="card">' +
          '<div class="section-title"><h3>Upcoming interviews</h3></div>' +
          (upcoming.length
            ? '<div class="timeline">' + upcoming.slice(0, 3).map(function (i) {
                return '<div class="tl-item"><strong>' + escapeHtml(i.role) + "</strong>" +
                  "<p>" + escapeHtml(i.company) + " · " + escapeHtml(i.round) + "</p>" +
                  '<p><i class="fa-regular fa-clock"></i> ' + formatDate(i.date) + " · " + escapeHtml(i.mode) + "</p></div>";
              }).join("") + "</div>"
            : emptyState("fa-calendar-xmark", "No interviews", "Scheduled interviews will appear here.")) +
        "</section>" +
      "</aside>" +
    "</div>" +

    '<section style="margin-top:18px">' +
      '<div class="section-title"><h3>Recommended for you</h3><a class="link-btn" href="jobs.html">Browse all jobs</a></div>' +
      '<div class="job-grid" id="recoGrid">' + recommended.map(jobCardMarkup).join("") + "</div>" +
    "</section>";

  wireSaveButtons(document.getElementById("recoGrid"));
});
