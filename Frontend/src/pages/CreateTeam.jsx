import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateTeam = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState("");
  const [maxTeamSize, setMaxTeamSize] = useState("");
  const [roles, setRoles] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/events",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const today = new Date();

      const registeredEvents = res.data.filter(
        (e) =>
          e.registeredUsers?.some((u) =>
            typeof u === "object" ? u._id === user._id : u === user._id
          ) && new Date(e.startDate) > today
      );

      setEvents(registeredEvents);
    } catch (err) {
      console.error("Error loading events", err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://hackbuzz.onrender.com/api/match-requests",
        {
          event,
          maxTeamSize: parseInt(maxTeamSize),
          lookingForRoles: roles
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Match Request Created!");
      navigate("/match-requests");
    } catch (err) {
      console.error("Create failed:", err);
      alert(
        "❌ Error creating match request: " +
          (err?.response?.data?.error || "Check console")
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2a2f35] to-[#1a1f25]">
      <Header variant="dashboard" />

      <main className="flex-grow pt-28 px-4 mb-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Team Request
          </h1>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold text-black-700">
              Registered Events
            </label>
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              required
              className="w-full p-3 border rounded-lg mb-6"
            >
              {loading ? (
                <option>Loading...</option>
              ) : events.length === 0 ? (
                <option>No upcoming registered events</option>
              ) : (
                <>
                  <option value="">Select an event</option>
                  {events.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.title}
                    </option>
                  ))}
                </>
              )}
            </select>

            <label className="block mb-2 font-semibold text-black-700">
              Max Team Size
            </label>
            <input
              type="number"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(e.target.value)}
              required
              className="w-full p-3 border rounded-lg mb-6"
            />

            <label className="block mb-2 font-semibold text-black-700">
              Looking for Roles (comma-separated)
            </label>
            <input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              required
              className="w-full p-3 border rounded-lg mb-6"
            />

            <label className="block mb-2 font-semibold text-black-700">
              Looking for Skills
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node, UI/UX"
              required
              className="w-full p-3 border rounded-lg mb-8"
            />

            <button
              type="submit"
              className="w-44 block mx-auto bg-[#03274a] text-white px-8 py-3 rounded-3xl font-semibold hover:bg-gradient-to-r hover:from-[#1a1f25] hover:to-[#2a2f35] transition"
            >
              Create
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;