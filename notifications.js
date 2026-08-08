/* CareerPilot — notifications.js */
bootPage("notifications", "Notifications", "Everything happening on your account", function () {
  const el = document.getElementById("pageContent");
  let filter = "all";

  function render() {
    const all = DB.getNotifications();
    const list = filter === "unread" ? all.filter(function (n) { return !n.read; }) : all;
    el.innerHTML =
      '<div class="page-head"><div><h2>Notifications</h2><p>' + all.filter(function (n) { return !n.read; }).length + ' unread</p></div>' +
      '<div class="row"><button class="btn btn-outline btn-sm" id="markAll">Mark all read</button>' +
      '<button class="btn btn-ghost btn-sm" id="clearAll">Clear all</button></div></div>' +
      '<div class="tabs"><button class="tab-btn ' + (filter === "all" ? "active" : "") + '" data-f="all">All</button>' +
      '<button class="tab-btn ' + (filter === "unread" ? "active" : "") + '" data-f="unread">Unread</button></div>' +
      (list.length ? '<div class="card" style="padding:8px">' + list.map(function (n) {
        return '<div class="drop-item' + (n.read ? "" : " unread") + '" data-id="' + n.id + '">' +
          '<i class="fa-solid ' + (n.icon || "fa-bell") + '"></i><div style="flex:1"><strong>' + escapeHtml(n.title) + '</strong>' +
          '<p>' + escapeHtml(n.message) + '</p><small>' + formatDate(n.date) + '</small></div>' +
          '<button class="link-btn" data-del="' + n.id + '"><i class="fa-solid fa-xmark"></i></button></div>';
      }).join("") + '</div>' : emptyState("fa-bell-slash", "No notifications", "You are all caught up."));

    el.querySelectorAll("[data-f]").forEach(function (b) { b.addEventListener("click", function () { filter = b.getAttribute("data-f"); render(); }); });
    el.querySelectorAll("[data-id]").forEach(function (row) {
      row.addEventListener("click", function () {
        DB.saveNotifications(DB.getNotifications().map(function (n) { return n.id === row.getAttribute("data-id") ? Object.assign({}, n, { read: true }) : n; }));
        render();
      });
    });
    el.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        DB.saveNotifications(DB.getNotifications().filter(function (n) { return n.id !== b.getAttribute("data-del"); }));
        render();
      });
    });
    document.getElementById("markAll").addEventListener("click", function () {
      DB.saveNotifications(DB.getNotifications().map(function (n) { return Object.assign({}, n, { read: true }); }));
      showToast("success", "All read", ""); render();
    });
    document.getElementById("clearAll").addEventListener("click", function () {
      DB.saveNotifications([]); showToast("info", "Notifications cleared", ""); render();
    });
  }
  render();
});
