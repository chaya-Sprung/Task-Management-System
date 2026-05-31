// ניווט לכפתורים
document.querySelector(".btn-register")?.addEventListener("click", () => {
  window.location.href = "src/features/login/register.html";
});

document.querySelector(".btn-login")?.addEventListener("click", () => {
  window.location.href = "src/features/login/login.html";
});

// בדיקה אם המשתמש מחובר
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (token) {
    const currentPath = window.location.pathname;

    // הפניה ל-index.html רק אם המשתמש לא כבר נמצא שם
    if (!currentPath.endsWith("index.html") && !currentPath.endsWith("/")) {
      window.location.href = "index.html";
    }
  }
});

