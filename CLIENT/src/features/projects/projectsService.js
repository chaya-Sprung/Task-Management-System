// projectsService.js
import axios from "axios";

const url = "http://localhost:5000/projects"; // API של פרויקטים

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

// GET לפי מזהה פרויקט
export const getProjectById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.get(`${url}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
};

// POST – יצירת פרויקט חדש
export const addProject = async (project) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.post(url, project, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// PUT – עדכון פרויקט
export const updateProject = async (id, updatedFields) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.put(`${url}/${id}`, updatedFields, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};

// DELETE – מחיקת פרויקט
export const deleteProject = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await axios.delete(`${url}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    return null;
  }
};
