import { NavLink } from "react-router-dom"

export default function Sidebar({ links, title="Dashboard" }) {
  return (
    <div className="min-h-screen w-64 bg-blue-700 text-white p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg ${isActive ? "bg-blue-900 font-semibold" : "hover:bg-blue-600"}`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
