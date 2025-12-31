import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import profileImg from "../assets/profile.jpg";
import EventSkeleton from "../components/EventSkeleton";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const isOwner = loggedInUser?._id === id;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    college: "",
    resumeLink: "",
    githubProfile: "",
    interests: "",
    skills: "",
  });

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `https://hackbuzz.onrender.com/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setFormData({
        name: data.name || "",
        email: data.email || "",
        username: data.username || "",
        college: data.college?.name || "",
        resumeLink: data.resumeLink || "",
        githubProfile: data.githubProfile || "",
        interests: data.interests?.join(", ") || "",
        skills: data.skills?.join(", ") || "",
      });
    } catch {
      alert("Could not load profile.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (!isOwner) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      alert("You are not allowed to edit this profile.");
      return;
    }

    try {
      const updatedData = {
        name: formData.name,
        resumeLink: formData.resumeLink,
        githubProfile: formData.githubProfile,
        interests: formData.interests.split(",").map((s) => s.trim()),
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      const res = await axios.put(
        `https://hackbuzz.onrender.com/api/users/${loggedInUser._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile.");
    }
  };

  if(loading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f25] to-[#2a2f35]">
        <Header variant="dashboard" />
        <div className="pt-32 px-4 max-w-4xl mx-auto">
          <EventSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="dashboard" />

      <main className="pt-32 pb-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border">

          <h1 className="text-3xl font-bold text-center mb-6">
            {isOwner ? "My Profile" : "User Profile"}
          </h1>

          <div className="flex items-center justify-center gap-5 mb-8 p-4 rounded-xl bg-gradient-to-r from-black to-gray-800">
            <img
              src={profileImg}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-gray-300"
            />
            <div className="text-white">
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-sm opacity-80">
                {formData.college || "Student"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {[
              ["name", "Name"],
              ["email", "Email", true],
              ["username", "Username", true],
              ["college", "College", true],
              ["resumeLink", "Resume Link"],
              ["githubProfile", "GitHub Profile"],
              ["interests", "Interests (comma separated)"],
              ["skills", "Skills (comma separated)"],
            ].map(([key, label, alwaysReadOnly]) => (
              <div key={key}>
                <label className="font-semibold">{label}</label>
                <input
                  name={key}
                  value={formData[key]}
                  readOnly={alwaysReadOnly || !isOwner}
                  onChange={handleChange}
                  className={`w-full mt-1 p-3 border rounded-lg ${
                    !isOwner || alwaysReadOnly
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:outline-none focus:ring-2 focus:ring-gray-400"
                  }`}
                />
              </div>
            ))}

            {isOwner && (
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-black to-gray-800 text-white font-bold rounded-lg hover:scale-105 transition"
              >
                Update Profile
              </button>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;