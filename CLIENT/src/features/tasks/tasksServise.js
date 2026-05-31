// tasksService.js
import axios from "axios";

const API_URL = "http://localhost:5000";

// פונקציה להחזיר headers עם token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");
  return { Authorization: `Bearer ${token}` };
};

// --- קבלת משימות ---
// אם יש projectCode = TeamLead, אחרת Employee
export const getTasks = async ({ projectCode = null } = {}) => {
  try {
    let url = `${API_URL}/tasks`;
    if (projectCode) {
      url += `/project?projectCode=${projectCode}`;
    } else {
      url += `/team`;
    }

    console.log("Fetching tasks from URL:", url); // בדיקה
    const resp = await axios.get(url, {
      headers: getAuthHeader()
    });

    return resp.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};

// --- שאר הפונקציות ---
// הוספה, עדכון, מחיקה
export const addTask = async (taskData) => {
  const resp = await axios.post(`${API_URL}/tasks`, taskData, {
    headers: getAuthHeader()
  });
  return resp.data;
};

export const updateTask = async (id, updatedFields) => {
  const resp = await axios.put(`${API_URL}/tasks/${id}`, updatedFields, {
    headers: getAuthHeader()
  });
  return resp.data;
};

export const deleteTask = async (id) => {
  const resp = await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeader()
  });
  return resp.data;
};


// export async function getAllTasks() {
//   return [
//     { _id: 1, title: "לקנות חלב", content: "מהמכולת", status: "open", date: new Date() },
//     { _id: 2, title: "להכין שיעורים", content: "מתמטיקה", status: "in-progress", date: new Date() },
//     { _id: 3, title: "לנקות חדר", content: "", status: "done", date: new Date() }
//   ];
// }

// export async function updateTask(id, data) {
//   console.log("עדכון משימה", id, data);
//   return true;
// }

// export async function deleteTask(id) {
//   console.log("מחיקת משימה", id);
//   return true;
// }


