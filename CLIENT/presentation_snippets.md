# קטעי קוד להעתקה — מצגת ההגשה

הקובץ הזה מכיל את הקטעים הבולטים מתוך הפרויקט עם הסבר קצר בעברית — מוכנים להעתקה לשקופיות.

---

## 1) `src/features/projects/projectsService.js`
סיבה: שכבת שירות מסודרת שמפרידה קריאות HTTP מה-UI ומשתמשת ב-Authorization header.

קטע להעתקה:
```javascript
// GET כל הפרויקטים
export const getAllProjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
```
הדגשים לשקופית: שורה שמציגה את ה-Authorization header.

---

## 2) `src/features/tasks/tasksServise.js`
סיבה: פונקציית עזר ל-Auth + URL דינמי ב-getTasks — דוגמה טובה לאחידות והרשאות.

קטע להעתקה:
```javascript
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");
  return { Authorization: `Bearer ${token}` };
};

export const getTasks = async ({ projectCode = null } = {}) => {
  try {
    let url = `${API_URL}/tasks`;
    if (projectCode) {
      url += `/project?projectCode=${projectCode}`;
    } else {
      url += `/team`;
    }

    const resp = await axios.get(url, {
      headers: getAuthHeader()
    });

    return resp.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};
```
הדגשים: הפשטת header למחלקת עזר ושימוש ב-URL דינמי לפי קוד פרויקט.

---

## 3) `src/features/projects/projects.js`
סיבה: UI דינמי — יצירת כרטיסים בזמן ריצה, פעולות לפי תפקיד, modal עם אנימציה.

קטע להעתקה (modal open + join action):
```javascript
const openEditModal = (project) => {
  currentProjectId = project._id;
  modalTeamLead.value = project.teamLeadName || "";
  modalTeamCode.value = project.teamCode || "";
  modal.classList.remove("hidden");
  setTimeout(() => modal.querySelector(".modal-content").classList.add("animate"), 10);
};

// כפתור 'הרשם לפרויקט' ל-TeamLead (אם פרויקט לא משוייך)
const joinBtn = document.createElement("button");
joinBtn.textContent = "הרשם לפרויקט";
joinBtn.classList.add("btn-primary");
joinBtn.addEventListener("click", async () => {
  try {
    await updateProject(project._id, { 
      teamLeadName: currentUserName, 
      teamCode: currentUserTeamCode || project.projectCode 
    });
    await loadProjects();
  } catch (err) {
    alert("לא הצלחנו להרשם לפרויקט");
  }
});
```
הדגשים: הדגמת אנימציה קלה (class toggle) ופעולה אסינכרונית שמעדכנת פרויקט.

---

## 4) `src/features/projects/addProject.js`
סיבה: טיפול בטופס נקי עם משוב למשתמש וטכניקה לנטרול cache של תמונת פרופיל.

קטע להעתקה (submit + cache-busting):
```javascript
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectData = {
    projectCode: document.getElementById("projectCode").value.trim(),
    projectName: document.getElementById("projectName").value.trim()
  };
  // אופציונלי
  const teamCode = document.getElementById("groupCode").value.trim();
  if (teamCode) projectData.teamCode = teamCode;

  try {
    const data = await addProject(projectData);
    resultDiv.innerText = `✅ פרויקט נוסף בהצלחה! (${data.projectCode})`;
    resultDiv.style.color = "green";
    form.reset();
  } catch (err) {
    const msg = err.response?.data?.error || err.message || "שגיאה בשרת";
    resultDiv.innerText = `❌ שגיאה: ${msg}`;
    resultDiv.style.color = "red";
  }
});

// cache-busting לתמונת פרופיל
profileImg.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now();
```
הדגשים: feedback ברור למשתמש וטכניקת `?t=` למניעת cache ישן.

---

## 5) `src/features/login/login.js`
סיבה: דוגמת Authentication פשוטה וברורה — בקשת login, שמירת token וניוד לפי תפקיד.

קטע להעתקה:
```javascript
const resp = await axios.post("http://localhost:5000/auth/login", credentials);
// שמירת token ופרטי משתמש
localStorage.setItem("token", userData.token);
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("profileImage", user.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : "default-avatar.png");

// ניתוב לפי תפקיד
if (user.role === "Manager") {
  window.location.href = "../pages/manager.html";
} else if (user.role === "TeamLead") {
  window.location.href = "../pages/teamlead.html";
} else {
  window.location.href = "../pages/employee.html";
}
```
הדגשים: שמירה ל-localStorage + ניתוב תפקידים.

---

## 6) `src/features/login/register.js`
סיבה: שימוש ב-FormData להעלאת תמונת פרופיל, בדיקות סיסמה והצגת שדות דינמית לפי תפקיד.

קטע להעתקה:
```javascript
function toggleTeamFields() {
  if (roleSelect.value === "TeamLead" || roleSelect.value === "Employee") {
    teamFields.forEach(field => field.style.display = "block");
  } else {
    teamFields.forEach(field => field.style.display = "none");
  }
}

const formData = new FormData();
formData.append("name", document.getElementById("name").value);
formData.append("email", document.getElementById("email").value);
formData.append("password", password);
formData.append("role", roleSelect.value);
if (roleSelect.value === "TeamLead" || roleSelect.value === "Employee") {
  formData.append("teamCode", document.getElementById("teamCode").value);
}
const profileImage = document.getElementById("profileImage").files[0];
if (profileImage) formData.append("avatar", profileImage);
```
הדגשים: FormData והוספת קובץ לפני שליחה.

---

## 7) `src/features/pages/manager.js` (קטע קצר)
סיבה: הצגת שם ותפקיד + טעינת avatar עם cache-busting.

קטע להעתקה:
```javascript
avatarImg.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now();
document.getElementById("greeting").textContent = `שלום ${user.name}`;
```

---

## הערות סיכום
- הקבצים מעל מסודרים לפי תפקיד: Authentication → Service layer → UI דינמי → טפסים/Uploads.
- אפשר להעתיק כל קטע ישירות לשקופית ולהדגיש את שורות ה-Authorization, ה-FormData, וה-cache-busting.

אם תרצי, אכין גם גרסת PowerPoint עם שקופיות מוכנות לכל קטע (כולל bullet notes לדיבור).