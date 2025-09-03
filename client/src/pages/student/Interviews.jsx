import { useEffect, useState } from "react"
import API from "../../api/api"
import DataTable from "../../components/DataTable"
import { useAuth } from "../../context/AuthContext"

export default function Interviews() {
  const [list, setList] = useState([])
  const { user } = useAuth()

  const load = async () => {
    const res = await API.get("/interviews")
    const all = res.data.data || []
    // Filter to my interviews by candidate id if present
    const my = all.filter(i => (i.candidate?._id || i.candidate) === (user._id || user.id))
    setList(my)
  }

  useEffect(()=>{ if (user) load() }, [user])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Interviews</h2>
      <DataTable
        columns={[
          { key: "job", label: "Job", render: (r)=> r.job?.title || "-" },
          { key: "interviewDate", label: "Date", render: (r)=> r.interviewDate ? new Date(r.interviewDate).toLocaleDateString() : "-" },
          { key: "startTime", label: "Start", render: (r)=> r.startTime ? new Date(r.startTime).toLocaleTimeString() : "-" },
          { key: "interviewType", label: "Type" },
          { key: "platform", label: "Platform" },
          { key: "meetingLink", label: "Link", render: (r)=> r.meetingLink ? <a className="text-blue-600" href={r.meetingLink} target="_blank">Join</a> : "-" },
          { key: "status", label: "Status" },
        ]}
        data={list}
      />
    </div>
  )
}
