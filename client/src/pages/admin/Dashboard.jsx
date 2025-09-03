import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import ManageUsersButton from "../../components/ManageUsersButton"
import { Outlet, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function AdminDashboard() {
  const { user, token } = useAuth()

  const links = [
    { to: "/admin/students", label: "Manage Students" },
    { to: "/admin/companies", label: "Manage Companies" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/notifications", label: "Notifications" },
    { to: "/admin/jobs", label: "Approve Jobs" },
    { to: "/admin/applications", label: "All Applications" }
  ]

  return (
    <div className="flex">
      <Sidebar links={links} title="Admin" />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <div className="p-6">
          {user?.isSuperAdmin && (
            <div className="mb-6">
              <ManageUsersButton />
            </div>
          )}
          <Outlet />
          <div className="mt-10 text-sm text-gray-500">
            Quick links:{" "}
            {links.map(l => (
              <NavLink key={`quick-${l.to}`} to={l.to} className="text-blue-600 mr-3">
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
