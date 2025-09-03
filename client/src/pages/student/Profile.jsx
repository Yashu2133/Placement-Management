import { useEffect, useState } from "react"
import API from "../../api/api"

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState(null) // store profile id

  const load = async () => {
    try {
      const me = await API.get("/auth/profile")

      // if profile already exists from backend
      if (me.data.student) {
        setProfileId(me.data.student._id) // keep the id for update
        setProfile({
          name: me.data.user.name || "",
          rollNo: me.data.student.rollNo || "",
          department: me.data.student.department || "",
          cgpa: me.data.student.cgpa || "",
          achievements: (me.data.student.achievements || []).join(", "),
          resumeUrl: me.data.student.resumeUrl || "",
          portfolioLinks: (me.data.student.portfolioLinks || []).join(", "),
          skills: (me.data.student.skills || []).join(", "),
        })
      } else {
        // first time, only user name available
       setProfile({
  name: me.data.user.name || "",
  rollNo: me.data.student?.rollNo || "",
  department: me.data.student?.department || "",
  cgpa: me.data.student?.cgpa || "",
  achievements: me.data.student?.achievements?.join(", ") || "",
  resumeUrl: me.data.student?.resumeUrl || "",
  portfolioLinks: me.data.student?.portfolioLinks?.join(", ") || "",
  skills: me.data.student?.skills?.join(", ") || "",
});
      }
    } catch (err) {
      console.error("Error loading profile:", err)
    }
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: profile.name,
        rollNo: profile.rollNo,
        department: profile.department,
        cgpa: Number(profile.cgpa) || undefined,
        achievements: profile.achievements ? profile.achievements.split(",").map(s => s.trim()) : [],
        resumeUrl: profile.resumeUrl || undefined,
        portfolioLinks: profile.portfolioLinks ? profile.portfolioLinks.split(",").map(s => s.trim()) : [],
        skills: profile.skills ? profile.skills.split(",").map(s => s.trim()) : [],
      }

      if (profileId) {
        // update existing profile
        await API.put(`/students/${profileId}`, payload)
      } else {
        // create new profile
        const res = await API.post("/students", payload)
        setProfileId(res.data._id) // store id for next time
      }

      alert("Profile saved")
    } catch (e) {
      console.error("Profile save error:", e.response?.data || e.message)
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return null

  return (
    <form onSubmit={save} className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-2">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Roll No" value={profile.rollNo} onChange={e => setProfile({ ...profile, rollNo: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Department" value={profile.department} onChange={e => setProfile({ ...profile, department: e.target.value })} />
        <input className="border p-2 rounded" placeholder="CGPA" value={profile.cgpa} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Resume URL (optional)" value={profile.resumeUrl} onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Portfolio Links (comma separated)" value={profile.portfolioLinks} onChange={e => setProfile({ ...profile, portfolioLinks: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Skills (comma separated)" value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })} />
        <input className="border p-2 rounded md:col-span-2" placeholder="Achievements (comma separated)" value={profile.achievements} onChange={e => setProfile({ ...profile, achievements: e.target.value })} />
      </div>
      <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save Profile"}</button>
    </form>
  )
}
