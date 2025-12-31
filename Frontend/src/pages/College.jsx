import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSkeleton from "../components/EventSkeleton";

const Colleges = () => {
  const [allColleges, setAllColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get("https://hackbuzz.onrender.com/api/colleges");
        const sortedColleges = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setAllColleges(sortedColleges);
        setFilteredColleges(sortedColleges);
      } catch (err) {
        console.error("Error fetching colleges", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = allColleges.filter(
      (college) =>
        college.name.toLowerCase().includes(term) ||
        college.location.toLowerCase().includes(term) ||
        college.domain.toLowerCase().includes(term)
    );
    setFilteredColleges(filtered);
  }, [searchTerm, allColleges]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const CollegeCard = ({ college }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-400 ease-in-out hover:translate-y-[-10px] hover:shadow-2xl text-center border border-gray-100">
      <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>
      <h3 className="text-2xl text-gray-800 font-semibold mb-4">{college.name}</h3>
      <div className="text-gray-600 mb-2">
        <strong className="font-semibold">Location:</strong>
        <p className="text-gray-900 text-base">{college.location}</p>
      </div>
      <div className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-medium mt-4 inline-block">
        {college.domain}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="pt-32 pb-16 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-4 text-black py-4">
            Participating Colleges 🏛️
          </h1>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover amazing educational institutions that are part of our hackathon community.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <input
              type="text"
              className="w-full p-4 border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-purple-600 transition-all duration-300 shadow-sm focus:shadow-md"
              placeholder="Search colleges by name, location, or domain..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-lg text-red-500 py-12">
              <p>Unable to load colleges. Please check your connection and try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-black text-white px-6 py-3 rounded-full mt-6 font-semibold transition-all duration-300 hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="text-center text-lg text-gray-500 py-12">
              <p>No colleges found matching your search criteria. 😔</p>
            </div>
          ) : (
            <>
              <div className="text-center text-gray-500 text-base mb-8">
                Showing {filteredColleges.length} college{filteredColleges.length === 1 ? "" : "s"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredColleges.map((college, index) => (
                  <CollegeCard key={index} college={college} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Colleges;