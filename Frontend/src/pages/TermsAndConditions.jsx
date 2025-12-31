import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header variant="auth" />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-100 shadow-sm">
            <p className="text-lg leading-relaxed">
              Welcome to <strong className="text-indigo-600">HackBuzz</strong>. By accessing
              or using our platform, you agree to comply with and be bound by
              the following Terms and Conditions. If you do not agree, please
              do not use our services.
            </p>
          </div>

          <section className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">1.</span> Use of the Platform
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to use this platform only for lawful purposes and in a
                way that does not infringe the rights of others or restrict their
                use and enjoyment of the platform.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">2.</span> User Accounts
              </h2>
              <p className="text-gray-600 leading-relaxed">
                When creating an account, you must provide accurate and complete
                information. You are responsible for maintaining the
                confidentiality of your login credentials.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">3.</span> Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                All content, logos, designs, and software on this platform are the
                property of Hackathon Accumulator unless otherwise stated. You may
                not copy, reproduce, or distribute any content without permission.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">4.</span> Prohibited Activities
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Unauthorized access to the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Uploading malicious code or viruses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Misuse of platform features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Violation of applicable laws</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">5.</span> Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We are not responsible for any direct, indirect, or incidental
                damages arising from the use or inability to use our platform.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">6.</span> Termination
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate your account at any
                time if you violate these Terms.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">7.</span> Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update these Terms and Conditions from time to time.
                Continued use of the platform indicates acceptance of the updated
                terms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-indigo-600">8.</span> Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:support@hackathonaccumulator.com" className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 decoration-indigo-200 hover:decoration-indigo-400 transition-colors">
                  support@hackbuzz.com
                </a>.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;