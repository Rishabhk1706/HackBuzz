import React from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const MobileMenu = ({ isOpen, onClose, variant, user, onLogout}) => {
  const navigate = useNavigate();
  const loggedIn = !!user;
  const isAuthPage = variant === "auth";
  const isHomePage = variant === "home";
  const isDashboardPage = variant === "dashboard";
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="bg-white w-3/4 max-w-xs h-full shadow-lg p-6 flex flex-col space-y-6">

        <button
          className="self-end text-2xl font-bold text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {loggedIn && user && (
          <div
            onClick={() => {
              navigate(`/users/${user._id}`);
              onClose();
            }}
            className="flex items-center gap-3 border-b pb-4 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
          >
            <img
              src={profileImg}
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-black">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">
                {user.role || "Student"}
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col space-y-4 text-lg font-semibold">
          <Link
            to="/"
            onClick={onClose}
            className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800"
          >
            Home
          </Link>
          {isHomePage && (
            <>
              <a href="#features" onClick={onClose} className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800">Features</a>
              <a href="#how-it-works" onClick={onClose} className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800">How It Works</a>
            </>
          )}
          
          <Link
            to="/about"
            onClick={onClose}
            className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800"
          >
            About
          </Link>
          {isAuthPage && (
            <Link
              to="/colleges"
              onClick={onClose}
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800"
            >
              Colleges
            </Link>
          )}
          {loggedIn && !isDashboardPage && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800"
            >
              Dashboard
            </Link>
          )}

          {loggedIn && user && (
            <>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-full text-center hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}

          {!loggedIn && (
            <Link
              to="/login"
              onClick={onClose}
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-center transition-colors duration-300 hover:bg-gray-700 focus:outline-none active:bg-gray-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
