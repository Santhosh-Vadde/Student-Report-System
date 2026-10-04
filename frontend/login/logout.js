// Shared logout handler, loaded after app.js on every dashboard page (admin/faculty/student).
// All dashboard pages sit one folder level below frontend root, so this relative path is consistent.
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(KEYS.session);
  window.location.href = "../login/index.html";
});
