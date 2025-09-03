import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { NotifyAPI } from "../api/api"
import { Link } from "react-router-dom"

export default function NotificationBell() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  const load = async () => {
    if (!user) return
    const res = await NotifyAPI.get(`/${user._id || user.id}`)
    const unread = res.data.filter((n) => !n.isRead).length
    setCount(unread)
  }

  useEffect(() => { load() }, [user])

  return (
    <Link to={`/${user?.role}/notifications`} className="relative">
      <span className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 rounded-full">🔔</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
          {count}
        </span>
      )}
    </Link>
  )
}
