import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/auth/users"); // ✅ Leading slash important
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to promote this user to admin?")) return;

    setProcessingId(id);
    try {
      await API.put(`/auth/role/${id}`, { role: "admin" }); // ✅ token sent automatically via API
      alert("User promoted to admin");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {u.role !== "admin" && !u.isSuperAdmin ? (
                    <button
                      onClick={() => promoteToAdmin(u._id)}
                      disabled={processingId === u._id}
                      className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {processingId === u._id ? "Promoting..." : "Promote"}
                    </button>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
