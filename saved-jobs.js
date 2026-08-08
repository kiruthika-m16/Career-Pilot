/* CareerPilot — saved-jobs.js */
bootPage("saved", "Saved Jobs", "Roles you bookmarked for later", function () {
  const el = document.getElementById("pageContent");
  function render() {
    const jobs = DB.getSavedJobs().map(function (id) { return DB.getJobById(id); }).filter(Boolean);
    el.innerHTML =
      '<div class="page-head"><div><h2>Saved Jobs</h2><p>' + jobs.length + ' job' + (jobs.length === 1 ? "" : "s") + ' saved.</p></div>' +
      (jobs.length ? '<button class="btn btn-outline" id="clearSaved"><i class="fa-solid fa-trash"></i> Clear all</button>' : "") + '</div>' +
      (jobs.length ? '<div class="job-grid" id="savedGrid">' + jobs.map(jobCardMarkup).join("") + '</div>'
        : emptyState("fa-bookmark", "Nothing saved yet", "Tap the bookmark icon on any job to keep it here.") +
          '<div class="row" style="justify-content:center"><a class="btn btn-primary" href="jobs.html">Browse jobs</a></div>');
    if (jobs.length) {
      wireSaveButtons(document.getElementById("savedGrid"), render);
      document.getElementById("clearSaved").addEventListener("click", function () {
        DB.saveSavedJobs([]); showToast("info", "Saved jobs cleared", "Your list is empty again."); render();
      });
    }
  }
  render();
});
