import { useEffect, useState } from "react"
import API from "../../api/api"
import DataTable from "../../components/DataTable"

export default function ManageStudents() {
  const [students, setStudents] = useState([])

  const load = async () => {
    const res = await API.get("/students")
    setStudents(res.data.data || res.data || [])
  }
  useEffect(()=>{ load() }, [])

  const remove = async (id) => {
    if (!confirm("Delete this student?")) return
    await API.delete(`/students/${id}`)
    await load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "rollNo", label: "Roll" },
          { key: "department", label: "Dept" },
          { key: "cgpa", label: "CGPA" },
        ]}
        data={students}
        actions={(row)=>(
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={()=>remove(row._id)}>Delete</button>
        )}
      />
    </div>
  )
}
