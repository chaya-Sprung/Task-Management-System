import { registerUser } from './usersService.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('register-form');
  const roleSelect = document.getElementById("role");
  const errorDiv = document.getElementById('error');
  const teamFields = document.querySelectorAll(".team-field");

  // פונקציה שמסתירה/מציגה שדות צוות לפי תפקיד
  function toggleTeamFields() {
    if (roleSelect.value === "TeamLead" || roleSelect.value === "Employee") {
      teamFields.forEach(field => field.style.display = "block");
    } else {
      teamFields.forEach(field => field.style.display = "none");
    }
  }

  roleSelect.addEventListener("change", toggleTeamFields);
  toggleTeamFields();

  // טיפול ברישום
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      errorDiv.style.display = "block";
      errorDiv.textContent = "הסיסמאות לא תואמות!";
      return;
    }

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("role", roleSelect.value);

    if (roleSelect.value === "TeamLead" || roleSelect.value === "Employee") {
      formData.append("teamCode", document.getElementById("teamCode").value);
      formData.append("teamName", document.getElementById("teamName").value);
    }

    const profileImage = document.getElementById("profileImage").files[0];
    if (profileImage) formData.append("avatar", profileImage);

    try {
      const resp = await registerUser(formData, true);

      if (!resp) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "שגיאה ברישום";
        return;
      }

      alert(`${resp.user.role} נוצר בהצלחה!`);
      form.reset();
      toggleTeamFields();
      errorDiv.style.display = "none";

    } catch (err) {
      console.error(err);
      errorDiv.style.display = "block";
      errorDiv.textContent = "שגיאה בשרת: " + (err.response?.data?.message || err.message);
    }
  });

  // עדכון הכפתור חזרה לדף הבית לפי תפקיד
  const backHomeBtn = document.querySelector('.back-home');
  fetch("http://localhost:5000/auth/me", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => res.json())
  .then(data => {
    const role = data.role.toLowerCase(); // "manager", "teamlead", "employee"

    if (backHomeBtn) {
      if (role === "manager") backHomeBtn.href = "../pages/manager.html";
      else if (role === "teamlead") backHomeBtn.href = "../pages/teamlead.html";
      else backHomeBtn.href = "../pages/login.html"; // ברירת מחדל
    }

    // עדכון תמונת פרופיל ושם משתמש
    const profileImgEl = document.getElementById("profile-img");
    if (profileImgEl) {
      profileImgEl.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now();
    }

    const userNameEl = document.getElementById("user-name");
    if (userNameEl) userNameEl.textContent = data.name;
  })
  .catch(err => console.error(err));
});
