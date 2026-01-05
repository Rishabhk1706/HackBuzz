import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">HackBuzz</h3>
          <p>
            Empowering students to connect, create, and collaborate in the world of technology and innovation.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <p><Link to="/colleges" className="hover:underline">Explore Colleges</Link></p>
          <p><Link to="/allevents" className="hover:underline">Browse Events</Link></p>
          <p><Link to="/allprojects" className="hover:underline">View Projects</Link></p>
          <p><Link to="/dashboard" className="hover:underline">Dashboard</Link></p>
        </div>
        <div>
          <h3 className="font-bold mb-2">For Students</h3>
          <p><Link to="/create" className="hover:underline">Sign Up</Link></p>
          <p><Link to="/login" className="hover:underline">Login</Link></p>
          <p><Link to="/help" className="hover:underline">Help Center</Link></p>
          <p><Link to="/terms" className="hover:underline">Terms & Conditions</Link></p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p>Email: hello@hackbuzz.com</p>
          <p>Follow us on social media for updates and announcements.</p>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8">
        &copy; 2025 HackBuzz. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;