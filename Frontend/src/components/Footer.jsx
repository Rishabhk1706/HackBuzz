import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">HackBuzz</h3>
          <p>Empowering students to connect, create, and collaborate in the world of technology and innovation.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <p><a href="/colleges" className="hover:underline">Explore Colleges</a></p>
          <p><a href="/allevents" className="hover:underline">Browse Events</a></p>
          <p><a href="/allprojects" className="hover:underline">View Projects</a></p>
          <p><a href="/dashboard" className="hover:underline">Dashboard</a></p>
        </div>
        <div>
          <h3 className="font-bold mb-2">For Students</h3>
          <p><a href="/create" className="hover:underline">Sign Up</a></p>
          <p><a href="/login" className="hover:underline">Login</a></p>
          <p><a href="/help" className="hover:underline">Help Center</a></p>
          <p><a href="/terms" className="hover:underline">Terms & Conditions</a></p>
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
