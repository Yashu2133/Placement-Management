## 🏢 Placement Management System

A full-stack web application for managing college placement processes. Built using Node.js, Express, MongoDB, React, Vite, and TailwindCSS, this system supports role-based access for students, companies, and administrators, including a super-admin for initial setup.

---

##  🚀 Features

1. Common Features:
- **Role-based authentication using JWT (student, company, admin, super-admin).**
- **Real-time notifications for interviews, applications, and status updates.**
- **Email notifications for key actions (interview scheduling, password reset, placement updates).**
- **Responsive and modern UI using TailwindCSS.**
- **Analytics dashboard with charts for applications, interviews, and hires.**

2. Student Features:
- **Browse jobs and apply online.**
- **Track application status: submitted → shortlisted → interview scheduled → hired/rejected.**
- **View scheduled interviews and results.**
- **Manage and update profile details.**

3. Company Features:
- **Post, edit, and manage job listings.**
- **Review student applications and shortlist candidates.**
- **Schedule interviews with candidates and track interview results.**
- **Generate reports for job openings and placement drives.**

4. Admin & Super-Admin Features:
- **Manage students, companies, and job listings.**
- **Assign roles and approve company registrations.**
- **Generate placement drive reports and overall analytics.**
- **Super-admin can seed initial admin account (seedAdmin.js).**

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React, Vite, TailwindCSS
- **Authentication**: JWT
- **Email Notifications**: Nodemailer
- **Charts & Analytics**: Recharts
- **Deployment**: Render (backend), Netlify (frontend)
- **Utilities**: dotenv, cookie-parser, helmet, express-rate-limit, CORS

---

## 📁 Folder Structure

- **Frontend (client)**

```
client/
├── public/                       # Static assets (images, favicon, etc.)
│
├── src/
│   ├── api/                      # Axios instances for API & Notifications
│   │   └── api.js
│   │
│   ├── assets/                   # Images or static resources
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Charts.jsx
│   │   ├── DataTable.jsx
│   │   ├── FileUpload.jsx
│   │   ├── ManageUsersButton.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── context/                  # React Context (Auth)
│   │   └── AuthContext.jsx
│   │
│   ├── pages/                     # Role-based pages
│   │   ├── admin/
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AllApplications.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobsApproval.jsx
│   │   │   ├── ManageCompanies.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── company/
│   │   │   ├── Applicants.jsx
│   │   │   ├── CompanyProfile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Interviews.jsx
│   │   │   └── PostJob.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── Applications.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Interviews.jsx
│   │   │   ├── Jobs.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   └── common/
│   │       ├── NotFound.jsx
│   │       └── Notifications.jsx
│   │
│   ├── routes/                   # Protected routing
│   │   └── ProtectedRoute.jsx
│   │
│   ├── utils/                    # Helper functions
│   │   └── formatdate.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

```

- **Backend (server)**

```
server/
├── controllers/                 # Business logic for APIs
│   ├── applicationController.js
│   ├── authController.js
│   ├── companyController.js
│   ├── interviewController.js
│   ├── jobController.js
│   ├── notificationController.js
│   ├── placementController.js
│   ├── reportController.js
│   └── studentController.js
│
├── middleware/                  # Authentication & error handling
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── models/                      # MongoDB schemas
│   ├── Application.js
│   ├── Company.js
│   ├── Interview.js
│   ├── Job.js
│   ├── Notification.js
│   ├── PlacementDrive.js
│   ├── Report.js
│   ├── Student.js
│   └── User.js
│
├── routes/                      # API route definitions
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   ├── interviewRoutes.js
│   ├── jobRoutes.js
│   ├── notificationRoutes.js
│   ├── placementRoutes.js
│   ├── reportRoutes.js
│   └── studentRoutes.js
│
├── uploads/                      # File storage for resumes or documents
│
├── utils/                        # Helpers and utilities
│   ├── config.js                 # Environment variables
│   ├── errorRoute.js             # 404 fallback route
│   ├── logger.js                 # Request logger middleware
│   ├── sendEmail.js              # Email helper
│   └── upload.js                 # File upload helper
│
├── seedAdmin.js                  # Script to create initial super-admin
├── app.js                        # Express app setup
├── server.js                     # Server entry point
├── package.json
├── package-lock.json
└── README.md

```
---

## 🌐  Live Demo

- **Frontend (Netlify): https://ry-placements.netlify.app**
- **Backend (Render): https://placement-management-z98g.onrender.com**

---

## 📝 How to Run Locally

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd Placement-Management
   ```
---

2. **Install dependencies for both frontend and backend**

   ```bash
   npm install
   ```
---

3. **Create .env file inside server/ with your environment variables**

```bash
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/password-reset
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
---
4. **Start the server**

```bash
npm run dev
```

---

## 📌 Note

A **Super Admin** account is automatically seeded into the database when the backend starts for the first time.  
This account is special because:
- Admins **cannot** be created through normal registration (only **Students** and **Companies** can register).
- The Super Admin is responsible for **system-level tasks** such as:
  - Approving or rejecting company registrations.
  - Managing students, companies, jobs, and interviews.
  - Generating placement reports and overall statistics.
  - Promoting existing users (students or company representatives) to **Admin role**.
- ⚠️ No new admins can be directly created — they must be promoted by the **Super Admin**.

---
- **Super Admin**
- **Email: admin@gmail.com**
- **Password: 123456**
  

-⚠️ Do not delete this account, as it is required for accessing the admin dashboard and managing the system.

---

## 📝 Sample accounts for company,student and admin

- **Student**
- **Email: perumal@gmail.com**
- **Password: 123456**

---

- **Company**
- **Email: guvi@gmail.com**
- **Password: 123456**

- **Admin**
- **Email: superuser@gmail.com**
- **Password: 123456**

---

## 🔗 GitHub Link

**https://github.com/Yashu2133/Placement-Management**

---


