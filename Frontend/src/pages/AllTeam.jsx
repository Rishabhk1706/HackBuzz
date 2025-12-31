import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const AllTeam = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadMatchRequests();
  }, []);

  const loadMatchRequests = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/match-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(res.data);
    } catch (err) {
      console.error("Error loading match requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const computeStatus = (req) => {
    const now = new Date();
    const eventStart = new Date(req.event?.startDate);
    if (req.status === "Full") return "Full";
    if (eventStart < now) return "Past";
    return "Pending";
  };

  const getStatusClass = (status) => {
    if (status === "Full" || status === "Past") return "bg-gradient-to-r from-pink-400 to-yellow-300";
    return "bg-gradient-to-r from-pink-400 to-yellow-300";
  };

  const filteredMatches = matches.filter((m) =>
    m.event?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const statusPriority = {
    Pending: 0,
    Full: 1,
    Past: 2,
  };
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    return statusPriority[computeStatus(a)] - statusPriority[computeStatus(b)];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-28 px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl p-10 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#0a0a0a] to-[#2a2f35] bg-clip-text text-transparent">
            Team Requests
          </h1>

          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-full border shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
                <EventSkeleton key={i} />
            ))
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No match requests available. Stay tuned!
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedMatches.map((req) => {
                const status = computeStatus(req);

                return (
                  <div
                    key={req._id}
                    className="relative bg-white border rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer"
                    onClick={() => navigate(`/match-requests/${req._id}`)}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#073c71] rounded-t-2xl" />

                    <h3 className="text-xl font-semibold mb-4 text-black">
                      {req.event?.title || "No Event Title"}
                    </h3>

                    <p className="mb-2 text-sm">
                      <strong className="text-black-600">Status:</strong>{" "}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </p>

                    <p className="mb-2 text-sm">
                      <strong className="text-black-600">Team Size:</strong>{" "}
                      {req.maxTeamSize}
                    </p>

                    <p className="text-sm">
                      <strong className="text-black-600">Created By:</strong>{" "}
                      {req.user?.name || "Unknown"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllTeam;