import axios from "axios";

const url = "http://localhost:5000/auth"; // כתובת ה-API שלך

// ---------------------
// התחברות
// ---------------------
export const loginUser = async (credentials) => {
  try {
    const resp = await axios.post(`${url}/login`, credentials, {
      withCredentials: true, // אם משתמשים ב-Cookies
    });
    return resp.data; // { token, user }
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error);
    return null;
  }
};

// ---------------------
// הרשמה עם תמונה
// ---------------------
export const registerUser = async (userData, isFormData = false) => {
  try {
    const config = isFormData
      ? { headers: { Accept: "application/json" }, withCredentials: true }
      : { withCredentials: true };

    const resp = await axios.post(`${url}/register`, userData, config);
    return resp.data; // החזרת user שנוצר
  } catch (error) {
    console.error(
      "Error registering user:",
      JSON.stringify(error.response?.data, null, 2)
    );
    return null;
  }
};
