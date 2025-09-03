import { useEffect, useState } from "react";
import API from "../../api/api";

export default function AllApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/applications");
        setApps(res.data.data || []);
      } catch (err) {
        console.error("Failed to load applications", err);
      }
    };
    load();
  }, []);

  const formatStatus = (status) => {
    if (status === "interview") return "Interview Scheduled";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Applications</h2>

      {apps.length === 0 ? (
        <p className="text-gray-600">No applications found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app._id}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="font-semibold text-lg mb-2">
                <b>Role:</b> {app.jobId?.title}
              </p>
              <p className="text-gray-700">
                <b>Student:</b> {app.studentId?.name}
              </p>
              <p className="text-gray-700">
                <b>Company:</b> {app.jobId?.company?.name}
              </p>
              <p className="mt-2">
                <b>Status:</b>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium
                    ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : app.status === "interview"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {formatStatus(app.status)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
