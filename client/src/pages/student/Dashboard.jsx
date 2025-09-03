import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { Outlet, NavLink } from "react-router-dom"

export default function StudentDashboard() {
  const links = [
    { to: "/student/profile", label: "Profile" },
    { to: "/student/jobs", label: "Jobs" },
    { to: "/student/applications", label: "My Applications" },
    { to: "/student/interviews", label: "Interviews" },
    { to: "/student/notifications", label: "Notifications" },
  ]

  return (
    <div className="flex">
      <Sidebar links={links} title="Student" />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <div className="p-6">
          <Outlet />
          <div className="mt-10 text-sm text-gray-500">
            Quick links:{" "}
            {links.map(l=>(
              <NavLink key={l.to} to={l.to} className="text-blue-600 mr-3">{l.label}</NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
