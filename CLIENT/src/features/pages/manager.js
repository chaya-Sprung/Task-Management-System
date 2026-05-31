document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const avatarImg = document.getElementById("avatar");

  if (!token) return;

  try {
    const resp = await fetch("http://localhost:5000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) throw new Error("Failed to fetch user");

    const user = await resp.json();
    if (!user) throw new Error("User not found");

    // הצגת שם ותפקיד
    document.getElementById("greeting").textContent = `שלום ${user.name}`;
    document.getElementById("role").textContent = `תפקיד: ${user.role}`;

    // טעינת תמונת פרופיל – כאן פשוט קובץ קבוע
    avatarImg.src = "http://localhost:5000/uploads/shifi.jpg?t=" + Date.now(); // מונע קאשינג

    // מאזינים לכפתורים
    document.getElementById("add-record").onclick = () => {
      window.location.href = "../login/register.html";
    };
    document.getElementById("show-project").onclick = () => {
      window.location.href = "../projects/projects.html";
    };
    document.getElementById("add-project").onclick = () => {
      window.location.href = "../projects/addProject.html";
    };

  } catch (err) {
    console.error("Error fetching user:", err);
  }
});
