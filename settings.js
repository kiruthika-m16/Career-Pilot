/* CareerPilot — settings.js */
bootPage("settings", "Settings", "Preferences and account controls", function (user) {
  const el = document.getElementById("pageContent");
  const s = DB.getSettings();

  el.innerHTML =
    '<div class="split">' +
      '<section class="card">' +
        '<h3 style="font-size:1.05rem;margin-bottom:6px">Notifications</h3>' +
        toggleRow("jobAlerts", "Job alerts", "Email me when new matching jobs are posted.", s.jobAlerts) +
        toggleRow("applicationUpdates", "Application updates", "Notify me when an application status changes.", s.applicationUpdates) +
        toggleRow("interviewReminders", "Interview reminders", "Remind me one day before an interview.", s.interviewReminders) +
        '<h3 style="font-size:1.05rem;margin:20px 0 6px">Appearance</h3>' +
        '<div class="switch"><div><strong>Dark mode</strong><p>Switch between light and dark themes.</p></div>' +
        '<button class="btn btn-outline btn-sm" data-action="toggle-theme"><i class="fa-solid fa-circle-half-stroke"></i> Toggle</button></div>' +
        '<h3 style="font-size:1.05rem;margin:20px 0 6px">Privacy</h3>' +
        '<div class="field"><label for="visibility">Profile visibility</label><div class="input-wrap"><i class="fa-solid fa-eye"></i>' +
        '<select id="visibility"><option value="public">Public</option><option value="recruiters">Recruiters only</option><option value="private">Private</option></select></div></div>' +
      '</section>' +
      '<aside style="display:grid;gap:16px">' +
        '<section class="card"><h3 style="font-size:1.05rem;margin-bottom:10px">Change password</h3>' +
          '<div class="field"><label for="newPass">New password</label><div class="input-wrap"><i class="fa-solid fa-lock"></i>' +
          '<input type="password" id="newPass" placeholder="Min. 6 characters" /></div></div>' +
          '<div class="field"><label for="confirmPass">Confirm password</label><div class="input-wrap"><i class="fa-solid fa-lock"></i>' +
          '<input type="password" id="confirmPass" placeholder="Re-enter password" /></div></div>' +
          '<button class="btn btn-primary btn-block" id="changePass">Update password</button></section>' +
        '<section class="card"><h3 style="font-size:1.05rem;margin-bottom:10px">Data</h3>' +
          '<button class="btn btn-outline btn-block" id="exportData"><i class="fa-solid fa-download"></i> Export my data (JSON)</button>' +
          '<button class="btn btn-danger btn-block" style="margin-top:10px" id="resetData"><i class="fa-solid fa-trash"></i> Reset demo data</button></section>' +
      '</aside>' +
    '</div>';

  document.getElementById("visibility").value = s.profileVisibility;
  document.getElementById("visibility").addEventListener("change", function (e) {
    DB.saveSettings({ profileVisibility: e.target.value });
    showToast("success", "Privacy updated", "");
  });

  el.querySelectorAll("[data-setting]").forEach(function (input) {
    input.addEventListener("change", function () {
      const patch = {}; patch[input.getAttribute("data-setting")] = input.checked;
      DB.saveSettings(patch);
      showToast("success", "Preferences saved", "");
    });
  });

  document.getElementById("changePass").addEventListener("click", function () {
    const a = document.getElementById("newPass").value;
    const b = document.getElementById("confirmPass").value;
    if (a.length < 6) { showToast("error", "Too short", "Use at least 6 characters."); return; }
    if (a !== b) { showToast("error", "Passwords do not match", ""); return; }
    DB.updateUser(Object.assign({}, DB.findUserByEmail(user.email) || user, { password: a }));
    document.getElementById("newPass").value = ""; document.getElementById("confirmPass").value = "";
    showToast("success", "Password updated", "Use the new password next time you sign in.");
  });

  document.getElementById("exportData").addEventListener("click", function () {
    const payload = {
      profile: DB.getCurrentUser(), applications: DB.getApplications(),
      interviews: DB.getInterviews(), savedJobs: DB.getSavedJobs(), resume: DB.getResume()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "careerpilot-data.json"; a.click();
    URL.revokeObjectURL(a.href);
    showToast("success", "Export ready", "Your data was downloaded.");
  });

  document.getElementById("resetData").addEventListener("click", function () {
    openModal({
      title: "Reset demo data?",
      body: '<p class="text-muted">This clears applications, interviews, saved jobs and your resume. Your account stays intact.</p>',
      footer: '<button class="btn btn-ghost" id="cancelReset">Cancel</button><button class="btn btn-danger" id="confirmReset">Reset</button>',
      onOpen: function (o) {
        o.querySelector("#cancelReset").addEventListener("click", closeModal);
        o.querySelector("#confirmReset").addEventListener("click", function () {
          ["applications", "interviews", "savedJobs", "notifications", "resume"].forEach(function (k) { localStorage.removeItem(STORAGE_KEYS[k]); });
          localStorage.removeItem("careerPilotRichSeed"); localStorage.removeItem(STORAGE_KEYS.seeded);
          closeModal(); showToast("success", "Data reset", "Reloading a fresh demo dataset.");
          setTimeout(function () { window.location.href = "dashboard.html"; }, 800);
        });
      }
    });
  });
});

function toggleRow(key, title, desc, checked) {
  return '<div class="switch"><div><strong>' + title + '</strong><p>' + desc + '</p></div>' +
    '<label class="toggle"><input type="checkbox" data-setting="' + key + '"' + (checked ? " checked" : "") + ' /><span></span></label></div>';
}
