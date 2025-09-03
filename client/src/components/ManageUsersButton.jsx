import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ManageUsersButton() {
  const nav = useNavigate()
  const { user, token } = useAuth()

  const goToUsers = () => {
    if (!token) {
      alert("Unauthorized! Please login again.")
      return
    }
    nav("/admin/users")
  }

  if (!user?.isSuperAdmin) return null

  return (
    <button
      onClick={goToUsers}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
    >
      Manage Users
    </button>
  )
}
