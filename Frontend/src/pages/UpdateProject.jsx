import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const UpdateProject = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentProjectId, setCurrentProjectId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [selectedOpen, setSelectedOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState([]);
  const [availability, setAvailability] = useState([]);

  const [applicants, setApplicants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/projects",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data.filter(
        (p) => p.postedBy?._id === user._id
      );
      setProjects(created);
    } catch {
      alert("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = async (project) => {
    setCurrentProjectId(project._id);
    setTitle(project.title);
    setDescription(project.description);
    setRoles([]);
    setAvailability([]);

    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/projects/${project._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoles(res.data.requiredRoles || []);
      setAvailability(res.data.availability || []);
      setEditOpen(true);
    } catch {
      alert("Could not load project details.");
    }
  };

  // ➕ Role
  const addRole = () =>
    setRoles([...roles, { role: "", description: "", count: 1 }]);

  // ➕ Availability
  const addAvailability = () =>
    setAvailability([...availability, { day: "Monday", time: "" }]);

  // 💾 Update project
  const submitUpdate = async () => {
    try {
      await axios.put(
        `https://hackbuzz.onrender.com/api/projects/${currentProjectId}`,
        {
          title,
          description,
          requiredRoles: roles,
          availability,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project updated successfully!");
      setEditOpen(false);
      loadProjects();
    } catch {
      alert("Failed to update project.");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `https://hackbuzz.onrender.com/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project deleted!");
      loadProjects();
    } catch {
      alert("Delete failed.");
    }
  };

  const viewApplicants = async (id) => {
    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(res.data.applicants || []);
      setSelectedUsers(res.data.selectedUsers || []);
      setCurrentProjectId(id);
      setApplicantsOpen(true);
    } catch {
      alert("Could not load applicants.");
    }
  };

  const selectUser = async (userId) => {
    const role = prompt("Enter role to assign to user:");
    if (!role) return;

    try {
      await axios.put(
        `https://hackbuzz.onrender.com/api/projects/${currentProjectId}`,
        { $push: { selectedUsers: { user: userId, role } } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User selected!");
      setApplicantsOpen(false);
      loadProjects();
    } catch {
      alert("Failed to select user.");
    }
  };

  const viewSelectedUsers = async (id) => {
    try {
      setCurrentProjectId(id);
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUsers(res.data.selectedUsers || []);
      setSelectedOpen(true);
    } catch {
      alert("Could not load selected users.");
    }
  };

  const removeSelectedUser = async (userId) => {
    if (!window.confirm("Remove this user from selected list?")) return;

    try {
        await axios.put(
        `https://hackbuzz.onrender.com/api/projects/${currentProjectId}`,
        {
            $pull: { selectedUsers: { user: userId } },
        },
        { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("User removed from selected list.");
        viewSelectedUsers(currentProjectId);
    } catch (err) {
        alert("Failed to remove selected user.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-2xl mb-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Your Posted Projects
          </h1>
          {loading && (
            <div className="space-y-6">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          )}
          {projects.length === 0 && (
            <p className="text-center text-gray-500">No projects found.</p>
          )}

          {projects.map((p) => (
            <div key={p._id} className="border rounded-xl p-6 mb-6 shadow">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p>{p.description}</p>
              <p>Status: {p.status}</p>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => openEdit(p)}
                  className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteProject(p._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-3xl"
                >
                  Delete
                </button>
                <button
                  onClick={() => viewApplicants(p._id)}
                  className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
                >
                  Applied Users
                </button>
                <button
                  onClick={() => viewSelectedUsers(p._id)}
                  className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
                >
                  Selected Users
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
        {editOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Edit Project
            </h2>

            <label className="block font-semibold mb-1">Title</label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Project Title"
            />

            <label className="block font-semibold mb-1">Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border p-2 rounded mb-6"
                placeholder="Project Description"
            />

            <label className="block font-semibold mb-2">Required Roles</label>

            {roles.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                <input
                    value={r.role}
                    onChange={(e) => {
                    const updated = [...roles];
                    updated[i].role = e.target.value;
                    setRoles(updated);
                    }}
                    placeholder="Role"
                    className="border p-2 rounded flex-1"
                />

                <input
                    value={r.description}
                    onChange={(e) => {
                    const updated = [...roles];
                    updated[i].description = e.target.value;
                    setRoles(updated);
                    }}
                    placeholder="Description"
                    className="border p-2 rounded flex-1"
                />

                <input
                    type="number"
                    min={1}
                    value={r.count}
                    onChange={(e) => {
                    const updated = [...roles];
                    updated[i].count = Number(e.target.value);
                    setRoles(updated);
                    }}
                    className="border p-2 rounded w-20"
                />
                </div>
            ))}

            <button
                onClick={addRole}
                className="text-sm text-blue-600 underline mb-6"
            >
                + Add Role
            </button>

            <label className="block font-semibold mb-2">Availability</label>

            {availability.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                <select
                    value={a.day}
                    onChange={(e) => {
                    const updated = [...availability];
                    updated[i].day = e.target.value;
                    setAvailability(updated);
                    }}
                    className="border p-2 rounded"
                >
                    {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                    ].map((d) => (
                    <option key={d}>{d}</option>
                    ))}
                </select>

                <input
                    value={a.time}
                    onChange={(e) => {
                    const updated = [...availability];
                    updated[i].time = e.target.value;
                    setAvailability(updated);
                    }}
                    placeholder="Time (e.g. 10:00 AM - 12:00 PM)"
                    className="border p-2 rounded flex-1"
                />
                </div>
            ))}

            <button
                onClick={addAvailability}
                className="text-sm text-blue-600 underline mb-6"
            >
                + Add Availability
            </button>

            <div className="flex justify-end gap-3 mt-6">
                <button
                onClick={submitUpdate}
                className="bg-[#03274a] text-white px-5 py-2 rounded-3xl font-semibold"
                >
                Save
                </button>
                <button
                onClick={() => setEditOpen(false)}
                className="bg-gray-300 px-5 py-2 rounded-3xl"
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        )}

      {applicantsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
              Applied Users
            </h2>

            <ul className="space-y-3">
              {applicants.map((app) => {
                const isSelected = selectedUsers.some(
                  (s) => String(s.user?._id) === String(app.user?._id)
                );

                return (
                  <li
                    key={app.user?._id}
                    className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/users/${app.user?._id}`)}
                  >
                    <strong>{app.user?.name}</strong>
                    <div>{app.user?.email}</div>
                    <div className="text-sm text-gray-500">
                      {app.message || "No message"}
                    </div>

                    <button
                      disabled={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectUser(app.user._id);
                      }}
                      className={`mt-2 px-4 py-2 rounded-3xl text-white ${
                        isSelected
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#03274a]"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="text-right mt-4">
              <button
                onClick={() => setApplicantsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-3xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
                Selected Users
            </h2>

            {selectedUsers.length === 0 ? (
                <p className="text-center text-gray-500">
                No selected users yet.
                </p>
            ) : (
                <ul className="space-y-3">
                {selectedUsers.map((sel) => (
                    <li
                    key={sel.user?._id}
                    className="border rounded p-4 hover:bg-gray-50"
                    >
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate(`/users/${sel.user?._id}`)}
                    >
                        <strong>{sel.user?.name || "Unknown"}</strong>
                        <div>{sel.user?.email || "Unknown"}</div>
                        <div className="text-sm text-gray-500">
                          Role: {sel.role || "N/A"}
                        </div>
                    </div>

                    <button
                        onClick={() => removeSelectedUser(sel.user?._id)}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-700"
                    >
                        Remove
                    </button>
                    </li>
                ))}
                </ul>
            )}

            <div className="text-right mt-4">
                <button
                onClick={() => setSelectedOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-3xl"
                >
                Close
                </button>
            </div>
            </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UpdateProject;