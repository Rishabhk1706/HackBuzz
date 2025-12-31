import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const AllEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const loadEvents = async () => {
      try {
        const res = await axios.get(
          "https://hackbuzz.onrender.com/api/events",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sorted = res.data.sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );

        setEvents(sorted);
        setFilteredEvents(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [navigate, token]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredEvents(
      events.filter((e) => e.title.toLowerCase().includes(q))
    );
  }, [search, events]);

  const computeStatus = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now >= s && now <= e) return "ongoing";
    if (now > e) return "past";
    return "upcoming";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
  };

  const statusStyle = {
    upcoming: "bg-gradient-to-r from-pink-400 to-yellow-400 text-white",
    ongoing: "bg-gradient-to-r from-pink-400 to-yellow-400 text-white",
    past: "bg-gradient-to-r from-pink-400 to-yellow-400 text-white",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-28 px-4 flex-grow">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl border border-white/40 mb-16">

          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            College Events
          </h1>

          <div className="mb-6 text-center">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-full border focus:ring-2 focus:ring-gray-400 outline-none"
            />
          </div>

          <div className="space-y-6">
            {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                <EventSkeleton key={i} />
                ))
            }

            {!loading && filteredEvents.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No events found.
              </div>
            )}

            {filteredEvents.map((event) => {
              const status = computeStatus(
                event.startDate,
                event.endDate
              );

              return (
                <div
                  key={event._id}
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="cursor-pointer bg-white border rounded-xl p-6 shadow hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#063360]"></div>

                  <h3 className="text-xl font-semibold mb-3">
                    {event.title}
                  </h3>

                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusStyle[status]}`}
                    >
                      {status}
                    </span>
                  </p>

                  <p>
                    <strong>Type:</strong>{" "}
                    {event.eventType || "Not specified"}
                  </p>

                  <p>
                    <strong>Venue:</strong>{" "}
                    {event.location || "Not specified"}
                  </p>

                  <p>
                    <strong>Dates:</strong>{" "}
                    {formatDate(event.startDate)} to{" "}
                    {formatDate(event.endDate)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllEvents;