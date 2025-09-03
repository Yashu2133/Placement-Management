import { useEffect, useState } from "react";
import API from "../../api/api";

export default function JobsApproval() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const res = await API.get("/jobs");
    if (res.data.success) setJobs(res.data.data);
  };

  useEffect(() => { loadJobs(); }, []);

  const handleStatus = async (id, status) => {
    try {
      const url = status === "approved" ? `/jobs/approve/${id}` : `/jobs/reject/${id}`;
      await API.put(url);
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Jobs Pending Approval</h2>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Company</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{job.title}</td>
                <td className="p-3 border-b">{job.company?.name}</td>
                <td className="p-3 border-b capitalize">{job.status}</td>
                <td className="p-3 border-b text-center">
                  {job.status === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleStatus(job._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(job._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-sm font-medium 
                      bg-gray-200 text-gray-700">
                      {job.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
