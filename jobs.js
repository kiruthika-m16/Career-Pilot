/* CareerPilot — jobs.js : search, filters, sorting, pagination */

bootPage("jobs", "Job Search", "Find roles that match your skills", function () {
  const state = { q: "", category: "", type: "", mode: "", location: "", sort: "recent", page: 1, perPage: 9 };

  document.getElementById("pageContent").innerHTML =
    '<div class="page-head"><div><h2>Job Search</h2><p>Browse curated openings for students and freshers.</p></div></div>' +
    '<div class="filter-bar">' +
      '<div class="field"><div class="input-wrap"><i class="fa-solid fa-magnifying-glass"></i>' +
        '<input type="search" id="q" placeholder="Search by role, company or skill" /></div></div>' +
      '<div class="filter-grid">' +
        selectField("fCategory", "All categories", JOB_CATEGORIES) +
        selectField("fType", "All job types", JOB_TYPES) +
        selectField("fMode", "All work modes", WORK_MODES) +
        selectField("fLocation", "All locations", LOCATIONS) +
        '<div class="field"><div class="input-wrap"><i class="fa-solid fa-arrow-down-wide-short"></i>' +
          '<select id="fSort"><option value="recent">Newest first</option><option value="title">Title A–Z</option><option value="company">Company A–Z</option></select>' +
        "</div></div>" +
      "</div>" +
      '<div class="row" style="margin-top:12px"><button class="btn btn-ghost btn-sm" id="clearFilters"><i class="fa-solid fa-rotate-left"></i> Reset filters</button>' +
        '<span class="text-muted" id="resultCount" style="font-size:.85rem"></span></div>' +
    "</div>" +
    '<div class="job-grid" id="jobGrid"></div>' +
    '<div class="row" id="pager" style="justify-content:center;margin-top:20px"></div>';

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = DB.getJobs().filter(function (job) {
      const haystack = (job.title + " " + job.company + " " + job.skills.join(" ") + " " + job.category).toLowerCase();
      return (
        (!q || haystack.indexOf(q) !== -1) &&
        (!state.category || job.category === state.category) &&
        (!state.type || job.type === state.type) &&
        (!state.mode || job.mode === state.mode) &&
        (!state.location || job.location === state.location)
      );
    });
    if (state.sort === "title") list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    if (state.sort === "company") list.sort(function (a, b) { return a.company.localeCompare(b.company); });
    return list;
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / state.perPage));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page - 1) * state.perPage, state.page * state.perPage);
    const grid = document.getElementById("jobGrid");

    grid.innerHTML = slice.length
      ? slice.map(jobCardMarkup).join("")
      : emptyState("fa-magnifying-glass", "No jobs found", "Try removing a filter or searching a different keyword.");
    wireSaveButtons(grid);

    document.getElementById("resultCount").textContent = list.length + " job" + (list.length === 1 ? "" : "s") + " found";

    let pager = "";
    for (let i = 1; i <= pages; i++) {
      pager += '<button class="btn btn-sm ' + (i === state.page ? "btn-primary" : "btn-outline") + '" data-page="' + i + '">' + i + "</button>";
    }
    const pagerEl = document.getElementById("pager");
    pagerEl.innerHTML = pages > 1 ? pager : "";
    pagerEl.querySelectorAll("[data-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.page = Number(btn.getAttribute("data-page"));
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function bind(id, key) {
    document.getElementById(id).addEventListener("input", function (event) {
      state[key] = event.target.value;
      state.page = 1;
      render();
    });
  }
  bind("q", "q"); bind("fCategory", "category"); bind("fType", "type");
  bind("fMode", "mode"); bind("fLocation", "location"); bind("fSort", "sort");

  document.getElementById("clearFilters").addEventListener("click", function () {
    Object.assign(state, { q: "", category: "", type: "", mode: "", location: "", sort: "recent", page: 1 });
    ["q", "fCategory", "fType", "fMode", "fLocation"].forEach(function (id) { document.getElementById(id).value = ""; });
    document.getElementById("fSort").value = "recent";
    render();
  });

  render();
});

function selectField(id, placeholder, options) {
  return (
    '<div class="field"><div class="input-wrap"><i class="fa-solid fa-filter"></i><select id="' + id + '">' +
    '<option value="">' + placeholder + "</option>" +
    options.map(function (o) { return "<option>" + o + "</option>"; }).join("") +
    "</select></div></div>"
  );
}
