/* CareerPilot — interviews.js : schedule and manage interviews */
bootPage("interviews", "Interviews", "Plan and prepare for every round", function () {
  const el = document.getElementById("pageContent");

  function render() {
    const list = DB.getInterviews().slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    const upcoming = list.filter(function (i) { return new Date(i.date) >= new Date(); });
    const past = list.filter(function (i) { return new Date(i.date) < new Date(); });

    el.innerHTML =
      '<div class="page-head"><div><h2>Interviews</h2><p>' + upcoming.length + ' upcoming · ' + past.length + ' completed</p></div>' +
      '<button class="btn btn-primary" id="addInt"><i class="fa-solid fa-plus"></i> Schedule interview</button></div>' +
      '<div class="grid-3">' + (list.length ? list.map(card).join("") : "") + '</div>' +
      (list.length ? "" : emptyState("fa-calendar-plus", "No interviews scheduled", "Add your first interview to start preparing."));

    document.getElementById("addInt").addEventListener("click", function () { form(null); });
    el.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { form(b.getAttribute("data-edit")); }); });
    el.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        DB.saveInterviews(DB.getInterviews().filter(function (i) { return i.id !== b.getAttribute("data-del"); }));
        showToast("info", "Interview removed", ""); render();
      });
    });
  }

  function card(i) {
    const upcoming = new Date(i.date) >= new Date();
    return '<article class="card"><div class="row" style="justify-content:space-between">' +
      '<span class="badge ' + (upcoming ? "badge-success" : "badge-info") + '">' + (upcoming ? "Upcoming" : "Completed") + '</span>' +
      '<span class="chip">' + escapeHtml(i.mode) + '</span></div>' +
      '<h4 style="margin-top:10px">' + escapeHtml(i.role) + '</h4>' +
      '<p class="text-muted" style="font-size:.85rem">' + escapeHtml(i.company) + ' · ' + escapeHtml(i.round) + '</p>' +
      '<p style="font-size:.85rem;margin-top:8px"><i class="fa-regular fa-calendar"></i> ' + formatDate(i.date) +
      ' <i class="fa-regular fa-clock" style="margin-left:8px"></i> ' + new Date(i.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + '</p>' +
      (i.notes ? '<p class="text-muted" style="font-size:.82rem;margin-top:8px">' + escapeHtml(i.notes) + '</p>' : "") +
      '<div class="row" style="margin-top:12px"><button class="btn btn-outline btn-sm" data-edit="' + i.id + '">Edit</button>' +
      '<button class="btn btn-ghost btn-sm" data-del="' + i.id + '">Delete</button></div></article>';
  }

  function form(id) {
    const item = id ? DB.getInterviews().find(function (i) { return i.id === id; }) : null;
    const dt = item ? new Date(item.date) : new Date();
    const value = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    openModal({
      title: item ? "Edit interview" : "Schedule interview",
      body:
        '<div class="field"><label for="iCompany">Company</label><div class="input-wrap"><i class="fa-solid fa-building"></i><input id="iCompany" value="' + escapeHtml(item ? item.company : "") + '" /></div></div>' +
        '<div class="field"><label for="iRole">Role</label><div class="input-wrap"><i class="fa-solid fa-briefcase"></i><input id="iRole" value="' + escapeHtml(item ? item.role : "") + '" /></div></div>' +
        '<div class="grid-2"><div class="field"><label for="iDate">Date & time</label><div class="input-wrap"><i class="fa-regular fa-calendar"></i><input type="datetime-local" id="iDate" value="' + value + '" /></div></div>' +
        '<div class="field"><label for="iMode">Mode</label><div class="input-wrap"><i class="fa-solid fa-video"></i><select id="iMode"><option>Online</option><option>On-site</option><option>Telephonic</option></select></div></div></div>' +
        '<div class="field"><label for="iRound">Round</label><div class="input-wrap"><i class="fa-solid fa-layer-group"></i><input id="iRound" value="' + escapeHtml(item ? item.round : "") + '" placeholder="e.g. Technical Round 1" /></div></div>' +
        '<div class="field"><label for="iNotes">Preparation notes</label><div class="input-wrap"><textarea id="iNotes" rows="3">' + escapeHtml(item ? item.notes : "") + '</textarea></div></div>',
      footer: '<button class="btn btn-ghost" id="cancelInt">Cancel</button><button class="btn btn-primary" id="saveInt">Save</button>',
      onOpen: function (overlay) {
        if (item) overlay.querySelector("#iMode").value = item.mode;
        overlay.querySelector("#cancelInt").addEventListener("click", closeModal);
        overlay.querySelector("#saveInt").addEventListener("click", function () {
          const data = {
            company: overlay.querySelector("#iCompany").value.trim(),
            role: overlay.querySelector("#iRole").value.trim(),
            date: new Date(overlay.querySelector("#iDate").value).toISOString(),
            mode: overlay.querySelector("#iMode").value,
            round: overlay.querySelector("#iRound").value.trim() || "Interview",
            notes: overlay.querySelector("#iNotes").value.trim()
          };
          if (!data.company || !data.role) { showToast("error", "Missing details", "Company and role are required."); return; }
          const list = DB.getInterviews();
          if (item) { DB.saveInterviews(list.map(function (i) { return i.id === id ? Object.assign({}, i, data) : i; })); }
          else { list.push(Object.assign({ id: generateId("int"), status: "Upcoming" }, data)); DB.saveInterviews(list); }
          closeModal(); showToast("success", "Interview saved", data.company + " · " + data.round); render();
        });
      }
    });
  }

  render();
});
