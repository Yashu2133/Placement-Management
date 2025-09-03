import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { NotifyAPI } from "../../api/api"

export default function Notifications() {
  const { user } = useAuth()
  const [list, setList] = useState([])

  const load = async () => {
    if (!user) return
    const res = await NotifyAPI.get(`/${user._id || user.id}`)
    setList(res.data || [])
  }
  useEffect(()=>{ load() }, [user])

  const mark = async (id) => {
    await NotifyAPI.patch(`/${id}/read`)
    await load()
  }

  const del = async (id) => {
    await NotifyAPI.delete(`/${id}`)
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div className="space-y-2">
        {list.map(n=>(
          <div key={n._id} className={`bg-white rounded-lg shadow p-4 flex justify-between items-center ${n.isRead ? "opacity-70" : ""}`}>
            <div>
              <div className="font-semibold">{n.type}</div>
              <div className="text-sm text-gray-700">{n.message}</div>
              <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              {!n.isRead && <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={()=>mark(n._id)}>Mark read</button>}
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>del(n._id)}>Delete</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-gray-500">No notifications</div>}
      </div>
    </div>
  )
}
