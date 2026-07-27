import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutImg from "../assets/about.webp";
const About = () => {
  return (
    <>
      <Header />
      <section className="pt-28 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-400">HackBuzz</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A unified platform for students to connect, collaborate, and
            innovate across colleges. Discover events, share projects, and
            unlock opportunities to shine.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img
            src={aboutImg}
            alt="Collaboration"
            className="w-full max-w-sm md:max-w-md mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 object-cover"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We started HackBuzz with one goal in mind – to help
              students from all colleges collaborate and showcase their talent
              in the world of technology. Our platform bridges gaps, encourages
              teamwork, and fuels creativity for aspiring innovators.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With growing partnerships and an ever-expanding community, we
              strive to make inter-college hackathons accessible to every
              student, creating a global hub of innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What We Stand For
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
          {[
            {
              icon: "🎯",
              title: "Our Mission",
              desc: "To connect students across colleges and give them the tools to innovate and collaborate globally.",
            },
            {
              icon: "🚀",
              title: "Our Vision",
              desc: "To become the leading hub for hackathons, empowering every student to showcase their skills to the world.",
            },
            {
              icon: "🤝",
              title: "Our Values",
              desc: "Collaboration, creativity, and continuous learning are at the heart of everything we do.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-5xl block mb-3">{item.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

        <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-center text-white px-6">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-gray-800">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
            Let's Build the <span className="text-blue-400">Future</span> Together
            </h2>
            <p className="mb-8 text-lg text-gray-300">
            Connect with innovators, join groundbreaking hackathons, and make your
            mark in the tech world. The future belongs to creators – are you one of them?
            </p>
            <Link
            to="/register"
            className="relative inline-block px-8 py-3 rounded-full font-semibold text-lg 
            bg-gradient-to-r from-blue-600 to-purple-600 
            text-white shadow-md 
            hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
            🚀 Join the Community
            </Link>
        </div>
        </section>

      <Footer />
    </>
  );
};

export default About;