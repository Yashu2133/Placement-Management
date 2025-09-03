import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    description: "",
    employees: 0,
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadCompany = async () => {
    try {
      const res = await API.get("/companies/me");
      if (res.data.success && res.data.company) {
        setCompany(res.data.company);
      }
    } catch (err) {
      console.error("Error loading company:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post("/companies", company);
      alert(res.data.message || "Profile saved successfully!");
      navigate("/company"); // go back to dashboard
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Update Company Profile</h2>
      <form className="space-y-4" onSubmit={save}>
        <input
          placeholder="Company Name"
          value={company.name}
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Industry"
          value={company.industry}
          onChange={(e) => setCompany({ ...company, industry: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Website"
          value={company.website}
          onChange={(e) => setCompany({ ...company, website: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Location"
          value={company.location}
          onChange={(e) => setCompany({ ...company, location: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={company.description}
          onChange={(e) => setCompany({ ...company, description: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Number of Employees"
          value={company.employees || ""}
          onChange={(e) => setCompany({ ...company, employees: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
