import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Applicants() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/applications/company");
      setApps(res.data.data);
    } catch (err) {
      console.error("Failed to load applicants", err);
    }
  };

  const updateStatus = async (id, status, interviewDate=null) => {
    try {
      await API.put(`/applications/${id}/status`, { status, interviewDate });
      load();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Applicants</h2>
      {apps.length === 0 && <p>No applicants yet</p>}
      <ul className="space-y-3">
        {apps.map(app => (
  <li key={app._id} className="border p-3 rounded-lg shadow">
    <p><b>Student:</b> {app.studentId?.name}</p>
    <p><b>Job:</b> {app.jobId?.title}</p>
    <p><b>Status:</b> {app.status}</p>
    <div className="flex space-x-2 mt-2">
  <button
  onClick={() => updateStatus(app._id, "shortlisted")}
  disabled={app.status !== "submitted"}
  className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
>  Shortlist</button>
<button
  onClick={() => updateStatus(app._id, "rejected")}
  disabled={app.status !== "submitted"}
  className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
>Reject</button>
</div>
 </li>
))}
      </ul>
    </div>
  );
}
