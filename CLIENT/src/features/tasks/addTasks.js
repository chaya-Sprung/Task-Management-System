import { addTask } from "./tasksServise.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM מוכן ✅");

  const form = document.querySelector("#addTaskForm");
  if (!form) {
    console.error("❌ הטופס עם id='addTaskForm' לא נמצא!");
    return;
  }
  console.log("טופס נמצא ✅");

  const urlParams = new URLSearchParams(window.location.search);
  const projectCodeFromUrl = urlParams.get("projectCode") || "003";
  const projectCodeInput = document.getElementById("projectCode");
  const teamCodeInput = document.getElementById("groupCode");

  projectCodeInput.value = projectCodeFromUrl;
  projectCodeInput.readOnly = true;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("submit נלחץ ✅");

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("❌ יש להתחבר לפני הוספת משימות");
      return;
    }

    const user = JSON.parse(userStr);

    // אם אין _id, צור אותו מה־id
    if (!user._id) {
      user._id = user.id;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("🟢 _id נוסף למשתמש:", user._id);
    }

    // ודא שיש groupCode
    console.log("🧠 בדיקת groupCode...");
    console.log("user.groupCode לפני:", user.groupCode);
    console.log("teamCodeInput:", teamCodeInput);
    console.log(
      "teamCodeInput.value:",
      teamCodeInput ? teamCodeInput.value : "❌ אין אלמנט עם id='groupCode'"
    );

    if (!user.groupCode) {
      if (teamCodeInput && teamCodeInput.value) {
        user.groupCode = teamCodeInput.value;
        localStorage.setItem("user", JSON.stringify(user));
        console.log("🟢 groupCode נוסף למשתמש:", user.groupCode);
      } else {
        alert(
          "❌ קוד צוות חסר. עדכן את המשתמש או התחבר מחדש."
        );
        console.log("🚨 תנאי נכשל — אין teamCodeInput או שהvalue ריק");
        return;
      }
    } else {
      console.log("✅ למשתמש כבר יש groupCode:", user.groupCode);
    }

    // הכנת הנתונים לשליחה
    const newTask = {
      taskCode:
        Number(document.querySelector("#taskCode").value) || Date.now(),
      date: document.querySelector("#date").value
        ? new Date(document.querySelector("#date").value)
        : new Date(),
      title: document.querySelector("#title").value,
      content: document.querySelector("#content").value,
      status: document.querySelector("#status").value,
      groupCode: user.groupCode,
      createdBy: String(user._id), // ✅ חשוב: שולח כ-string כדי לעבור את Joi
      assignedTo: null,
      projectCode: projectCodeInput.value
    };

    // 🔍 בדיקה לפני שליחה
    console.log("📦 נשלח לשרת:", JSON.stringify(newTask, null, 2));
    console.log("Token ב-localStorage:", localStorage.getItem("token"));
console.log("📝 user._id לפני שליחה:", user._id);

 try {
  const result = await addTask(newTask);
  console.log("תגובה מהשרת:", result);
  alert("✅ המשימה נוספה בהצלחה!");
  form.reset();
  projectCodeInput.value = projectCodeFromUrl;
} catch (error) {
  console.error("❌ שגיאה בהוספת משימה:", error);
  if (error.response && error.response.data) {
    console.log("Joi validation error:", error.response.data);
  }
  alert(
    "❌ שגיאה בהוספת משימה. בדוק את השדות או התחבר מחדש"
  );
}

  });

});

const profileImg = document.getElementById("profile-img");
const userName = document.getElementById("user-name");

fetch("http://localhost:5000/auth/me", {
  headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
})
.then(res => res.json())
.then(data => {
  userName.textContent = `${data.name}`;
  profileImg.src = data.profileImage || "default-avatar.png";
})
.catch(err => console.error(err));
