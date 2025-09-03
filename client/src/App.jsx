import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProtectedRoute from "./routes/ProtectedRoute"

import StudentDashboard from "./pages/student/Dashboard"
import StudentProfile from "./pages/student/Profile"
import StudentJobs from "./pages/student/Jobs"
import StudentApplications from "./pages/student/Applications"
import StudentInterviews from "./pages/student/Interviews"

import CompanyDashboard from "./pages/company/Dashboard"
import CompanyPostJob from "./pages/company/PostJob"
import CompanyApplicants from "./pages/company/Applicants"
import CompanyInterviews from "./pages/company/Interviews"
import CompanyProfile from "./pages/company/CompanyProfile";

import AdminDashboard from "./pages/admin/Dashboard"
import ManageStudents from "./pages/admin/ManageStudents"
import ManageCompanies from "./pages/admin/ManageCompanies"
import Reports from "./pages/admin/Reports"
import JobsApproval from "./pages/admin/JobsApproval";
import AllApplications from "./pages/admin/AllApplications";
import AdminUsers from "./pages/admin/AdminUsers";

import Notifications from "./pages/common/Notifications"
import NotFound from "./pages/common/NotFound"

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="jobs" element={<StudentJobs />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="interviews" element={<StudentInterviews />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Company */}
      <Route element={<ProtectedRoute role="company" />}>
        <Route path="/company" element={<CompanyDashboard />}>
          <Route index element={<Navigate to="post-job" />} />
          <Route path="post-job" element={<CompanyPostJob />} />
          <Route path="applicants" element={<CompanyApplicants />} />
          <Route path="interviews" element={<CompanyInterviews />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="students" />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="companies" element={<ManageCompanies />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="/admin/jobs" element={<JobsApproval />} />
          <Route path="/admin/applications" element={<AllApplications />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
