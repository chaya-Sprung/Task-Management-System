import { deleteTask } from "../tasksServise.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#delete-task-btn");
  btn.onclick = async () => {
    const id = prompt("הכנס מזהה משימה למחיקה:");
    if (id) {
      await deleteTask(id);
      alert("נמחק בהצלחה!");
    }
  };
});
