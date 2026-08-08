/* ============================================================
   CareerPilot — auth.js
   Login, registration, validation and session handling.
   Frontend-only simulation using LocalStorage.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // If a session already exists, skip the login screen.
  redirectIfLoggedIn();

  const tabs = document.querySelector(".auth-tabs");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (!loginForm || !registerForm) return;

  /* ---------------- Tab switching ---------------- */
  function showMode(mode) {
    const isRegister = mode === "register";

    tabs.classList.toggle("register-active", isRegister);
    tabLogin.classList.toggle("active", !isRegister);
    tabRegister.classList.toggle("active", isRegister);
    tabLogin.setAttribute("aria-selected", String(!isRegister));
    tabRegister.setAttribute("aria-selected", String(isRegister));

    loginForm.classList.toggle("hidden", isRegister);
    registerForm.classList.toggle("hidden", !isRegister);

    clearFormErrors(loginForm);
    clearFormErrors(registerForm);
  }

  tabLogin.addEventListener("click", function () { showMode("login"); });
  tabRegister.addEventListener("click", function () { showMode("register"); });
  document.querySelectorAll("[data-goto]").forEach(function (btn) {
    btn.addEventListener("click", function () { showMode(btn.getAttribute("data-goto")); });
  });

  /* ---------------- Remember me: prefill email ---------------- */
  const rememberedEmail = localStorage.getItem("careerPilotRememberedEmail");
  if (rememberedEmail) {
    document.getElementById("loginEmail").value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }

  /* ---------------- Password strength meter ---------------- */
  const regPassword = document.getElementById("regPassword");
  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");

  regPassword.addEventListener("input", function () {
    const value = regPassword.value;
    if (!value) {
      strengthFill.style.width = "0";
      strengthLabel.textContent = "Password strength: —";
      return;
    }
    const strength = getPasswordStrength(value);
    strengthFill.style.width = ((strength.score + 1) / 5) * 100 + "%";
    strengthFill.style.background = strength.color;
    strengthLabel.textContent = "Password strength: " + strength.label;
    strengthLabel.style.color = strength.color;
  });

  /* ---------------- Login ---------------- */
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormErrors(loginForm);

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    let valid = true;

    if (isEmpty(email)) {
      setFieldError("loginEmail", "loginEmailError", "Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError("loginEmail", "loginEmailError", "Enter a valid email address.");
      valid = false;
    }

    if (isEmpty(password)) {
      setFieldError("loginPassword", "loginPasswordError", "Password is required.");
      valid = false;
    }

    if (!valid) {
      showToast("error", "Check your details", "Please fix the highlighted fields.");
      return;
    }

    const user = DB.findUserByEmail(email);
    if (!user) {
      setFieldError("loginEmail", "loginEmailError", "No account found with this email.");
      showToast("error", "Account not found", "Register first or try the demo account.");
      return;
    }
    if (user.password !== password) {
      setFieldError("loginPassword", "loginPasswordError", "Incorrect password.");
      showToast("error", "Login failed", "The password you entered is incorrect.");
      return;
    }

    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("careerPilotRememberedEmail", user.email);
    } else {
      localStorage.removeItem("careerPilotRememberedEmail");
    }

    signInUser(user, loginForm.querySelector("button[type='submit']"));
  });

  /* ---------------- Demo account ---------------- */
  document.getElementById("demoLogin").addEventListener("click", function () {
    const demo = DB.findUserByEmail(DEMO_USER.email);
    if (!demo) {
      showToast("error", "Demo unavailable", "Demo data could not be loaded.");
      return;
    }
    document.getElementById("loginEmail").value = demo.email;
    document.getElementById("loginPassword").value = DEMO_USER.password;
    signInUser(demo, document.getElementById("demoLogin"));
  });

  /* ---------------- Forgot password (simulated) ---------------- */
  document.getElementById("forgotPassword").addEventListener("click", function () {
    openModal({
      title: "Reset your password",
      body:
        '<p class="text-muted" style="font-size:.9rem;margin-bottom:14px;">' +
        "CareerPilot runs entirely in your browser, so no reset email can be sent. " +
        "Enter your registered email and choose a new password below.</p>" +
        '<div class="field"><label for="fpEmail">Registered email</label>' +
        '<div class="input-wrap"><i class="fa-regular fa-envelope"></i>' +
        '<input type="email" id="fpEmail" placeholder="you@example.com" /></div>' +
        '<small class="error-msg" id="fpEmailError"></small></div>' +
        '<div class="field"><label for="fpPassword">New password</label>' +
        '<div class="input-wrap"><i class="fa-solid fa-lock"></i>' +
        '<input type="password" id="fpPassword" placeholder="Min. 6 characters" /></div>' +
        '<small class="error-msg" id="fpPasswordError"></small></div>',
      footer:
        '<button type="button" class="btn btn-outline" data-close="1">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="fpSubmit">Update password</button>',
      onOpen: function (overlay) {
        overlay.querySelector("[data-close]").addEventListener("click", closeModal);
        overlay.querySelector("#fpSubmit").addEventListener("click", function () {
          const email = overlay.querySelector("#fpEmail").value.trim();
          const password = overlay.querySelector("#fpPassword").value;

          if (!isValidEmail(email)) {
            setFieldError("fpEmail", "fpEmailError", "Enter a valid email address.");
            return;
          }
          const user = DB.findUserByEmail(email);
          if (!user) {
            setFieldError("fpEmail", "fpEmailError", "No account found with this email.");
            return;
          }
          if (password.length < 6) {
            setFieldError("fpPassword", "fpPasswordError", "Password must be at least 6 characters.");
            return;
          }

          user.password = password;
          DB.updateUser(user);
          closeModal();
          showToast("success", "Password updated", "You can now login with your new password.");
        });
      }
    });
  });

  /* ---------------- Register ---------------- */
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFormErrors(registerForm);

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;
    const interest = document.getElementById("regInterest").value;
    const agreed = document.getElementById("regTerms").checked;
    let valid = true;

    if (isEmpty(name)) {
      setFieldError("regName", "regNameError", "Full name is required.");
      valid = false;
    } else if (name.length < 3) {
      setFieldError("regName", "regNameError", "Name must be at least 3 characters.");
      valid = false;
    }

    if (isEmpty(email)) {
      setFieldError("regEmail", "regEmailError", "Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError("regEmail", "regEmailError", "Enter a valid email address.");
      valid = false;
    } else if (DB.findUserByEmail(email)) {
      setFieldError("regEmail", "regEmailError", "This email is already registered.");
      valid = false;
    }

    if (isEmpty(password)) {
      setFieldError("regPassword", "regPasswordError", "Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setFieldError("regPassword", "regPasswordError", "Use at least 6 characters.");
      valid = false;
    }

    if (confirm !== password) {
      setFieldError("regConfirm", "regConfirmError", "Passwords do not match.");
      valid = false;
    }

    if (isEmpty(interest)) {
      setFieldError("regInterest", "regInterestError", "Select a career interest.");
      valid = false;
    }

    const termsError = document.getElementById("regTermsError");
    if (!agreed) {
      if (termsError) termsError.textContent = "You must accept the terms to continue.";
      valid = false;
    }

    if (!valid) {
      showToast("error", "Registration incomplete", "Please complete all required fields.");
      return;
    }

    const newUser = {
      id: generateId("user"),
      name: name,
      email: email,
      password: password,
      interest: interest,
      phone: "",
      location: "",
      bio: "",
      avatar: "",
      linkedin: "",
      github: "",
      createdAt: new Date().toISOString()
    };

    DB.addUser(newUser);
    DB.addNotification({
      title: "Welcome aboard, " + name.split(" ")[0] + "!",
      message: "Your CareerPilot account is ready. Start by exploring jobs.",
      type: "success",
      icon: "fa-circle-check"
    });

    showToast("success", "Account created", "Signing you in…");
    signInUser(newUser, registerForm.querySelector("button[type='submit']"));
  });

  /* ---------------- Shared sign-in routine ---------------- */
  function signInUser(user, buttonEl) {
    DB.setCurrentUser(user);

    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.innerHTML = '<span class="spinner"></span> Signing in…';
    }
    showToast("success", "Welcome back, " + user.name.split(" ")[0] + "!", "Redirecting to your dashboard.");

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 700);
  }
});
