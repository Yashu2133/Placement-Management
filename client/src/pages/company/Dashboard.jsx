import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Outlet, NavLink } from "react-router-dom";

export default function CompanyDashboard() {
  const links = [
    { to: "/company/post-job", label: "Post Job" },
    { to: "/company/applicants", label: "Applicants" },
    { to: "/company/interviews", label: "Interviews" },
    { to: "/company/notifications", label: "Notifications" },
    { to: "/company/profile", label: "Update Profile" }, // <-- added this
  ];

  return (
    <div className="flex">
      <Sidebar links={links} title="Company" />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <div className="p-6">
          <Outlet />
          <div className="mt-10 text-sm text-gray-500">
            Quick links:{" "}
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="text-blue-600 mr-3 hover:underline"
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
