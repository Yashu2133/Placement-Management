import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("Failed to load applications", err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Applications</h2>
      {applications.length === 0 && <p>No applications yet</p>}
      <ul className="space-y-3">
        {applications.map(app => (
          <li key={app._id} className="border p-3 rounded-lg shadow">
            <p><b>Job:</b> {app.jobId?.title}</p>
            <p><b>Company:</b> {app.jobId?.company?.name}</p>
            <p><b>Status:</b> {app.status}</p>
            {app.interviewDate && <p><b>Interview:</b> {new Date(app.interviewDate).toLocaleString()}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
