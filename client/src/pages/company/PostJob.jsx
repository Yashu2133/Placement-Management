import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function PostJob() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "",
    requirements: "",
    deadline: "",
  });

  const navigate = useNavigate();

  // Load company profile
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await API.get("/companies/me");
        if (res.data.success && res.data.company) {
          setCompany(res.data.company);
        } else {
          alert("Please complete your company profile first.");
          navigate("/company/profile"); 
        }
      } catch (err) {
        console.error("Company profile load error:", err);
        alert("Please complete your company profile first.");
        navigate("/company/profile");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [navigate]);

  // Handle form changes
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // Submit job
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company) return alert("Company profile required!");

    setSaving(true);
    try {
      const res = await API.post("/jobs", job); 
      alert(res.data.message || "Job posted successfully!");
      navigate("/company"); // back to dashboard
    } catch (err) {
      console.error("Post job error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to post job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading company profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Post a Job</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={job.salary}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <select
             name="type"
             value={job.type}
             onChange={handleChange}
             className="border p-2 rounded w-full"
            required
        >
           <option value="">Select Job Type</option>
           <option value="Full-Time">Full-Time</option>
           <option value="Part-Time">Part-Time</option>
           <option value="Internship">Internship</option>
       </select>


        <textarea
          name="requirements"
          placeholder="Requirements (comma separated)"
          value={job.requirements}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="deadline"
          placeholder="Application Deadline"
          value={job.deadline}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
