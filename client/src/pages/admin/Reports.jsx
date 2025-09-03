import { useEffect, useState } from "react"
import API from "../../api/api"
import Charts from "../../components/Charts"
import DataTable from "../../components/DataTable"

export default function Reports() {
  const [summary, setSummary] = useState({ totalApplications:0, totalInterviews:0, totalHires:0, trendByMonth:[] })
  const [drives, setDrives] = useState([])

  const load = async () => {
    const sum = await API.get("/reports/summary")
    setSummary(sum.data.data)
    const drv = await API.get("/placements")
    setDrives(drv.data.data || [])
  }
  useEffect(()=>{ load() }, [])

  const generate = async (driveId) => {
    await API.post(`/reports/drive/${driveId}/generate`)
    alert("Drive report generated/updated")
  }

  const chartData = (summary.trendByMonth || []).map(it => ({
    label: `${it._id.m}/${it._id.y}`, count: it.count
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-gray-500">Total Applications</div>
          <div className="text-3xl font-bold text-blue-600">{summary.totalApplications}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-gray-500">Total Interviews</div>
          <div className="text-3xl font-bold text-blue-600">{summary.totalInterviews}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="text-gray-500">Total Hires</div>
          <div className="text-3xl font-bold text-blue-600">{summary.totalHires}</div>
        </div>
      </div>

      <Charts title="Applications Trend (by month)" data={chartData} />

      <div>
        <h3 className="text-lg font-semibold mb-3">Generate Drive Reports</h3>
        <DataTable
          columns={[
            { key: "title", label: "Drive" },
            { key: "date", label: "Date", render: (r)=> new Date(r.date).toDateString() }
          ]}
          data={drives}
          actions={(row)=>(
            <button onClick={()=>generate(row._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Generate</button>
          )}
        />
      </div>
    </div>
  )
}
