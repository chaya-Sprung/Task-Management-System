📋 Task Management System

A full-stack, role-based Task and Project Management System built with a Node.js/Express REST API backend, MongoDB (Mongoose) database, and a modular HTML/CSS/JavaScript client bundled with Vite.

🚀 Overview & Key Features

Role-Based Access Control (RBAC): Dedicated views and permissions for Managers, Team Leads, and Employees.

Project & Task Lifecycle Management:

Create, view, update, and delete tasks.

Create and manage project lifecycles.

Assign tasks and projects to team members.

Authentication & Security:

Secure registration and login workflows.

JSON Web Tokens (JWT) for stateless session handling and protected API routes.

Password hashing with bcrypt / bcryptjs.

Schema-level data validation via Joi.

Media Uploads:

Profile avatar upload support using multer.

Modular Frontend:

Modern client architecture with Vite.

Decoupled feature modules for login, projects, tasks, and role-based views.

🛠️ Tech Stack

Backend (/SERVER)

Runtime: Node.js

Framework: Express.js

Database & ODM: MongoDB with Mongoose

Authentication: jsonwebtoken & bcrypt

Validation: Joi

File Uploads: Multer

Logging & Utilities: Morgan, Cors, Dotenv

Frontend (/CLIENT)

Bundler / Dev Server: Vite

Core Languages: HTML5, CSS3, JavaScript (ES6 Modules)

Structure: Feature-driven modular layout (Login/Register, Projects, Tasks, Role pages)
📁 Repository Structure
Task-Management-System/
├── CLIENT/                     # Client application (Vite-based)
│   ├── index.html              # Frontend entry point
│   ├── package.json            # Client scripts & dependencies
│   ├── public/                 # Static assets
│   └── src/
│       └── features/
│           ├── login/          # Auth forms (login, register) & userService
│           ├── pages/          # Role views: manager, teamlead, employee
│           ├── projects/       # Projects UI & services
│           └── tasks/          # Tasks UI, modal dialogs & services
│
└── SERVER/                     # Node.js REST API
    ├── config/
    │   └── db.js               # MongoDB connection logic
    ├── controllers/            # Route business logic (auth, tasks, projects, users)
    ├── middlewares/            # Auth, role check, error handler, file upload, Joi validation
    ├── models/                 # Mongoose schemas (User, Task, Project)
    ├── routers/                # Express API route declarations
    ├── uploads/                # Stored media files (avatars, attachments)
    ├── .env                    # Environment variables (secret/config)
    ├── index.js                # Server entry point
    └── package.json            # Backend scripts & dependencies
⚙️ Getting Started

Prerequisites

Node.js (v16+ recommended)

MongoDB running locally or a MongoDB Atlas connection URI.

1. Server Configuration & Setup

Open a terminal and navigate to the SERVER folder:

cd SERVER


Install backend dependencies:

npm install


Configure environment variables:
Create a .env file inside the SERVER/ directory with the following variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_super_secret_jwt_key


(Optional) Seed initial admin user:

node createAdmin.js


Start the backend server:

npm start
# or with nodemon if configured:
npm run dev


The backend will be available at: http://localhost:5000
⚙️ Getting Started

Prerequisites

Node.js (v16+ recommended)

MongoDB running locally or a MongoDB Atlas connection URI.

1. Server Configuration & Setup

Open a terminal and navigate to the SERVER folder:

cd SERVER


Install backend dependencies:

npm install


Configure environment variables:
Create a .env file inside the SERVER/ directory with the following variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_super_secret_jwt_key


(Optional) Seed initial admin user:

node createAdmin.js


Start the backend server:

npm start
# or with nodemon if configured:
npm run dev


The backend will be available at: http://localhost:5000
