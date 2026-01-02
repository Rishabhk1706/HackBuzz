import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import homeImg from "../assets/home.png";
import landingbg from "../assets/landingbg.png";

const Home = () => {

  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                entry.target.textContent = target + "+";
                clearInterval(timer);
              } else {
                entry.target.textContent = Math.floor(current) + "+";
              }
            }, 20);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((counter) => observer.observe(counter));
  }, []);

  return (
    <>
      <Header variant="home" />

      <section id="home" className="relative bg-cover bg-center pt-28 pb-24 px-6" style={{ backgroundImage: `url(${landingbg})` }}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-400 animate-spin-slow"></div>
            <img
              src={homeImg}
              alt="Students collaborating"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1 text-center lg:text-center animate-fadeIn">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
              Student Hub for
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Hacks & Collabs
              </span>
            </h1>

            <p className="text-lg mb-8 text-yellow-100 max-w-xl mx-auto animate-slideUp delay-200">
              The ultimate platform for students to discover hackathons, share project ideas,
              and build amazing things together.
            </p>

            <div className="flex gap-4 justify-center flex-wrap animate-slideUp delay-300">
              <a
                href="/register"
                className="bg-gradient-to-r from-pink-500 to-purple-700 px-8 py-3 rounded-full
                          text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl
                          transition-transform duration-300"
              >
                Get Registered
              </a>
              <a
                href="/colleges"
                className="bg-gradient-to-r from-red-400 to-yellow-400 px-8 py-3 rounded-full
                          text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl
                          transition-transform duration-300"
              >
                Explore Colleges
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-19 px-6 mt-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Discover Events", desc: "Find hackathons, coding competitions, and tech events happening in colleges near you. Never miss an opportunity to showcase your skills." },
              { icon: "🚀", title: "Share Projects", desc: "Post your project ideas, find collaborators, and get help from the community. Turn your concepts into reality with the right team." },
              { icon: "🤝", title: "Team Matching", desc: "Connect with like-minded students who complement your skills. Our smart matching system helps you find the perfect teammates." },
              { icon: "📊", title: "Track Progress", desc: "Monitor your involvement in events, track your project contributions, and build a portfolio that showcases your achievements." },
              { icon: "🌟", title: "Build Network", desc: "Connect with students from different colleges, share experiences, and build lasting professional relationships." },
              { icon: "💡", title: "Get Inspired", desc: "Browse through innovative projects, learn from others' experiences, and get inspired to create something amazing." },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-xl hover:-translate-y-1 transition transform">
                <span className="text-4xl block mb-3">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" >
            {[
              { num: "1", title: "Sign Up", desc: "Create your account and set up your profile with your skills, interests, and college information." },
              { num: "2", title: "Explore", desc: "Browse events in your area, discover exciting projects, and find opportunities that match your interests." },
              { num: "3", title: "Connect", desc: "Join teams, collaborate on projects, and connect with fellow students who share your passion for innovation." },
              { num: "4", title: "Create", desc: "Build amazing projects, participate in hackathons, and showcase your skills to the community." },
            ].map((step, i) => (
              <div key={i} className="text-center bg-gray-50 p-6 rounded-lg shadow" >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="bg-black text-white py-16 px-6 text-center" style={{ backgroundImage: `url(${landingbg})` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="stat-item">
            <h3 className="text-4xl font-bold counter" data-target="10">10+</h3>
            <p>Active Students</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold counter" data-target="53">53+</h3>
            <p>Partner Colleges</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold counter" data-target="10">10+</h3>
            <p>Events Posted</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold counter" data-target="6">6+</h3>
            <p>Projects Shared</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-700 mb-6">
            Join thousands of students who are already connecting, creating, and collaborating on HackBuzz.
          </p>
          <a href="/register" className="bg-gradient-to-r from-pink-500 to-purple-700 px-6 py-3 rounded-full text-white font-semibold shadow-md">
            Join the Community
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;