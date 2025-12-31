import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import profileImg from "../assets/profile.jpg";
import logo from "../assets/logo.svg";

const Header = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const loggedIn = !!token;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="fixed top-0 w-full bg-black text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
    
        <div
          className="flex items-center gap-2 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="HackBuzz Logo" className="w-8 h-8" />
          <span>HackBuzz</span>
        </div>

        <div className="flex items-center gap-4">
          
          <div className="hidden md:block">
            <Navbar variant={variant} />
          </div>

          {loggedIn && user && (
            <div className="relative hidden md:block" ref={profileRef}>
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-300">
                    {user.role || "Student"}
                  </div>
                </div>
                <img
                  src={profileImg}
                  alt="profile"
                  className="w-9 h-9 rounded-full ring-2 ring-white/30"
                />
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-14 bg-white text-black rounded-xl shadow-xl w-44 overflow-hidden">
                  <button
                    onClick={() => {
                      navigate(`/users/${user._id}`);
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-100 text-left flex gap-2 items-center"
                  >
                    👤 <span>My Profile</span>
                  </button>

                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 hover:bg-gray-100 text-left text-red-600 flex gap-2 items-center"
                  >
                    🚪 <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        variant={variant}
        user={user}
        onLogout={logout}
      />
    </header>
  );
};

export default Header;