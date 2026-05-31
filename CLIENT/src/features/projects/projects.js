import { getAllProjects, updateProject, deleteProject } from "./projectsService.js";

async function initProjectsPage() {
  // שליפת המשתמש המחובר
  const res = await fetch("http://localhost:5000/auth/me", {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });
  const data = await res.json();
  const currentUserRole = data.role.toLowerCase();
  const currentUserName = data.name;
  const currentUserTeamCode = data.teamCode || null;

  // הצגת שם ותמונת פרופיל
  const profileImgEl = document.getElementById("profile-img");
  if (profileImgEl) {
    profileImgEl.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now();
  }

  const userNameEl = document.getElementById("user-name");
  if (userNameEl) userNameEl.textContent = currentUserName;

  const backHomeBtn = document.querySelector('.back-home');
  if (backHomeBtn) {
    if (currentUserRole === "manager") backHomeBtn.href = "../pages/manager.html";
    else if (currentUserRole === "teamlead") backHomeBtn.href = "../pages/teamlead.html";
    else if (currentUserRole === "employee") backHomeBtn.href = "../pages/employee.html";
    else backHomeBtn.href = "../pages/login.html";
  }

  const modal = document.getElementById("edit-modal");
  const modalTeamLead = document.getElementById("modal-teamLead");
  const modalTeamCode = document.getElementById("modal-teamCode");
  const modalSaveBtn = document.getElementById("modal-save-btn");
  const modalCloseBtn = modal.querySelector(".close-btn");
  let currentProjectId = null;

  const openEditModal = (project) => {
    currentProjectId = project._id;
    modalTeamLead.value = project.teamLeadName || "";
    modalTeamCode.value = project.teamCode || "";
    modal.classList.remove("hidden");
    setTimeout(() => modal.querySelector(".modal-content").classList.add("animate"), 10);
  };

  const closeModal = () => {
    modal.querySelector(".modal-content").classList.remove("animate");
    setTimeout(() => modal.classList.add("hidden"), 300);
  };

  modalCloseBtn.addEventListener("click", closeModal);

  modalSaveBtn.addEventListener("click", async () => {
    if (!currentProjectId) return;

    const updatedProject = {
      teamLeadName: modalTeamLead.value,
      teamCode: modalTeamCode.value
    };

    try {
      await updateProject(currentProjectId, updatedProject);
      closeModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("לא ניתן לעדכן את הפרויקט");
    }
  });

  const removeProject = async (id) => {
    if (currentUserRole !== "manager") return;
    if (!confirm("את בטוחה שאת רוצה למחוק את הפרויקט הזה?")) return;

    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("לא ניתן למחוק את הפרויקט");
    }
  };

  const loadProjects = async () => {
    const projectsDiv = document.getElementById("projects");
    const projects = await getAllProjects();

    projectsDiv.innerHTML = "";
    if (!projects || projects.length === 0) {
      projectsDiv.innerHTML = "<p>אין פרויקטים להצגה</p>";
      return;
    }

    projects.forEach(project => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      const isMyProject = project.teamLeadName === currentUserName;
      const isUnassigned = !project.teamCode;

      card.innerHTML = `
        <h3>${project.projectName}</h3>
        <p><strong>קוד פרויקט:</strong> ${project.projectCode}</p>
        <p><strong>קוד צוות:</strong> ${project.teamCode || "-"}</p>
        <p><strong>ראש צוות:</strong> ${project.teamLeadName || "-"}</p>
        <div class="project-actions"></div>
      `;

      const actionsDiv = card.querySelector(".project-actions");

      // אם מנהל - אפשרות עריכה ומחיקה
      if (currentUserRole === "manager") {
        const editBtn = document.createElement("i");
        editBtn.classList.add("fa-solid", "fa-pen-to-square", "edit-icon");
        editBtn.title = "ערוך";
        editBtn.addEventListener("click", () => openEditModal(project));
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement("i");
        deleteBtn.classList.add("fa-solid", "fa-trash", "delete-icon");
        deleteBtn.title = "מחק";
        deleteBtn.addEventListener("click", () => removeProject(project._id));
        actionsDiv.appendChild(deleteBtn);
      }

      // אם ראש צוות
      if (currentUserRole === "teamlead") {
        if (isMyProject) {
          const viewTasksBtn = document.createElement("button");
          viewTasksBtn.textContent = "צפה במשימות";
          viewTasksBtn.classList.add("btn-secondary");
          viewTasksBtn.addEventListener("click", () => {
            window.location.href = `../tasks/tasks.html?projectCode=${project.projectCode}`;
          });

          const addTaskBtn = document.createElement("button");
          addTaskBtn.textContent = "הוסף משימה";
          addTaskBtn.classList.add("btn-primary");
          addTaskBtn.addEventListener("click", () => {
            window.location.href = `../tasks/addTasks.html?projectCode=${project.projectCode}`;
          });

          actionsDiv.appendChild(viewTasksBtn);
          actionsDiv.appendChild(addTaskBtn);
        } else if (isUnassigned) {
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
          actionsDiv.appendChild(joinBtn);
        }
      }

      projectsDiv.appendChild(card);
    });
  };

  await loadProjects();
}

initProjectsPage();
