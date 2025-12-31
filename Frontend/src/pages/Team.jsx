import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const Team = () => {
  const navigate = useNavigate();
  const { id: matchId } = useParams();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [applyStatus, setApplyStatus] = useState("");
  const [applyDisabled, setApplyDisabled] = useState(false);
  const [applyText, setApplyText] = useState("Apply");
  const [eventData, setEventData] = useState(null);


  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadMatchRequest();
  }, [matchId, token, user, navigate]);

  const loadMatchRequest = async () => {
    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/match-requests/${matchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setMatchData(data);

      const isApplicant = data.applicants.some(
        (a) => a.user === user._id || a.user?._id === user._id
      );

      const isFull = data.selectedUsers.length >= data.maxTeamSize;

      const eventRes = await axios.get(
        `https://hackbuzz.onrender.com/api/events/${data.event._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventData(eventRes.data);
      
      const registeredUserIds = eventRes.data.registeredUsers.map((u) =>
        typeof u === "object" ? u._id : u
      );
      const isRegistered = registeredUserIds.includes(user._id);

      const eventStart = new Date(eventRes.data.startDate);
      const now = new Date();
      const isPast = eventStart < now;

      if (isPast) {
        setApplyDisabled(true);
        setApplyText("Event is Over");
      } else if (!isRegistered) {
        setApplyDisabled(true);
        setApplyText("Not registered for event");
      } else if (isFull) {
        setApplyDisabled(true);
        setApplyText("Team Full");
      } else if (isApplicant) {
        setApplyDisabled(true);
        setApplyText("Already Applied");
      }
    } catch (err) {
      console.error("Error loading match request:", err);
      alert("Could not load match request.");
    } finally {
      setLoading(false);
    }
  };

  const computeStatus = () => {
    if (!eventData) return "Pending";

    const now = new Date();
    const startDate = new Date(eventData.startDate);

    if (matchData.status === "Full") return "Full";
    if (startDate < now) return "Past";

    return "Pending";
  };

  const applyToTeam = async () => {
    if (!role.trim()) {
      alert("Please specify the role you're applying for.");
      return;
    }

    try {
      await axios.post(
        `https://hackbuzz.onrender.com/api/match-requests/${matchId}/apply`,
        { role, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplyDisabled(true);
      setApplyText("Applied");
      setApplyStatus("Application sent!");
    } catch (err) {
      console.error("Apply failed:", err);
      alert(err?.response?.data?.error || "Could not apply.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1f25] to-[#2a2f35]">
      <Header variant="dashboard" />
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1f25] to-[#2a2f35] px-4 py-28">
          <div className="max-w-4xl mx-auto space-y-6">
            <EventSkeleton />
          </div>
        </div>
      ) : (
        <main className="pt-28 px-4 py-10 flex-grow">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl border">
              <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mt-4">
              {matchData.event?.title || "Untitled Event"}
              </h1>

              <p className="mt-8">
                  <strong>Status:</strong>
                  <span className="ml-2 px-3 py-1 rounded-full text-white bg-gradient-to-r from-pink-500 to-yellow-400 text-sm uppercase">
                  {computeStatus()}
                  </span>
              </p>

              <p className="mt-4">
                  <strong>Team Size: </strong> {matchData.maxTeamSize}
              </p>

              <p className="mt-4">
                  <strong>Looking For Roles: </strong>
                  {matchData.lookingForRoles.join(", ") || "N/A"}
              </p>

              <p className="mt-4">
                  <strong>Skills Needed: </strong>
                  {matchData.skills.join(", ") || "N/A"}
              </p>

              <p className="mt-4">
                  <strong>Created By: </strong>
                  {matchData.user?.name || "Unknown"}
              </p>

              <p className="mt-4">
                  <strong>Selected Users: </strong>
                  {matchData.selectedUsers.length}
              </p>

              <div className="mt-10 pt-6 border-t text-center">
              <h3 className="text-2xl font-bold text-[#03274a] mb-4">
                  Apply to this Team
              </h3>

              <div className="flex flex-wrap gap-4 justify-center mb-4">
                  <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role you're applying for"
                  className="border p-3 rounded-lg w-full max-w-md"
                  />

                  <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  className="border p-3 rounded-lg w-full max-w-md min-h-[120px]"
                  />
              </div>

              <button
                  disabled={applyDisabled}
                  onClick={applyToTeam}
                  className={`px-10 py-3 rounded-xl font-semibold text-white transition ${
                  applyDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#03274a] hover:bg-gradient-to-r hover:from-[#1a1f25] hover:to-[#2a2f35]"
                  }`}
              >
                  {applyText}
              </button>

              {applyStatus && (
                  <p className="mt-3 font-medium text-green-600">{applyStatus}</p>
              )}
              </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Team;