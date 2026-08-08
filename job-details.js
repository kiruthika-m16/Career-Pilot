/* CareerPilot — job-details.js */
bootPage("jobs", "Job Details", "Full role description", function () {
  const id = new URLSearchParams(window.location.search).get("id");
  const job = DB.getJobById(id);
  const el = document.getElementById("pageContent");
  if (!job) { el.innerHTML = emptyState("fa-circle-question", "Job not found", "This listing no longer exists.") +
    '<div class="row" style="justify-content:center"><a class="btn btn-primary" href="jobs.html">Back to jobs</a></div>'; return; }

  const applied = hasApplied(job.id);
  const saved = isJobSaved(job.id);
  const list = function (items) { return "<ul style='padding-left:18px;display:grid;gap:6px'>" + items.map(function (i) { return "<li>" + escapeHtml(i) + "</li>"; }).join("") + "</ul>"; };

  el.innerHTML =
    '<a class="link-btn" href="jobs.html"><i class="fa-solid fa-arrow-left"></i> Back to jobs</a>' +
    '<div class="split" style="margin-top:14px">' +
      '<section class="card">' +
        '<div class="job-top" style="margin-bottom:14px"><div class="company-logo">' + escapeHtml(job.logo) + '</div>' +
        '<div><h2>' + escapeHtml(job.title) + '</h2><div class="co">' + escapeHtml(job.company) + '</div></div></div>' +
        '<div class="job-meta" style="margin-bottom:14px">' +
          '<span><i class="fa-solid fa-location-dot"></i>' + escapeHtml(job.location) + '</span>' +
          '<span><i class="fa-solid fa-briefcase"></i>' + escapeHtml(job.type) + '</span>' +
          '<span><i class="fa-solid fa-building"></i>' + escapeHtml(job.mode) + '</span>' +
          '<span><i class="fa-solid fa-user-graduate"></i>' + escapeHtml(job.experience) + '</span>' +
          '<span><i class="fa-solid fa-clock"></i>' + escapeHtml(job.posted) + '</span></div>' +
        '<h3 style="font-size:1rem;margin-bottom:6px">About the company</h3><p class="text-muted">' + escapeHtml(job.about) + '</p>' +
        '<h3 style="font-size:1rem;margin:16px 0 6px">Role overview</h3><p class="text-muted">' + escapeHtml(job.description) + '</p>' +
        '<h3 style="font-size:1rem;margin:16px 0 6px">Responsibilities</h3>' + list(job.responsibilities) +
        '<h3 style="font-size:1rem;margin:16px 0 6px">Requirements</h3>' + list(job.requirements) +
        '<h3 style="font-size:1rem;margin:16px 0 6px">Benefits</h3>' + list(job.benefits) +
      '</section>' +
      '<aside class="card">' +
        '<span class="salary" style="font-size:1.25rem;font-weight:800;color:var(--success)">' + escapeHtml(job.salary) + '</span>' +
        '<div class="chips" style="margin:14px 0">' + job.skills.map(function (s) { return '<span class="chip">' + escapeHtml(s) + '</span>'; }).join("") + '</div>' +
        '<button class="btn btn-primary btn-block" id="applyBtn"' + (applied ? " disabled" : "") + '><i class="fa-solid fa-paper-plane"></i> ' + (applied ? "Already applied" : "Apply now") + '</button>' +
        '<button class="btn btn-outline btn-block" style="margin-top:10px" id="saveBtn"><i class="' + (saved ? "fa-solid" : "fa-regular") + ' fa-bookmark"></i> ' + (saved ? "Saved" : "Save job") + '</button>' +
      '</aside>' +
    '</div>';

  document.getElementById("applyBtn").addEventListener("click", function () {
    openModal({
      title: "Apply for " + job.title,
      body: '<p class="text-muted" style="margin-bottom:12px">Confirm your application to <strong>' + escapeHtml(job.company) + '</strong>.</p>' +
        '<div class="field"><label for="coverNote">Short note (optional)</label><div class="input-wrap">' +
        '<textarea id="coverNote" rows="4" placeholder="Why are you a good fit?"></textarea></div></div>',
      footer: '<button class="btn btn-ghost" id="cancelApply">Cancel</button><button class="btn btn-primary" id="confirmApply">Submit application</button>',
      onOpen: function (overlay) {
        overlay.querySelector("#cancelApply").addEventListener("click", closeModal);
        overlay.querySelector("#confirmApply").addEventListener("click", function () {
          if (applyToJob(job)) { closeModal(); setTimeout(function () { window.location.href = "applications.html"; }, 700); }
        });
      }
    });
  });

  document.getElementById("saveBtn").addEventListener("click", function (event) {
    const nowSaved = toggleSavedJob(job.id);
    event.currentTarget.innerHTML = '<i class="' + (nowSaved ? "fa-solid" : "fa-regular") + ' fa-bookmark"></i> ' + (nowSaved ? "Saved" : "Save job");
  });
});
