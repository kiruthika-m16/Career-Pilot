/* CareerPilot — applications.js : kanban + table with drag & drop */
bootPage("applications", "Applications", "Track every application in one board", function () {
  const el = document.getElementById("pageContent");
  let view = "board";

  function render() {
    const apps = DB.getApplications();
    el.innerHTML =
      '<div class="page-head"><div><h2>Application Tracker</h2><p>' + apps.length + ' application' + (apps.length === 1 ? "" : "s") + ' — drag a card to change its status.</p></div>' +
      '<div class="row"><button class="btn btn-sm ' + (view === "board" ? "btn-primary" : "btn-outline") + '" data-view="board"><i class="fa-solid fa-table-columns"></i> Board</button>' +
      '<button class="btn btn-sm ' + (view === "table" ? "btn-primary" : "btn-outline") + '" data-view="table"><i class="fa-solid fa-list"></i> Table</button></div></div>' +
      (apps.length ? (view === "board" ? board(apps) : table(apps))
        : emptyState("fa-diagram-project", "No applications yet", "Apply to a job and it will appear on this board.") +
          '<div class="row" style="justify-content:center"><a class="btn btn-primary" href="jobs.html">Find jobs</a></div>');

    el.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () { view = btn.getAttribute("data-view"); render(); });
    });
    if (apps.length && view === "board") wireDnd();
    el.querySelectorAll("[data-open]").forEach(function (node) {
      node.addEventListener("click", function () { openApp(node.getAttribute("data-open")); });
    });
  }

  function board(apps) {
    return '<div class="kanban">' + APPLICATION_STATUSES.map(function (status) {
      const cards = apps.filter(function (a) { return a.status === status; });
      return '<div class="kcol" data-status="' + status + '"><h4>' + status + ' <b>' + cards.length + '</b></h4>' +
        cards.map(function (a) {
          return '<div class="kcard" draggable="true" data-id="' + a.id + '" data-open="' + a.id + '">' +
            '<strong>' + escapeHtml(a.title) + '</strong><span>' + escapeHtml(a.company) + '</span>' +
            '<div class="kfoot"><span><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(a.location) + '</span>' +
            '<span>' + formatDate(a.appliedAt) + '</span></div></div>';
        }).join("") + '</div>';
    }).join("") + '</div>';
  }

  function table(apps) {
    return '<div class="table-wrap"><table><thead><tr><th>Role</th><th>Company</th><th>Location</th><th>Status</th><th>Applied</th><th></th></tr></thead><tbody>' +
      apps.map(function (a) {
        return '<tr><td><strong>' + escapeHtml(a.title) + '</strong></td><td>' + escapeHtml(a.company) + '</td><td>' + escapeHtml(a.location) +
          '</td><td>' + statusBadge(a.status) + '</td><td>' + formatDate(a.appliedAt) +
          '</td><td><button class="btn btn-ghost btn-sm" data-open="' + a.id + '">Manage</button></td></tr>';
      }).join("") + '</tbody></table></div>';
  }

  function updateStatus(id, status) {
    const apps = DB.getApplications().map(function (a) {
      if (a.id !== id || a.status === status) return a;
      return Object.assign({}, a, {
        status: status,
        updatedAt: new Date().toISOString(),
        history: (a.history || []).concat([{ status: status, date: new Date().toISOString() }])
      });
    });
    DB.saveApplications(apps);
    showToast("success", "Status updated", "Moved to " + status + ".");
    render();
  }

  function wireDnd() {
    let dragId = null;
    el.querySelectorAll(".kcard").forEach(function (card) {
      card.addEventListener("dragstart", function () { dragId = card.getAttribute("data-id"); card.classList.add("dragging"); });
      card.addEventListener("dragend", function () { card.classList.remove("dragging"); });
    });
    el.querySelectorAll(".kcol").forEach(function (col) {
      col.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("dragover"); });
      col.addEventListener("dragleave", function () { col.classList.remove("dragover"); });
      col.addEventListener("drop", function (e) {
        e.preventDefault(); col.classList.remove("dragover");
        if (dragId) updateStatus(dragId, col.getAttribute("data-status"));
      });
    });
  }

  function openApp(id) {
    const app = DB.getApplications().find(function (a) { return a.id === id; });
    if (!app) return;
    openModal({
      title: app.title + " — " + app.company,
      body:
        '<div class="field"><label for="statusSel">Status</label><div class="input-wrap"><i class="fa-solid fa-flag"></i>' +
        '<select id="statusSel">' + APPLICATION_STATUSES.map(function (s) { return '<option' + (s === app.status ? " selected" : "") + '>' + s + '</option>'; }).join("") + '</select></div></div>' +
        '<div class="field"><label for="noteBox">Notes</label><div class="input-wrap"><textarea id="noteBox" rows="3">' + escapeHtml(app.notes || "") + '</textarea></div></div>' +
        '<h4 style="font-size:.9rem;margin:10px 0">Timeline</h4><div class="timeline">' +
        (app.history || []).map(function (h) { return '<div class="tl-item"><strong>' + escapeHtml(h.status) + '</strong><p>' + formatDate(h.date) + '</p></div>'; }).join("") + '</div>',
      footer: '<button class="btn btn-danger" id="delApp"><i class="fa-solid fa-trash"></i> Withdraw</button>' +
        '<button class="btn btn-primary" id="saveApp">Save changes</button>',
      onOpen: function (overlay) {
        overlay.querySelector("#saveApp").addEventListener("click", function () {
          const status = overlay.querySelector("#statusSel").value;
          const notes = overlay.querySelector("#noteBox").value;
          const apps = DB.getApplications().map(function (a) {
            if (a.id !== id) return a;
            const changed = a.status !== status;
            return Object.assign({}, a, {
              status: status, notes: notes, updatedAt: new Date().toISOString(),
              history: changed ? (a.history || []).concat([{ status: status, date: new Date().toISOString() }]) : a.history
            });
          });
          DB.saveApplications(apps); closeModal(); showToast("success", "Application updated", ""); render();
        });
        overlay.querySelector("#delApp").addEventListener("click", function () {
          DB.saveApplications(DB.getApplications().filter(function (a) { return a.id !== id; }));
          closeModal(); showToast("info", "Application withdrawn", ""); render();
        });
      }
    });
  }

  render();
});
