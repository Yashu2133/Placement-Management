import { useEffect, useState } from "react"
import API from "../../api/api"
import DataTable from "../../components/DataTable"

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([])

  const load = async () => {
    const res = await API.get("/companies")
    setCompanies(res.data.data || [])
  }
  useEffect(()=>{ load() }, [])

  const remove = async (id) => {
    if (!confirm("Delete this company?")) return
    await API.delete(`/companies/${id}`)
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Companies</h2>
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "industry", label: "Industry" },
          { key: "website", label: "Website", render: (r)=> r.website ? <a href={r.website} target="_blank" className="text-blue-600">Visit</a> : "-" },
          { key: "contactEmail", label: "Email" },
        ]}
        data={companies}
        actions={(row)=>(
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>remove(row._id)}>Delete</button>
        )}
      />
    </div>
  )
}
