import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import loginphoto from "../assets/loginphoto.webp";

const Create = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [emailDomain, setEmailDomain] = useState("domain.ac.in");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [finalEmail, setFinalEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      navigate("/dashboard", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get("https://hackbuzz.onrender.com/api/colleges");
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setColleges(sorted);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
        alert("Could not load colleges. Please try again later.");
      }
    };
    fetchColleges();
  }, []);

  const handleCollegeChange = (e) => {
    const selected = colleges.find((c) => c._id === e.target.value);
    if (selected) {
      setCollege(selected._id);
      setEmailDomain(selected.domain);
    } else {
      setCollege("");
      setEmailDomain("domain.ac.in");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terms) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    if (!college || !emailDomain) {
      alert("Please select a valid college.");
      return;
    }

    const email = `${emailPrefix}@${emailDomain}`;
    setFinalEmail(email);

    try {
      setLoading(true);

      await axios.post("https://hackbuzz.onrender.com/api/auth/send-otp", {
        email,
        purpose: "signup",
      });

      alert("OTP sent to your email");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    if(!otp.trim()){
      alert("Please enter OTP");
      return;
    }
    try {
      setLoading(true);

      await axios.post("https://hackbuzz.onrender.com/api/auth/verify-otp", {
        email: finalEmail,
        otp,
      });

      await axios.post("https://hackbuzz.onrender.com/api/auth/register", {
        name,
        username,
        email: finalEmail,
        password,
        college,
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header variant="auth" />

      <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-20">
        <div className="flex w-full max-w-5xl shadow-xl bg-white rounded-lg overflow-hidden">
          <div
            className="hidden md:flex flex-1 bg-cover bg-center p-6"
            style={{ backgroundImage: `url(${loginphoto})` }}
          ></div>

          <div className="flex-1 p-8 bg-black text-white">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-400 mb-6">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:underline">
                Log in
              </Link>
            </p>

            <form
              className={`space-y-4 ${
                step === 2 ? "opacity-50 pointer-events-none" : ""
              }`}
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              />

              <select
                value={college}
                onChange={handleCollegeChange}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              >
                <option value="" disabled>
                  Select College
                </option>
                {colleges.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} - {c.location}
                  </option>
                ))}
              </select>

              <div className="flex items-center rounded-md bg-gray-800 border border-gray-700">
                <input
                  type="text"
                  placeholder="College Email"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  required
                  className="flex-grow p-3 bg-transparent text-white outline-none"
                />
                <span className="px-3 text-gray-400">@{emailDomain}</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 pr-12 rounded-md bg-gray-800 border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label>
                  I agree to the{" "}
                  <Link to="/terms" className="text-purple-400">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-52 py-3 rounded-3xl font-semibold transition 
                    ${loading
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {loading ? "Sending OTP..." : "Create Account"}
                </button>
              </div>
            </form>

            {step === 2 && (
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
                />

                <button
                  onClick={verifyOtpAndRegister}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold"
                >
                  Verify OTP & Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Create;