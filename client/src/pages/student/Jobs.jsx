import { useEffect, useState } from "react";
import API from "../../api/api";
import DataTable from "../../components/DataTable";
import FileUpload from "../../components/FileUpload";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  // Load jobs
  const loadJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data.data || []);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  // Load my applications
  const loadApplications = async () => {
    try {
      const res = await API.get("/applications/my");
      const jobIds = res.data.data.map(app => app.jobId?._id);
      setAppliedJobs(jobIds);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  const apply = (job) => setSelectedJob(job);

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      if (!selectedJob) return alert("Select a job");
      const fd = new FormData();
      fd.append("jobId", selectedJob._id);
      fd.append("coverLetter", coverLetter || "");
      if (resumeFile) fd.append("resumeFile", resumeFile);

      const res = await API.post("/applications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) {
        alert("Application submitted");
        setSelectedJob(null);
        setCoverLetter("");
        setResumeFile(null);
        loadApplications(); // refresh applied list
      } else {
        alert(res.data.message || "Failed to submit");
      }
    } catch (err) {
      console.error("Submit application error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit application");
    }
  };

  const renderApplyButton = (job) => {
    const deadlinePassed = job.deadline && new Date(job.deadline) < new Date();
    const alreadyApplied = appliedJobs.includes(job._id);

    if (deadlinePassed) {
      return <span className="px-3 py-1 bg-gray-400 text-white rounded">Closed</span>;
    }
    if (alreadyApplied) {
      return <span className="px-3 py-1 bg-green-600 text-white rounded">Applied</span>;
    }
    return (
      <button onClick={() => apply(job)} className="px-3 py-1 bg-blue-600 text-white rounded">
        Apply
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "company", label: "Company", render: r => r.company?.name || "-" },
          { key: "location", label: "Location" },
          { key: "salary", label: "Salary" },
          { key: "type", label: "Type" },
          { key: "deadline", label: "Deadline", render: r => r.deadline ? new Date(r.deadline).toDateString() : "-" },
        ]}
        data={jobs}
        actions={(row) => renderApplyButton(row)}
      />

      {selectedJob && (
        <form onSubmit={submitApplication} className="mt-6 bg-white rounded-xl shadow p-5 space-y-3">
          <h3 className="text-lg font-semibold">Apply for: {selectedJob.title} — {selectedJob.company?.name}</h3>
          <FileUpload onChange={e => setResumeFile(e.target.files[0])} />
          <textarea className="w-full border p-2 rounded" placeholder="Cover letter" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Application</button>
            <button type="button" onClick={() => setSelectedJob(null)} className="px-4 py-2 rounded border">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
