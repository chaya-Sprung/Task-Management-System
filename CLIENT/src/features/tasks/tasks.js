import { getTasks, updateTask, deleteTask } from "./tasksServise.js";

// משתמש מחובר
const currentUser = JSON.parse(localStorage.getItem("user"));

// Toast לפידבק
function showToast(msg, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.backgroundColor = success ? "#10b981" : "#ef4444";
  toast.className = "toast show";
  setTimeout(() => toast.className = "toast", 3000);
}

// Modal
const modal = document.getElementById("statusModal");
const modalStatus = document.getElementById("statusSelect");
const saveModal = document.getElementById("saveStatus");
const closeModal = modal.querySelector(".close");

let currentTask = null;
let currentProjectCode = null;

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; };

// טעינת משימות
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tasksContainer");
  if(!container) return console.error("❌ אלמנט #tasksContainer לא נמצא");

  container.innerHTML = "<p>טוען משימות...</p>";

  try {
    const params = new URLSearchParams(window.location.search);
    const projectCode = params.get("projectCode") || null;

    const tasks = await getTasks({ projectCode });
    renderTasks(tasks, container, projectCode);

  } catch(err) {
    const msg = err.response?.data?.msg || err.response?.data?.message || err.message;
    container.innerHTML = `<p>❌ שגיאה בטעינת המשימות: ${msg}</p>`;
  }
});

// renderTasks
function renderTasks(tasks, container, projectCode) {
  container.innerHTML = "";

  if(!tasks || tasks.length === 0) {
    container.innerHTML = "<p>אין משימות להצגה</p>";
    return;
  }

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task-card");
    div.style.animationDelay = `${index * 0.1}s`;

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.content || ""}</p>
      <p>משוייך ל: <span class="assigned-to">${task.assignedTo || "לא משוייך"}</span></p>
      <div style="display:flex; justify-content: space-between; align-items:center; margin-top:1rem;">
        <span class="task-status" data-status="${task.status}">${task.status}</span>
        <div class="task-actions">
          <button class="edit-btn" title="ערוך סטטוס"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="delete-btn" title="מחק"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    container.appendChild(div);

    const statusSpan = div.querySelector(".task-status");
    setStatusColor(statusSpan);

    const assignedSpan = div.querySelector(".assigned-to");
    const editBtn = div.querySelector(".edit-btn");
    const deleteBtn = div.querySelector(".delete-btn");

    // --- עריכה דרך modal ---
    editBtn.addEventListener("click", async () => {

      // הרשמה על שם המשתמש אם לא משוייך
      if(!task.assignedTo) {
        const assign = confirm("משימה זו לא משויכת. האם תרצה לרשום אותה על שמך?");
        if(!assign) return;

        try {
          await updateTask(task._id, { assignedTo: currentUser.name });
          task.assignedTo = currentUser.name;
          assignedSpan.textContent = currentUser.name;
          showToast("✅ המשימה נרשמה על שמך");
        } catch(err) {
          showToast("❌ לא הצלחנו לרשום את המשימה על שמך", false);
          return;
        }
      }

      // רק המשתמש הרשום יכול לשנות סטטוס
      if(task.assignedTo !== currentUser.name) {
        showToast("❌ אינך יכול לשנות את הסטטוס כי אתה לא המשתמש הרשום למשימה", false);
        return;
      }

      currentTask = task;
      currentProjectCode = projectCode;
      modalStatus.value = task.status;
      modal.style.display = "flex";
    });

    // --- מחיקה ---
    deleteBtn.addEventListener("click", async () => {
      if(!confirm("האם אתה בטוח שברצונך למחוק את המשימה?")) return;
      try {
        await deleteTask(task._id);
        const updatedTasks = await getTasks({ projectCode });
        renderTasks(updatedTasks, container, projectCode);
        showToast("✅ המשימה נמחקה בהצלחה");
      } catch(err) {
        showToast("❌ לא הצלחנו למחוק את המשימה", false);
      }
    });
  });
}

// שמירת סטטוס ב-modal
saveModal.onclick = async () => {
  if(!currentTask) return;
  const newStatus = modalStatus.value;

  try {
    await updateTask(currentTask._id, { status: newStatus });
    const updatedTasks = await getTasks({ projectCode: currentProjectCode });
    renderTasks(updatedTasks, document.getElementById("tasksContainer"), currentProjectCode);
    showToast(`✅ סטטוס עודכן ל-${newStatus}`);
    modal.style.display = "none";
  } catch(err) {
    showToast("❌ לא הצלחנו לעדכן את הסטטוס", false);
  }
};

// צבע לפי סטטוס
function setStatusColor(span) {
  switch(span.dataset.status) {
    case "done": span.style.color = "#10b981"; break;
    case "in-progress": span.style.color = "#fbbf24"; break;
    default: span.style.color = "#3b82f6";
  }
}

// נניח שיש לך את הכפתור:
const backHomeBtn = document.querySelector('.back-home');

// שליפת הנתונים של המשתמש
fetch("http://localhost:5000/auth/me", {
  headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
})
.then(res => res.json())
.then(data => {
  const role = data.role.toLowerCase(); // "manager" או "teamlead"

  // שינוי הקישור לפי תפקיד
  if (role === "manager") {
    backHomeBtn.href = "../pages/manager.html";
  } else if (role === "teamlead") {
    backHomeBtn.href = "../pages/teamlead.html";
    } else if (role === "employee") {
    backHomeBtn.href = "../pages/employee.html"; }
  else {
    backHomeBtn.href = "../pages/login.html"; // ברירת מחדל
  }

  // אפשר גם לשים את שם המשתמש ותמונה
  document.getElementById("user-name").textContent = data.name;
  document.getElementById("profile-img").src = data.profileImage || "default-avatar.png";
})
.catch(err => console.error(err));
