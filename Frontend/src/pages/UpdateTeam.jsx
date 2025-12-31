import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const UpdateTeam = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [applicantsModal, setApplicantsModal] = useState(false);
  const [selectedModal, setSelectedModal] = useState(false);

  const [currentEditId, setCurrentEditId] = useState(null);
  const [editSize, setEditSize] = useState("");
  const [editRoles, setEditRoles] = useState("");
  const [editSkills, setEditSkills] = useState("");

  const [applicants, setApplicants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/match-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const upcoming = res.data.filter(
        (r) =>
          r.user?._id === user._id &&
          r.event?.startDate &&
          new Date(r.event.startDate) > new Date()
      );

      setRequests(upcoming);
    } catch (err) {
      console.error("Load failed:", err);
      alert("Failed to load match requests.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (req) => {
    setCurrentEditId(req._id);
    setEditSize(req.maxTeamSize);
    setEditRoles(req.lookingForRoles.join(", "));
    setEditSkills(req.skills.join(", "));
    setEditModal(true);
  };

  const submitUpdate = async () => {
    const roles = editRoles.split(",").map(r => r.trim()).filter(Boolean);
    const skills = editSkills.split(",").map(s => s.trim()).filter(Boolean);

    if (!editSize) return alert("Invalid team size.");

    try {
      await axios.put(
        `https://hackbuzz.onrender.com/api/match-requests/${currentEditId}`,
        { maxTeamSize: editSize, lookingForRoles: roles, skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated successfully.");
      setEditModal(false);
      loadRequests();
    } catch {
      alert("Update failed.");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;

    try {
      await axios.delete(
        `https://hackbuzz.onrender.com/api/match-requests/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Deleted successfully.");
      loadRequests();
    } catch {
      alert("Delete failed.");
    }
  };

  const viewApplicants = async (id) => {
    const res = await axios.get(
      `https://hackbuzz.onrender.com/api/match-requests/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setApplicants(res.data.applicants || []);
    setSelectedUsers((res.data.selectedUsers || []).map(s => s.user._id));
    setCurrentEditId(id);
    setApplicantsModal(true);
  };

  const selectUser = async (userId, role) => {
    await axios.put(
      `https://hackbuzz.onrender.com/api/match-requests/${currentEditId}`,
      { $push: { selectedUsers: { user: userId, role } } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("User selected.");
    viewApplicants(currentEditId);
    loadRequests();
  };

  const viewSelected = async (id) => {
    const res = await axios.get(
      `https://hackbuzz.onrender.com/api/match-requests/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedUsers(res.data.selectedUsers || []);
    setCurrentEditId(id);
    setSelectedModal(true);
  };

  const removeSelected = async (userId) => {
    await axios.put(
      `https://hackbuzz.onrender.com/api/match-requests/${currentEditId}`,
      { $pull: { selectedUsers: { user: userId } } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Removed.");
    viewSelected(currentEditId);
    loadRequests();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-2xl mb-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Your Team Requests
          </h1>

          {loading ? (
            <div className="space-y-6">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          ) : requests.length === 0 ? (
            <p>No upcoming match requests.</p>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                className="bg-gray-50 border rounded-xl p-6 mb-6 shadow"
              >
                <h3 className="text-xl font-semibold mb-1">{req.event.title}</h3>
                <p><strong>Max Team Size: </strong> {req.maxTeamSize}</p>
                <p><strong>Roles: </strong> {req.lookingForRoles.join(", ")}</p>
                <p><strong>Skills: </strong> {req.skills.join(", ")}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => openEdit(req)} className="bg-[#03274a] text-white px-4 py-2 rounded-3xl">Update</button>
                  <button onClick={() => deleteRequest(req._id)} className="bg-red-600 text-white px-4 py-2 rounded-3xl">Delete</button>
                  <button onClick={() => viewApplicants(req._id)} className="bg-[#03274a] text-white px-4 py-2 rounded-3xl">Applicants</button>
                  <button onClick={() => viewSelected(req._id)} className="bg-[#03274a] text-white px-4 py-2 rounded-3xl">Selected</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {editModal && (
        <Modal onClose={() => setEditModal(false)} title="Edit Match Request">
          <Input label="Max Team Size" value={editSize} onChange={setEditSize} />
          <Input label="Roles" value={editRoles} onChange={setEditRoles} />
          <Input label="Skills" value={editSkills} onChange={setEditSkills} />
          <ModalActions onSave={submitUpdate} onCancel={() => setEditModal(false)} />
        </Modal>
      )}

      {applicantsModal && (
        <Modal onClose={() => setApplicantsModal(false)} title="Applied Users">
            {applicants.map((a) => {
                const isSelected = selectedUsers.includes(a.user._id);

                return (
                    <div
                        key={a.user._id}
                        onClick={() => navigate(`/users/${a.user?._id}`)}
                        className="border p-4 mb-3 rounded cursor-pointer hover:bg-gray-50 transition"
                        >
                        <p className="font-semibold">{a.user.name}</p>
                        <p className="text-sm text-gray-600">{a.user.email}</p>
                        <p className="mb-2">Role: {a.role || "N/A"}</p>

                        <button
                            disabled={isSelected}
                            onClick={(e) => {
                            e.stopPropagation();
                            selectUser(a.user._id, a.role);
                            }}
                            className={`bg-[#03274a] text-white px-4 py-2 rounded-3xl ${
                            isSelected && "opacity-50 cursor-not-allowed"
                            }`}
                        >
                            {isSelected ? "Selected" : "Select"}
                        </button>
                    </div>
                );
            })}
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => setApplicantsModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded-3xl"
                >
                    Close
                </button>
            </div>
        </Modal>
      )}

      {selectedModal && (
        <Modal onClose={() => setSelectedModal(false)} title="Selected Users">
            {selectedUsers.length === 0 ? (
            <p className="text-center text-gray-500">
                No selected users yet.
            </p>
            ) : (
            selectedUsers.map((s) => (
                <div
                key={s.user._id}
                onClick={() => navigate(`/users/${s.user?._id}`)}
                className="border p-4 mb-3 rounded cursor-pointer hover:bg-gray-50 transition"
                >
                <p className="font-semibold">{s.user.name}</p>
                <p className="text-sm text-gray-500">
                    <strong>Role: </strong>{s.role || "N/A"}
                </p>

                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    removeSelected(s.user._id);
                    }}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-700"
                >
                    Remove
                </button>
                </div>
            ))
        )}
            <div className="flex justify-end mt-6">
            <button
                onClick={() => setSelectedModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
                Close
            </button>
            </div>
        </Modal>
        )}
    </div>
  );
};

const Modal = ({ title, children}) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <>
    <label className="block font-semibold mb-1">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border p-2 rounded mb-4"
    />
  </>
);

const ModalActions = ({ onSave, onCancel }) => (
  <div className="flex justify-end gap-3">
    <button onClick={onSave} className="bg-[#03274a] text-white px-4 py-2 rounded-3xl">Save</button>
    <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded-3xl">Cancel</button>
  </div>
);

export default UpdateTeam;