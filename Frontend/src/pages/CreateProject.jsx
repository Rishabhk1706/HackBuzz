import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateProject = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [roles, setRoles] = useState([
    { role: "", description: "", count: 1 },
  ]);

  const [availability, setAvailability] = useState([
    { day: "", start: "", end: "" },
  ]);

  useEffect(() => {
    if (!token || !user?._id) {
      alert("Please login first.");
      navigate("/login");
    }
  }, []);

  const addRole = () => {
    setRoles([...roles, { role: "", description: "", count: 1 }]);
  };

  const addAvailability = () => {
    setAvailability([...availability, { day: "", start: "", end: "" }]);
  };

  const toAmPm = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const submitProject = async (e) => {
    e.preventDefault();

    const formattedRoles = roles.map((r) => ({
      role: r.role.trim(),
      description: r.description.trim(),
      count: Number(r.count),
    }));

    const formattedAvailability = availability.map((a) => ({
      day: a.day,
      time: `${toAmPm(a.start)}-${toAmPm(a.end)}`,
    }));

    try {
      await axios.post(
        "https://hackbuzz.onrender.com/api/projects",
        {
          title: title.trim(),
          description: description.trim(),
          postedBy: user._id,
          requiredRoles: formattedRoles,
          availability: formattedAvailability,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Project created successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert(
        "❌ Failed to create project: " +
          (err.response?.data?.error || "Check console.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2f35]">
      <Header variant="dashboard" />

      <main className="pt-32 px-4 pb-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-8">
            Create Project
          </h1>

          <form onSubmit={submitProject}>
            <label className="block font-semibold mb-2 text-black-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded mb-6"
              required
            />

            <label className="block font-semibold mb-2 text-black-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border p-3 rounded mb-8"
              required
            />

            <label className="block font-semibold mb-3 text-black-700">
              Required Roles
            </label>

            {roles.map((r, i) => (
              <div key={i} className="flex flex-wrap gap-3 mb-3">
                <input
                  placeholder="Role"
                  value={r.role}
                  onChange={(e) => {
                    const updated = [...roles];
                    updated[i].role = e.target.value;
                    setRoles(updated);
                  }}
                  className="border p-2 rounded flex-1"
                  required
                />
                <input
                  placeholder="Description"
                  value={r.description}
                  onChange={(e) => {
                    const updated = [...roles];
                    updated[i].description = e.target.value;
                    setRoles(updated);
                  }}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  min={1}
                  value={r.count}
                  onChange={(e) => {
                    const updated = [...roles];
                    updated[i].count = e.target.value;
                    setRoles(updated);
                  }}
                  className="border p-2 rounded w-24"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addRole}
              className="text-sm font-semibold text-gray-700 underline mb-8"
            >
              + Add Role
            </button>

            <label className="block font-semibold mb-3 text-black-700">
              Availability
            </label>

            {availability.map((a, i) => (
              <div key={i} className="flex flex-wrap gap-3 mb-3">
                <select
                  value={a.day}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[i].day = e.target.value;
                    setAvailability(updated);
                  }}
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select Day</option>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>

                <input
                  type="time"
                  value={a.start}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[i].start = e.target.value;
                    setAvailability(updated);
                  }}
                  className="border p-2 rounded flex-1"
                  required
                />

                <input
                  type="time"
                  value={a.end}
                  onChange={(e) => {
                    const updated = [...availability];
                    updated[i].end = e.target.value;
                    setAvailability(updated);
                  }}
                  className="border p-2 rounded flex-1"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addAvailability}
              className="text-sm font-semibold text-gray-700 underline mb-10"
            >
              + Add Availability
            </button>

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

export default CreateProject;