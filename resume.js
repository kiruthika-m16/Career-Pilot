/* CareerPilot — resume.js : builder, live preview, strength score, print */
const EMPTY_RESUME = {
  fullName: "", title: "", email: "", phone: "", location: "", linkedin: "",
  summary: "", skills: [], education: [], experience: [], projects: [], certifications: []
};

bootPage("resume", "Resume Builder", "Build a recruiter-ready resume", function (user) {
  const el = document.getElementById("pageContent");
  let resume = Object.assign({}, EMPTY_RESUME, DB.getResume() || {
    fullName: user.name, email: user.email, phone: user.phone || "", location: user.location || "",
    title: user.interest || "", summary: user.bio || ""
  });

  function save() { DB.saveResume(resume); }

  function render() {
    el.innerHTML =
      '<div class="page-head"><div><h2>Resume Builder</h2><p>Everything saves automatically to your browser.</p></div>' +
      '<div class="row"><button class="btn btn-outline" id="printResume"><i class="fa-solid fa-print"></i> Download / Print</button></div></div>' +
      '<div class="card" style="margin-bottom:16px"><div class="section-title"><h3>Resume strength</h3><strong>' + computeResumeScore(resume) + '%</strong></div>' +
      '<div class="progress"><span style="width:' + computeResumeScore(resume) + '%"></span></div></div>' +
      '<div class="resume-layout"><section class="card">' + editor() + '</section>' +
      '<section class="resume-preview" id="preview">' + preview() + '</section></div>';
    wire();
  }

  function editor() {
    return '<h3 style="font-size:1rem;margin-bottom:10px">Basic details</h3><div class="grid-2">' +
      textField("rName", "Full name", resume.fullName, "fa-user") +
      textField("rTitle", "Professional title", resume.title, "fa-id-badge") +
      textField("rEmail", "Email", resume.email, "fa-envelope") +
      textField("rPhone", "Phone", resume.phone, "fa-phone") +
      textField("rLocation", "Location", resume.location, "fa-location-dot") +
      textField("rLinkedin", "LinkedIn", resume.linkedin, "fa-link") + '</div>' +
      '<div class="field"><label for="rSummary">Career objective</label><div class="input-wrap">' +
      '<textarea id="rSummary" rows="4" placeholder="Two or three sentences about your goals">' + escapeHtml(resume.summary) + '</textarea></div></div>' +
      '<div class="field"><label for="rSkills">Skills (comma separated)</label><div class="input-wrap"><i class="fa-solid fa-code"></i>' +
      '<input id="rSkills" value="' + escapeHtml(resume.skills.join(", ")) + '" placeholder="Python, SQL, React" /></div></div>' +
      listSection("education", "Education", ["Degree / Course", "Institution", "Year", "Score"]) +
      listSection("experience", "Experience / Internships", ["Role", "Organisation", "Duration", "Details"]) +
      listSection("projects", "Projects", ["Project title", "Tech stack", "Year", "Description"]) +
      listSection("certifications", "Certifications", ["Certificate", "Issuer", "Year", "Notes"]);
  }

  function listSection(key, title, labels) {
    return '<h3 style="font-size:1rem;margin:18px 0 10px">' + title + '</h3>' +
      resume[key].map(function (item, index) {
        return '<div class="entry-box"><div class="entry-head"><strong>' + escapeHtml(item.a || labels[0]) + '</strong>' +
          '<button class="link-btn" data-remove="' + key + ':' + index + '"><i class="fa-solid fa-trash"></i></button></div>' +
          '<div class="grid-2">' +
            entryInput(key, index, "a", labels[0], item.a) + entryInput(key, index, "b", labels[1], item.b) +
            entryInput(key, index, "c", labels[2], item.c) + entryInput(key, index, "d", labels[3], item.d) +
          '</div></div>';
      }).join("") +
      '<button class="btn btn-outline btn-sm" data-add="' + key + '"><i class="fa-solid fa-plus"></i> Add entry</button>';
  }

  function entryInput(key, index, field, label, value) {
    return '<div class="field"><label>' + label + '</label><div class="input-wrap">' +
      '<input data-entry="' + key + ':' + index + ':' + field + '" value="' + escapeHtml(value || "") + '" placeholder="' + label + '" /></div></div>';
  }

  function preview() {
    const block = function (title, items, fmt) {
      if (!items.length) return "";
      return "<h5>" + title + "</h5><ul style='padding-left:16px'>" + items.map(fmt).join("") + "</ul>";
    };
    return '<h1>' + escapeHtml(resume.fullName || "Your Name") + '</h1>' +
      '<div class="rp-contact">' + [resume.title, resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean).map(escapeHtml).join(" · ") + '</div>' +
      (resume.summary ? '<h5>Career Objective</h5><p>' + escapeHtml(resume.summary) + '</p>' : "") +
      (resume.skills.length ? '<h5>Skills</h5><p>' + resume.skills.map(escapeHtml).join(" · ") + '</p>' : "") +
      block("Education", resume.education, function (e) { return '<li><strong>' + escapeHtml(e.a) + '</strong> — ' + escapeHtml(e.b) + ' <em>' + escapeHtml(e.c) + '</em> ' + escapeHtml(e.d) + '</li>'; }) +
      block("Experience", resume.experience, function (e) { return '<li><strong>' + escapeHtml(e.a) + '</strong> — ' + escapeHtml(e.b) + ' <em>' + escapeHtml(e.c) + '</em><br/>' + escapeHtml(e.d) + '</li>'; }) +
      block("Projects", resume.projects, function (e) { return '<li><strong>' + escapeHtml(e.a) + '</strong> (' + escapeHtml(e.b) + ') ' + escapeHtml(e.c) + '<br/>' + escapeHtml(e.d) + '</li>'; }) +
      block("Certifications", resume.certifications, function (e) { return '<li><strong>' + escapeHtml(e.a) + '</strong> — ' + escapeHtml(e.b) + ' ' + escapeHtml(e.c) + '</li>'; });
  }

  function refreshPreview() {
    document.getElementById("preview").innerHTML = preview();
    document.querySelector(".progress span").style.width = computeResumeScore(resume) + "%";
    document.querySelector(".section-title strong").textContent = computeResumeScore(resume) + "%";
  }

  function wire() {
    const map = { rName: "fullName", rTitle: "title", rEmail: "email", rPhone: "phone", rLocation: "location", rLinkedin: "linkedin", rSummary: "summary" };
    Object.keys(map).forEach(function (id) {
      document.getElementById(id).addEventListener("input", function (e) {
        resume[map[id]] = e.target.value; save(); refreshPreview();
      });
    });
    document.getElementById("rSkills").addEventListener("input", function (e) {
      resume.skills = e.target.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      save(); refreshPreview();
    });
    el.querySelectorAll("[data-entry]").forEach(function (input) {
      input.addEventListener("input", function () {
        const parts = input.getAttribute("data-entry").split(":");
        resume[parts[0]][Number(parts[1])][parts[2]] = input.value;
        save(); refreshPreview();
      });
    });
    el.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        resume[btn.getAttribute("data-add")].push({ a: "", b: "", c: "", d: "" });
        save(); render();
      });
    });
    el.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const parts = btn.getAttribute("data-remove").split(":");
        resume[parts[0]].splice(Number(parts[1]), 1); save(); render();
        showToast("info", "Entry removed", "");
      });
    });
    document.getElementById("printResume").addEventListener("click", function () { window.print(); });
  }

  render();
});
