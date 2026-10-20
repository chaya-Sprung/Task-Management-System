# 📋 Task Management System

A robust full-stack, role-based Task and Project Management application built with a **Node.js / Express** REST API, **MongoDB (Mongoose)**, and a modular **HTML5 / CSS3 / JavaScript (ES6)** frontend powered by **Vite**.

---

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Dedicated views, actions, and permissions tailored for **Managers**, **Team Leads**, and **Employees**.
- **Project & Task Management:**
  - Create, view, update, and remove tasks and projects.
  - Track statuses, deadlines, and project lifecycles.
  - Assign tasks and projects to specific team members.
- **Authentication & Security:**
  - Secure user registration and login workflows.
  - Stateless authentication via **JSON Web Tokens (JWT)**.
  - Strong password hashing with **bcrypt**.
  - Request body & parameter validation using **Joi**.
- **Media Uploads:**
  - User profile picture and file attachment handling via **Multer**.
- **Modern Modular Client:**
  - Feature-driven modular layout bundled with **Vite**.
  - Separation of concerns between UI components, styles, and API service layers.

---

## 🛠️ Tech Stack

### Backend (`/SERVER`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & ODM:** MongoDB & Mongoose
- **Authentication:** `jsonwebtoken`, `bcrypt` / `bcryptjs`
- **Validation:** `joi`
- **File Handling:** `multer`
- **Utilities & Middleware:** `cors`, `dotenv`

### Frontend (`/CLIENT`)
- **Build Tool:** Vite
- **Languages:** HTML5, Modern CSS3, JavaScript (ES6 Modules)
- **Architecture:** Feature-based modular structure

---

## 📁 Repository Structure

```text
Task-Management-System/
├── CLIENT/
│   ├── index.html              # Frontend entry point
│   ├── package.json            # Client scripts & dependencies
│   ├── public/                 # Static assets
│   └── src/
│       └── features/
│           ├── login/          # Auth forms (login, register) & userService
│           ├── pages/          # Role views: manager, teamlead, employee
│           ├── projects/       # Projects UI, modals & services
│           └── tasks/          # Tasks UI, modals & services
│
└── SERVER/
    ├── config/
    │   └── db.js               # MongoDB connection logic
    ├── controllers/            # Route controllers (auth, projects, tasks, users)
    ├── middlewares/            # Auth, RBAC, error handling, validation, multer
    ├── models/                 # Mongoose schemas (User, Task, Project)
    ├── createAdmin.js          # Admin seed script
    ├── index.js                # Server entry point
    └── package.json            # Server scripts & dependencies
⚙️ Getting StartedPrerequisitesNode.js (v16+ recommended)A running MongoDB instance (locally or via MongoDB Atlas)1. Backend Setup (/SERVER)Open your terminal and navigate to the server folder:Bashcd SERVER
Install backend dependencies:Bashnpm install
Create a .env file in the SERVER/ root directory:קטע קודPORT=5000
MONGO_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_super_secret_jwt_key
(Optional) Seed an initial admin user:Bashnode createAdmin.js
Start the backend server:Bashnpm start
Server runs on: http://localhost:50002. Frontend Setup (/CLIENT)Open a new terminal tab and navigate to the client directory:Bashcd CLIENT
Install frontend dependencies:Bashnpm install
Start the Vite development server:Bashnpm run dev
Client runs on: http://localhost:5173 (or the port specified by Vite)🔒 Roles & Access ControlRolePermissionsManagerFull system access: manage users, create/edit projects, and assign leads.Team LeadManage assigned projects, create tasks, and delegate tasks to team members.EmployeeView assigned tasks, update completion status, and track deadlines.📄 LicenseThis project is open-source and available under the MIT License.
