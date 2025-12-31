import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateEvent = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedTags = tags.split(",").map(t => t.trim());

    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      if (eh < sh || (eh === sh && em <= sm)) {
        alert("❌ End time must be later than start time.");
        return;
      }
    }

    try {
      await axios.post(
        "https://hackbuzz.onrender.com/api/events",
        {
          title: title.trim(),
          description: description.trim(),
          tags: parsedTags,
          eventType,
          location: location.trim(),
          startDate,
          endDate,
          startTime,
          endTime,
          maxParticipants: parseInt(maxParticipants),
          createdBy: user._id,
          college: user.college,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert(
        "❌ Failed to create event: " +
          (err.response?.data?.error || "Check console.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35] flex flex-col">
      <Header variant="dashboard" />

      <main className="pt-32 px-4 flex-grow flex justify-center items-start">
        <div className="bg-white text-black w-full max-w-2xl rounded-2xl shadow-2xl p-10 mb-10">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-y"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select type</option>
                <option value="Virtual">Virtual</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Location (only if In-Person / Hybrid)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-44 block mx-auto mt-6 bg-[#03274a] text-white py-3 rounded-3xl font-semibold hover:bg-black transition"
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

export default CreateEvent;