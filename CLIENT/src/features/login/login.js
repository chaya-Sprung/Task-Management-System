document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorDiv = document.getElementById("error");

  async function loginUser(credentials) {
    try {
      const resp = await axios.post("http://localhost:5000/auth/login", credentials);
      return resp.data; // מחזיר { token, user }
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    const userData = await loginUser(credentials);

    if (!userData || !userData.user) {
      errorDiv.textContent = "התחברות נכשלה. בדוק אימייל וסיסמה";
      return;
    }

    const user = userData.user;

    // שמירת token ופרטי משתמש ב-localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(user));

    // אם יש תמונה, שמרי גם את הנתיב שלה
    localStorage.setItem(
      "profileImage",
      user.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : "default-avatar.png"
    );

    // ניווט לפי תפקיד
    if (user.role === "Manager") {
      window.location.href = "../pages/manager.html";
    } else if (user.role === "TeamLead") {
      window.location.href = "../pages/teamlead.html";
    } else {
      window.location.href = "../pages/employee.html";
    }
  });
});

//o
// console.log("User data after login:", userData);
console.log("Token saved:", localStorage.getItem("token"));
console.log("Profile image:", localStorage.getItem("profileImage"));
