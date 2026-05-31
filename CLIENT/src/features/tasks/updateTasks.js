import { updateTask } from "./tasksServise.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#update-task-btn");
  btn.onclick = async () => {
    const id = prompt("הכנס מזהה משימה לעדכון:");
    if (!id) return;

    const newStatus = prompt("הכנס סטטוס חדש (open, in-progress, done):");
    if (!newStatus) return;

    const updated = await updateTask(id, { status: newStatus });
    console.log("עודכנה משימה:", updated);
    alert("עודכן בהצלחה!");
  };
});
