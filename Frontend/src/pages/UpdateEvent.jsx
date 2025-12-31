import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const UpdateEvent = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  const [currentEventId, setCurrentEventId] = useState(null);
  const [form, setForm] = useState({});
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
    }
  }, [token, user, navigate]);

  const loadEvents = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/events",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data.filter(
        (e) => e.createdBy?._id === user._id
      );

      setEvents(created);
    } catch (err) {
      alert("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openEdit = (event) => {
    setCurrentEventId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      tags: event.tags.join(","),
      eventType: event.eventType,
      location: event.location || "",
      startDate: event.startDate.slice(0, 10),
      endDate: event.endDate.slice(0, 10),
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      maxParticipants: event.maxParticipants,
    });
    setEditOpen(true);
  };

  const submitUpdate = async () => {
    const { startTime, endTime } = form;

    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      if (eh < sh || (eh === sh && em <= sm)) {
        alert("❌ End time must be later than start time.");
        return;
      }
    }

    try {
      await axios.put(
        `https://hackbuzz.onrender.com/api/events/${currentEventId}`,
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          maxParticipants: Number(form.maxParticipants),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event updated successfully!");
      setEditOpen(false);
      loadEvents();
    } catch {
      alert("Failed to update event.");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(
        `https://hackbuzz.onrender.com/api/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Event deleted!");
      loadEvents();
    } catch {
      alert("Delete failed.");
    }
  };

  const viewUsers = async (id) => {
    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegisteredUsers(res.data.registeredUsers || []);
      setUsersOpen(true);
    } catch {
      alert("Failed to fetch users.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-2xl mb-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Your Created Events
          </h1>
          {loading && (
            <div className="space-y-6">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          )}
          {!loading && events.length === 0 && (
            <p className="text-center text-gray-500">No events found.</p>
          )}

          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gray-50 border rounded-xl p-6 mb-6 shadow"
            >
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.location}</p>
              <p>Max Participants: {event.maxParticipants}</p>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => openEdit(event)}
                  className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-3xl"
                >
                  Delete
                </button>

                <button
                  onClick={() => viewUsers(event._id)}
                  className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
                >
                  Registered Users
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Event</h2>
            {[
              ["title", "Title"],
              ["description", "Description"],
              ["tags", "Tags"],
              ["location", "Location"],
              ["startDate", "Start Date", "date"],
              ["endDate", "End Date", "date"],
              ["startTime", "Start Time", "time"],
              ["endTime", "End Time", "time"],
              ["maxParticipants", "Max Participants", "number"],
            ].map(([key, label, type = "text"]) => (
              <input
                key={key}
                type={type}
                value={form[key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                placeholder={label}
                className="w-full mb-3 p-2 border rounded"
              />
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={submitUpdate}
                className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
              >
                Save
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-3xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {usersOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Registered Users
            </h2>

            {registeredUsers.length === 0 && (
              <p className="text-center">No users registered.</p>
            )}

            <ul className="space-y-2">
              {registeredUsers.map((u) => (
                <li
                  key={u._id}
                  onClick={() => navigate(`/users/${u._id}`)}
                  className="bg-[#e7edf4] border p-3 rounded cursor-pointer hover:bg-gray-100 transition"
                >
                  <strong>{u.name}</strong>
                  <div>{u.email}</div>
                  <div className="text-sm text-gray-500">
                    {u.college?.name || "No college info"}
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-right mt-4">
              <button
                onClick={() => setUsersOpen(false)}
                className="bg-[#03274a] text-white px-4 py-2 rounded-3xl"
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

export default UpdateEvent;