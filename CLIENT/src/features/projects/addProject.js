import { addProject } from "./projectsService.js"; // ודא שה-path נכון

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProjectForm");
  const resultDiv = document.getElementById("result");

  if (!form) {
    console.error("הטופס לא נמצא!");
    return;
  }

  // טיפול בהגשת הטופס
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // הכנת הנתונים לשליחה
    const projectData = {
      projectCode: document.getElementById("projectCode").value.trim(),
      projectName: document.getElementById("projectName").value.trim()
    };

    const teamCode = document.getElementById("groupCode").value.trim();
    if (teamCode) projectData.teamCode = teamCode;

    const teamLeadName = document.getElementById("teamLeadName").value.trim();
    if (teamLeadName) projectData.teamLeadName = teamLeadName;

    console.log("נתוני הפרויקט לשליחה:", projectData);

    try {
      const data = await addProject(projectData);
      resultDiv.innerText = `✅ פרויקט נוסף בהצלחה! (${data.projectCode})`;
      resultDiv.style.color = "green";
      form.reset();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || "שגיאה בשרת";
      resultDiv.innerText = `❌ שגיאה: ${msg}`;
      resultDiv.style.color = "red";
    }
  });

  // הצגת שם ותמונת פרופיל
  const profileImg = document.getElementById("profile-img");
  const userName = document.getElementById("user-name");

  fetch("http://localhost:5000/auth/me", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => res.json())
  .then(data => {
    if (userName) userName.textContent = data.name || "משתמש";
    if (profileImg) profileImg.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now();
  })
  .catch(err => console.error(err));
});
