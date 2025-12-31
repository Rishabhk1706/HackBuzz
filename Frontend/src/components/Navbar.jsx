import React from "react";
import { Link} from "react-router-dom";

const Navbar = ({ variant }) => {
  const loggedIn = !!localStorage.getItem("token");
  const isAuthPage = variant === "auth";
  const isHomePage = variant === "home";
  const isDashboardPage = variant === "dashboard";
  return (
    <ul className="flex gap-6 items-center">
      {!isDashboardPage && (
      <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
      )}
      {isHomePage && (
        <>
          <li><a href="#features" className="hover:text-gray-300">Features</a></li>
          <li><a href="#how-it-works" className="hover:text-gray-300">How It Works</a></li>
        </>
      )}
      {!isDashboardPage && (
      <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
      )}
      {isAuthPage && (
        <li><Link to="/colleges" className="hover:text-gray-300">Colleges</Link></li>
      )}
      {loggedIn && !isDashboardPage && (
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
      )}
      {!loggedIn && (
        <li>
          <Link
            to="/login"
            className="bg-gradient-to-r from-pink-500 to-purple-700 px-5 py-2 rounded-full font-semibold"
          >
            Login
          </Link>
        </li>
      )}
    </ul>
  );
};

export default Navbar;
