import { useAuth } from "../context/AuthContext"
import NotificationBell from "./NotificationBell"

export default function Navbar() {
  const { logout, user } = useAuth()
  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Placement Portal</h1>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="text-sm">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-gray-500">{user?.role}</div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
