import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top right corner, enter your email and create a password. You'll receive a confirmation email to activate your account."
    },
    {
      question: "Can I contribute to Projects?",
      answer: "Yes! When logged in, go to project section quick apply to the role you can contribute."
    },
    {
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password' and enter your email. You'll receive a reset link within minutes."
    },
    {
      question: "Are the hackathons free to join?",
      answer: "Most hackathons on our platform are free. Check individual event details for any specific requirements or fees."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header variant="auth" />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HackBuzz Help Center
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers, get support, and learn how to make the most of HackBuzz.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-800 shadow-sm"
                />
                <svg
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Getting Started</h3>
              <p className="text-gray-600 text-sm">Learn the basics and set up your account</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Account & Login</h3>
              <p className="text-gray-600 text-sm">Manage your account and security</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Dashboard</h3>
              <p className="text-gray-600 text-sm">Track and manage your hackathons</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Troubleshooting</h3>
              <p className="text-gray-600 text-sm">Fix common issues quickly</p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                Getting Started
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Create an account to track hackathons and opportunities</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Log in to access your personalized dashboard</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Explore upcoming hackathons, challenges, and events</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🔐</span>
                Account & Login
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Forgot your password? Use the "Forgot Password" option on login</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Make sure your email address is valid and active</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>If login issues persist, clear browser cache and retry</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Dashboard & Features
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>View saved hackathons and deadlines in one place</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Track participation status and progress</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Manage your profile and preferences</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🛠️</span>
                Common Issues
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Hackathon data not loading? Refresh or try again later</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Dashboard access requires login</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1">•</span>
                  <p>Some features may be unavailable during maintenance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <span className="text-5xl">📩</span>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">Still Need Help?</h2>
                <p className="text-indigo-100 mb-6 text-lg">
                  Our support team is here to assist you with any questions or issues.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <strong>Email:</strong> support@hackbuzz.com
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>Response time:</strong> Within 24–48 hours
                  </p>
                </div>
                <a
                  href="mailto:support@hackbuzz.com"
                  className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;