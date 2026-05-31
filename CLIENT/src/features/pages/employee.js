document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); 
  const avatarImg = document.getElementById("avatar");

  if (!token) return;

  try {
    // בקשה לשרת לקבלת פרטי המשתמש
    const resp = await fetch("http://localhost:5000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) throw new Error("Failed to fetch user");

    const user = await resp.json();
    console.log("User data:", user);

    if (!user) throw new Error("User not found");

    // הצגת שם ותפקיד
    document.getElementById("greeting").textContent = `שלום ${user.name}`;
    document.getElementById("role").textContent = `תפקיד: ${user.role}`;

    // 🔥 הצגת תמונת פרופיל
    // אם ב־backend שמרת רק שם קובץ:
 if (user.profileImage) {
  avatarImg.src = `${user.profileImage}?t=${Date.now()}`;
} else {
  avatarImg.src = "default-avatar.png";
}


    // שמירה בלוקל (לא חובה)
    localStorage.setItem("profileImage", avatarImg.src);

    // מעבר בין דפים
    document.getElementById("show-tasks").addEventListener("click", () => {
      window.location.href = "../tasks/tasks.html";
    });

    // document.getElementById("add-record").addEventListener("click", () => {
    //   window.location.href = "../login/register.html";
    // });

  } catch (err) {
    console.error("Error fetching user:", err);
  }
});
