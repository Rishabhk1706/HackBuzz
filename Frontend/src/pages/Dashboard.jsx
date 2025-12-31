import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

import eventImg from "../assets/event.png";
import projectImg from "../assets/project.png";
import teamImg from "../assets/team.png";

const slides = [
  { img: eventImg, text: "Connect with Amazing Peers at our Events", link: "/events" },
  { img: projectImg, text: "Collaborate in Valuable Projects", link: "/projects" },
  { img: teamImg, text: "Make Teams for the Event", link: "/match-requests" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const [stats, setStats] = useState({
    upcomingEvents: 0,
    activeProjects: 0,
    teamRequests: 0,
    totalEvents: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    const headers = { Authorization: `Bearer ${token}` };

    const loadData = async () => {
      try {
        const eventsRes = await axios.get("https://hackbuzz.onrender.com/api/events", { headers });
        const projectsRes = await axios.get("https://hackbuzz.onrender.com/api/projects", { headers });
        const matchRes = await axios.get("https://hackbuzz.onrender.com/api/match-requests", { headers });

        const now = new Date();

        setStats({
          upcomingEvents: eventsRes.data.filter(e => new Date(e.startDate) > now).length,
          totalEvents: eventsRes.data.length,
          activeProjects: projectsRes.data.filter(p => p.status === "Open").length,
          teamRequests: matchRes.data.length,
        });
      } catch (err) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header variant="dashboard"/>

      <main className="pt-32 px-6 max-w-7xl mx-auto flex-grow w-full">

        {/* Slideshow */}
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
          <img
            src={slides[slideIndex].img}
            alt="slide"
            onClick={() => navigate(slides[slideIndex].link)}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/20">
            <div className="text-xl font-semibold">{slides[slideIndex].text}</div>
          </div>
          
          <div className="absolute bottom-8 right-8 flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === slideIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Upcoming Events", value: stats.upcomingEvents, link: "/events", color: "blue", icon: "📅" },
            { label: "Active Projects", value: stats.activeProjects, link: "/projects", color: "purple", icon: "💼" },
            { label: "Team Requests", value: stats.teamRequests, link: "/match-requests", color: "orange", icon: "🤝" },
            { label: "Total Events", value: stats.totalEvents, color: "green", icon: "🎯" },
          ].map((s, i) => (
            <div
              key={i}
              onClick={() => s.link && navigate(s.link)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden relative group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-100 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
              <div className="relative">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-4xl font-bold text-${s.color}-600`}>{s.value}</div>
                <div className="text-sm text-gray-600 mt-2 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          {[
            {
              title: "Events",
              icon: "📅",
              bgColor: "bg-blue-50",
              items: [
                ["All Events", "Browse upcoming/past events", "/events"],
                ["Post an Event", "Create new event", "/events/new"],
                ["My Events", "Update your events", "/events/update"],
              ],
            },
            {
              title: "Team Requests",
              icon: "🤝",
              bgColor: "bg-orange-50",
              items: [
                ["All Requests", "Find team for events", "/match-requests"],
                ["Create Request", "Create team request", "/match-requests/new"],
                ["My Requests", "Update requests", "/match-requests/update"],
              ],
            },
            {
              title: "Projects",
              icon: "💼",
              bgColor: "bg-purple-50",
              items: [
                ["All Projects", "View projects", "/projects"],
                ["Post Project", "Share idea", "/projects/new"],
                ["My Projects", "Update projects", "/projects/update"],
              ],
            },
            {
              title: "Quick Access",
              icon: "⚙️",
              bgColor: "bg-green-50",
              items: [
                ["Home", "Main page", "/"],
                ["About", "Learn more", "/about"],
                ["Colleges", "View colleges", "/colleges"],
              ],
            },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`text-3xl p-3 rounded-xl ${card.bgColor}`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{card.title}</h3>
              </div>

              <div className="space-y-3">
                {card.items.map((item, j) => (
                  <div
                    key={j}
                    onClick={() => navigate(item[2])}
                    className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-900 hover:to-black hover:text-white transition-all duration-300 px-5 py-4 rounded-xl cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="font-semibold text-sm">{item[0]}</div>
                      {item[1] && <div className="text-xs opacity-70 mt-0.5">{item[1]}</div>}
                    </div>
                    <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;