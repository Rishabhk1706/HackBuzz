import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const Project = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [postedBy, setPostedBy] = useState(null);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const [applyStatus, setApplyStatus] = useState("");

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!projectId || projectId === "null") {
      alert("Please choose the project.");
      navigate("/projects");
      return;
    }

    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const proj = res.data;
      setProject(proj);

      const alreadyApplied = proj.applicants?.some((app) => {
        const uid =
          typeof app.user === "object" ? app.user._id : app.user;
        return uid?.toString() === user._id;
      });
      setApplied(alreadyApplied);

      const postedById =
        typeof proj.postedBy === "string"
          ? proj.postedBy
          : proj.postedBy?._id;

      const userRes = await axios.get(
        `https://hackbuzz.onrender.com/api/users/${postedById}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPostedBy(userRes.data);
    } catch (err) {
      alert("Could not load project details.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const applyToProject = async () => {
    if (!message.trim()) {
      alert("Please specify your role or message before applying.");
      return;
    }

    try {
      await axios.post(
        `https://hackbuzz.onrender.com/api/projects/${projectId}/apply`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplyStatus("Successfully applied!");
      setApplied(true);
    } catch (err) {
      alert(err?.response?.data?.error || "Could not apply.");
    }
  };

  let isClosed = false;
  if (!loading && project) {
    isClosed = project.status?.toLowerCase() === "closed";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f25] to-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4 pb-16 flex-grow">
        {loading ? (
          <div className="max-w-4xl mx-auto">
            <EventSkeleton />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border">
            <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mt-4">
              {project.title}
            </h1>

            <div className="space-y-3 text-base text-black">
              <p className="mt-8">
                <strong>Status:</strong>
                <span className="ml-2 px-3 py-1 rounded-full text-white bg-gradient-to-r from-pink-500 to-yellow-400 text-sm uppercase">
                  {project.status}
                </span>
              </p>

              <p>
                <strong className="text-black">Description:</strong>{" "}
                {project.description}
              </p>

              <p>
                <strong className="text-black">Posted by:</strong>{" "}
                {postedBy?.name || "Unknown"}
              </p>

              <p>
                <strong className="text-black">College:</strong>{" "}
                {postedBy?.college?.name || "Not specified"}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-black mb-2">
                Required Roles
              </h3>
              <ul className="list-disc ml-6 space-y-1 text-black">
                {(project.requiredRoles || []).map((r, i) => (
                  <li key={i}>
                    {r.role} ({r.count}) — {r.description || ""}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-black mb-2">
                Availability
              </h3>
              <ul className="list-disc ml-6 space-y-1 text-black">
                {(project.availability || []).map((a, i) => (
                  <li key={i}>
                    {a.day}: {a.time}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t text-center">
              <h3 className="text-2xl font-bold text-[#03274a] mb-3">
                Apply to this Project
              </h3>

              <textarea
                rows={4}
                value={message}
                disabled={isClosed || applied}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify role"
                className="w-full max-w-2xl mx-auto block border rounded-xl p-3 mt-2 disabled:bg-gray-100"
              />

              <button
                onClick={applyToProject}
                disabled={isClosed || applied}
                className={`mt-4 px-10 py-3 rounded-3xl font-semibold text-white transition
                  ${
                    isClosed || applied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#03274a] hover:bg-black"
                  }`}
              >
                {isClosed
                  ? "Applications Closed"
                  : applied
                  ? "Already Applied"
                  : "Apply"}
              </button>

              {applyStatus && (
                <p className="mt-3 text-green-600 font-medium">
                  {applyStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Project;