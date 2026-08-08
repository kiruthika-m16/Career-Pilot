/* CareerPilot — profile.js */
bootPage("profile", "My Profile", "Keep your details up to date", function (user) {
  const el = document.getElementById("pageContent");
  const apps = DB.getApplications();

  el.innerHTML =
    '<div class="split">' +
      '<section class="card">' +
        '<h3 style="font-size:1.05rem;margin-bottom:14px">Personal information</h3>' +
        '<div class="grid-2">' +
          textField("pName", "Full name", user.name, "fa-user") +
          textField("pEmail", "Email", user.email, "fa-envelope") +
          textField("pPhone", "Phone", user.phone || "", "fa-phone") +
          textField("pLocation", "Location", user.location || "", "fa-location-dot") +
        '</div>' +
        '<div class="field"><label for="pInterest">Career interest</label><div class="input-wrap"><i class="fa-solid fa-briefcase"></i>' +
        '<select id="pInterest">' + JOB_CATEGORIES.map(function (c) { return '<option' + (c === user.interest ? " selected" : "") + '>' + c + '</option>'; }).join("") + '</select></div></div>' +
        '<div class="field"><label for="pBio">About me</label><div class="input-wrap"><textarea id="pBio" rows="4">' + escapeHtml(user.bio || "") + '</textarea></div></div>' +
        '<div class="grid-2">' + textField("pLinkedin", "LinkedIn", user.linkedin || "", "fa-linkedin") + textField("pGithub", "GitHub", user.github || "", "fa-github") + '</div>' +
        '<button class="btn btn-primary" id="saveProfile"><i class="fa-solid fa-floppy-disk"></i> Save changes</button>' +
      '</section>' +
      '<aside class="card" style="text-align:center">' +
        avatarMarkup(user, "avatar-lg") .replace('class="avatar avatar-lg"', 'class="avatar avatar-lg" style="margin:0 auto 14px"') +
        '<h3>' + escapeHtml(user.name) + '</h3>' +
        '<p class="text-muted" style="font-size:.85rem">' + escapeHtml(user.email) + '</p>' +
        '<span class="badge badge-primary" style="margin-top:8px">' + escapeHtml(user.interest || "Student") + '</span>' +
        '<div class="stat-grid" style="grid-template-columns:1fr 1fr;margin-top:18px">' +
          '<div><strong style="font-size:1.4rem">' + apps.length + '</strong><div class="text-muted" style="font-size:.78rem">Applications</div></div>' +
          '<div><strong style="font-size:1.4rem">' + DB.getInterviews().length + '</strong><div class="text-muted" style="font-size:.78rem">Interviews</div></div>' +
        '</div>' +
        '<label class="btn btn-outline btn-block" style="margin-top:16px"><i class="fa-solid fa-camera"></i> Change photo' +
        '<input type="file" id="photoInput" accept="image/*" class="sr-only" /></label>' +
      '</aside>' +
    '</div>';

  document.getElementById("photoInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      DB.updateUser(Object.assign({}, user, { avatar: reader.result }));
      showToast("success", "Photo updated", "");
      setTimeout(function () { window.location.reload(); }, 600);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("saveProfile").addEventListener("click", function () {
    const name = document.getElementById("pName").value.trim();
    const email = document.getElementById("pEmail").value.trim();
    if (!name) { showToast("error", "Name required", "Please enter your full name."); return; }
    if (!isValidEmail(email)) { showToast("error", "Invalid email", "Enter a valid email address."); return; }
    DB.updateUser(Object.assign({}, user, {
      name: name, email: email,
      phone: document.getElementById("pPhone").value.trim(),
      location: document.getElementById("pLocation").value.trim(),
      interest: document.getElementById("pInterest").value,
      bio: document.getElementById("pBio").value.trim(),
      linkedin: document.getElementById("pLinkedin").value.trim(),
      github: document.getElementById("pGithub").value.trim()
    }));
    showToast("success", "Profile saved", "Your details were updated.");
    setTimeout(function () { window.location.reload(); }, 700);
  });
});
