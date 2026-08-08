/* ============================================================
   CareerPilot — common.js
   Shared utilities: theme, toasts, modals, validation,
   formatting and route protection. Loaded on every page.
   ============================================================ */

/* ---------------- Theme ---------------- */
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);

  document.querySelectorAll("[data-theme-icon], #themeToggle i").forEach(function (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  });
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  showToast("info", "Theme changed", "Switched to " + next + " mode.");
}

// Apply saved theme immediately so there is no flash of the wrong theme.
applyTheme(getTheme());

/* ---------------- Toast notifications ---------------- */
const TOAST_ICONS = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info"
};

function showToast(type, title, message, duration) {
  const stack = document.getElementById("toastStack");
  if (!stack) return; // page has no toast container — fail silently

  const kind = TOAST_ICONS[type] ? type : "info";
  const toast = document.createElement("div");
  toast.className = "toast toast-" + kind;
  toast.innerHTML =
    '<i class="fa-solid ' + TOAST_ICONS[kind] + '" aria-hidden="true"></i>' +
    '<div class="toast-body"><strong>' + escapeHtml(title) + "</strong>" +
    (message ? "<span>" + escapeHtml(message) + "</span>" : "") +
    "</div>";

  stack.appendChild(toast);

  const life = duration || 3200;
  setTimeout(function () {
    toast.classList.add("leaving");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 220);
  }, life);
}

/* ---------------- Reusable modal ---------------- */
let activeModal = null;

function openModal(options) {
  closeModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-label="' + escapeHtml(options.title || "Dialog") + '">' +
      '<div class="modal-head">' +
        "<h3>" + escapeHtml(options.title || "") + "</h3>" +
        '<button class="modal-close" type="button" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button>' +
      "</div>" +
      '<div class="modal-body">' + (options.body || "") + "</div>" +
      (options.footer ? '<div class="modal-foot">' + options.footer + "</div>" : "") +
    "</div>";

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  activeModal = overlay;

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeModal(); // click outside closes
  });

  if (typeof options.onOpen === "function") options.onOpen(overlay);
  return overlay;
}

function closeModal() {
  if (!activeModal) return;
  if (activeModal.parentNode) activeModal.parentNode.removeChild(activeModal);
  activeModal = null;
  document.body.style.overflow = "";
}

// ESC closes any open modal.
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeModal();
});

/* ---------------- Validation helpers ---------------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(email || "").trim());
}

function isEmpty(value) {
  return String(value || "").trim().length === 0;
}

/**
 * Returns a score from 0 to 4 plus a human label.
 */
function getPasswordStrength(password) {
  const value = String(password || "");
  let score = 0;
  if (value.length >= 6) score++;
  if (value.length >= 10) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  score = Math.min(score, 4);

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#dc2626", "#dc2626", "#d97706", "#0284c7", "#16a34a"];
  return { score: score, label: labels[score], color: colors[score] };
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input && input.parentElement) input.parentElement.classList.toggle("invalid", Boolean(message));
  if (error) error.textContent = message || "";
}

function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll(".error-msg").forEach(function (el) { el.textContent = ""; });
  form.querySelectorAll(".input-wrap.invalid").forEach(function (el) { el.classList.remove("invalid"); });
}

/* ---------------- Formatting helpers ---------------- */
function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name) {
  return String(name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(function (part) { return part.charAt(0).toUpperCase(); })
    .join("");
}

function greetingByHour() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function generateId(prefix) {
  return (prefix || "id") + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

/* ---------------- Access control simulation ---------------- */
/** Call on every protected page. Redirects guests to the login page. */
function requireAuth() {
  if (!DB.isLoggedIn()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

/** Call on the login page. Sends already-logged-in users to the dashboard. */
function redirectIfLoggedIn() {
  if (DB.isLoggedIn()) window.location.href = "dashboard.html";
}

function logout() {
  DB.clearCurrentUser();
  window.location.href = "index.html";
}

/* ---------------- Global wiring ---------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle buttons (any page)
  document.querySelectorAll("#themeToggle, [data-action='toggle-theme']").forEach(function (btn) {
    btn.addEventListener("click", toggleTheme);
  });

  // Password visibility toggles
  document.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = document.getElementById(btn.getAttribute("data-toggle-password"));
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show
        ? '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>'
        : '<i class="fa-regular fa-eye" aria-hidden="true"></i>';
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });
});
