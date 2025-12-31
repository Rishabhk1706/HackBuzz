import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const Event = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [eventData, setEventData] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
    }
    if (!eventId || eventId === "null") {
      alert("Please choose the event.");
      navigate("/events");
    }
  }, [token, user, eventId, navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await axios.get(
          `https://hackbuzz.onrender.com/api/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const event = res.data;
        setEventData(event);

        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        let s = "upcoming";
        if (now >= start && now <= end) s = "ongoing";
        else if (now > end) s = "past";

        setStatus(s);
      } catch (err) {
        alert("Could not load event details.");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, token, navigate]);

  const registerForEvent = async () => {
    try {
      setRegistering(true);
      await axios.post(
        `https://hackbuzz.onrender.com/api/events/${eventId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRegisterMessage("You have successfully registered.");
      setEventData((prev) => ({
        ...prev,
        registeredUsers: [...prev.registeredUsers, user._id],
      }));
    } catch (err) {
      alert(err?.response?.data?.error || "Could not register.");
    } finally {
      setRegistering(false);
    }
  };

  let alreadyRegistered = false;
  let isDisabled = true;

  if (!loading && eventData) {
    const registeredIds = eventData.registeredUsers.map((u) =>
      typeof u === "object" ? u._id : u
    );

    alreadyRegistered = registeredIds.includes(user._id);

    isDisabled =
      alreadyRegistered ||
      status !== "upcoming" ||
      eventData.registeredUsers.length >= eventData.maxParticipants;
  }

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
            {eventData.title}
          </h1>

          <p className="mt-8">
            <strong>Status:</strong>
            <span className="ml-2 px-3 py-1 rounded-full text-white bg-gradient-to-r from-pink-500 to-yellow-400 text-sm uppercase">
              {status}
            </span>
          </p>

          <p className="mt-4"><strong>Type:</strong> {eventData.eventType || "N/A"}</p>
          <p className="mt-4"><strong>Venue:</strong> {eventData.location || "N/A"}</p>
          <p className="mt-4"><strong>Dates:</strong> {formatDate(eventData.startDate)} – {formatDate(eventData.endDate)}</p>
          <p className="mt-4"><strong>Time:</strong> {formatTime(eventData.startTime)} – {formatTime(eventData.endTime)}</p>
          <p className="mt-4"><strong>Posted by:</strong> {eventData.createdBy?.name || "Unknown"}</p>
          <p className="mt-4"><strong>College:</strong> {eventData.college?.name || "Unknown"}</p>
          <p className="mt-4"><strong>Max Participants:</strong> {eventData.maxParticipants}</p>
          <p className="mt-4"><strong>Registered Users:</strong> {eventData.registeredUsers.length}</p>

          <div className="mt-6 p-4 bg-gray-100 rounded-xl border-l-4 border-[#03274a] whitespace-pre-line">
            {eventData.description || "No description."}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={registerForEvent}
              disabled={isDisabled || registering}
              className={`px-8 py-3 rounded-3xl font-semibold transition ${
                isDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#03274a] text-white hover:bg-black"
              }`}
            >
              {alreadyRegistered
                ? "Already Registered"
                : status !== "upcoming"
                ? "Registration Closed"
                : eventData.registeredUsers.length >= eventData.maxParticipants
                ? "Event Full"
                : "Register"}
            </button>

            {registerMessage && (
              <p className="mt-3 text-green-600 font-semibold">
                {registerMessage}
              </p>
            )}
          </div>
        </div>
      </main>
      )}
      <Footer />
    </div>
  );
};
export default Event;