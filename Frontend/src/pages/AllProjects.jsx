import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const AllProjects = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const userCache = {};
  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadProjects();
  }, []);

  const getUserId = (postedBy) => {
    if (typeof postedBy === "string") return postedBy;
    if (typeof postedBy === "object" && postedBy?._id) return postedBy._id;
    return null;
  };

  const getUserInfo = async (userId) => {
    if (!userId) return { name: "Unknown", college: { name: "Not specified" } };

    if (userCache[userId]) return userCache[userId];

    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      userCache[userId] = res.data;
      return res.data;
    } catch {
      return { name: "Unknown", college: { name: "Not specified" } };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
  };

  const loadProjects = async () => {
    try {
      const res = await axios.get(
        "https://hackbuzz.onrender.com/api/projects",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const enriched = await Promise.all(
        sorted.map(async (p) => {
          const userId = getUserId(p.postedBy);
          const userInfo = await getUserInfo(userId);
          return { ...p, userInfo };
        })
      );

      setProjects(enriched);
      setFiltered(enriched);
    } catch (err) {
      alert("Could not fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      projects.filter((p) => p.title.toLowerCase().includes(q))
    );
  }, [search, projects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl border">

          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            All Projects
          </h1>

          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-full border shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {loading && (
            <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                <EventSkeleton key={i} />
                ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No projects found.
            </div>
          )}

          <div className="space-y-6">
            {!loading &&
              filtered.map((project) => (
                <div
                  key={project._id}
                  onClick={() =>
                    navigate(`/projects/${project._id}`)
                  }
                  className="bg-white border rounded-xl p-6 shadow cursor-pointer hover:scale-[1.02] transition relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#073c71] rounded-t-xl" />

                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white">
                      {project.status || "Unknown"}
                    </span>
                  </p>

                  <p>
                    <strong>Posted by:</strong>{" "}
                    {project.userInfo?.name || "Unknown"}
                  </p>

                  <p>
                    <strong>College:</strong>{" "}
                    {project.userInfo?.college?.name || "Not specified"}
                  </p>

                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllProjects;