import { useEffect, useState } from "react"
import API from "../../api/api"
import DataTable from "../../components/DataTable"

export default function Interviews() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({
    job: "",
    candidate: "",
    interviewDate: "",
    interviewType: "Online",
    platform: "Google Meet",
    meetingLink: "",
    location: ""
  })
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])

  const load = async () => {
    try {
      const res = await API.get("/interviews")
      setList(res.data.data || [])

      const jobsRes = await API.get("/jobs")
      setJobs(jobsRes.data.data || [])

      const appsRes = await API.get("/applications/company")
      const uniq = []
      const seen = new Set()
      for (const a of (appsRes.data.data || [])) {
        if (a.status === "shortlisted") {
          const id = a.studentId?._id || a.studentId || a._id
          const name = a.studentId?.name || a.studentId?.user?.name || "Candidate"
          if (id && !seen.has(String(id))) {
            seen.add(String(id))
            uniq.push({ id, name })
          }
        }
      }
      setCandidates(uniq)
    } catch (err) {
      console.error("Load interviews error:", err)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        jobId: form.job,          
        studentId: form.candidate,
        startTime: form.interviewDate ? new Date(form.interviewDate) : undefined,
        interviewType: form.interviewType,
        platform: form.platform,
        meetingLink: form.meetingLink,
        location: form.location
      }
      const res = await API.post("/interviews", payload)
      if (res.data.success) {
        alert("Interview created")
        setForm({
          job:"", candidate:"", interviewDate:"", interviewType:"Online",
          platform:"Google Meet", meetingLink:"", location:""
        })
        await load()
      }
    } catch (e) {
      console.error(e)
      if (e.response?.data?.message) {
        alert(e.response.data.message)
      } else {
        alert("Failed to create")
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Interviews</h2>

      <form onSubmit={create} className="bg-white rounded-xl shadow p-5 grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <select className="border p-2 rounded" value={form.job} onChange={e=>setForm({...form, job:e.target.value})}>
          <option value="">Select Job</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>

        <select className="border p-2 rounded" value={form.candidate} onChange={e=>setForm({...form, candidate:e.target.value})}>
          <option value="">Select Candidate</option>
          {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input
          className="border p-2 rounded"
          type="datetime-local"
          value={form.interviewDate}
          onChange={e=>setForm({...form, interviewDate:e.target.value})}
        />

        <select className="border p-2 rounded" value={form.interviewType} onChange={e=>setForm({...form, interviewType:e.target.value})}>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>

        {form.interviewType === "Offline" && (
          <input className="border p-2 rounded md:col-span-2" placeholder="Location"
                 value={form.location || ""}
                 onChange={e=>setForm({...form, location:e.target.value})}/>
        )}

        {(form.interviewType === "Online" || form.interviewType === "Hybrid") && (
          <>
            <input className="border p-2 rounded" placeholder="Platform (Zoom/Google Meet/Teams)"
                   value={form.platform}
                   onChange={e=>setForm({...form, platform:e.target.value})}/>
            <input className="border p-2 rounded md:col-span-2" placeholder="Meeting Link"
                   value={form.meetingLink}
                   onChange={e=>setForm({...form, meetingLink:e.target.value})}/>
          </>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-1">Create</button>
      </form>

      <DataTable
        columns={[
          { key: "job", label: "Job", render: (r)=> r.job?.title || "-" },
          { key: "candidate", label: "Candidate", render: (r)=> r.candidate?.name || "-" },
          { key: "startTime", label: "Date & Time", render: (r)=> r.startTime ? new Date(r.startTime).toLocaleString() : "-" },
          { key: "interviewType", label: "Type" },
          { key: "platform", label: "Platform" },
          { key: "location", label: "Location", render: (r)=> r.interviewType === "Offline" ? (r.location || "N/A") : "-" },
          { key: "status", label: "Status" },
        ]}
        data={list}
        actions={(r) => (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await API.put(`/interviews/${r._id}/hire`);
                  alert("Candidate hired");
                  load();
                } catch (e) {
                  alert(e.response?.data?.message || "Hire failed");
                }
              }}
              disabled={r.result === "Hired"}
              className={`px-3 py-1 rounded ${r.result === "Hired" ? "bg-gray-400" : "bg-green-600 text-white"}`}
            >
              {r.result === "Hired" ? "Hired" : "Hire"}
            </button>

            <button
              onClick={async () => {
                try {
                  await API.put(`/interviews/${r._id}/reject`);
                  alert("Candidate rejected");
                  load();
                } catch (e) {
                  alert(e.response?.data?.message || "Reject failed");
                }
              }}
              disabled={r.result === "Rejected"}
              className={`px-3 py-1 rounded ${r.result === "Rejected" ? "bg-gray-400" : "bg-red-600 text-white"}`}
            >
              {r.result === "Rejected" ? "Rejected" : "Reject"}
            </button>
          </div>
        )}
      />
    </div>
  )
}
