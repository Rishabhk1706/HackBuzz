import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import loginphoto from "../assets/loginphoto.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      await axios.post("https://hackbuzz.onrender.com/api/auth/send-otp", {
        email,
        purpose: "forgot",
      });
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      await axios.post("https://hackbuzz.onrender.com/api/auth/verify-otp", {
        email,
        otp,
      });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await axios.post("https://hackbuzz.onrender.com/api/auth/reset-password", {
        email,
        newPassword,
      });
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header variant="auth" />

      <main className="flex-grow flex items-center justify-center pt-40 pb-40 px-4">
        <div className="flex flex-col md:flex-row bg-black shadow-2xl rounded-lg overflow-hidden w-full max-w-4xl min-h-[400px]">
          
          <div
            onClick={() => navigate("/login")}
            className="block flex-1 min-h-[220px] md:min-h-0 cursor-pointer"
          >
            <div
              className="h-40 md:h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${loginphoto})` }}
            />
          </div>

          <div className="flex-1 p-8 flex flex-col justify-center bg-black text-white">
            <h2 className="text-2xl font-bold mb-2">
              {step === 1 && "Forgot your password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set new password"}
            </h2>

            <p className="text-sm mb-5 text-gray-300">
              {step === 1 && "Enter your registered email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a new secure password"}
            </p>

            {step === 1 && (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="py-3 px-4 rounded-md bg-gray-800 text-white placeholder-gray-400 border-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-800 transition-colors text-white py-2 rounded-full font-semibold"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-purple-300 text-center hover:underline mt-2 bg-transparent border-none cursor-pointer"
                >
                  Back to login
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="py-3 px-4 rounded-md bg-gray-800 text-white placeholder-gray-400 border-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded-full font-semibold"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <input
                            type={showPwd ? "text" : "password"}
                            placeholder="New password"
                            className="py-3 px-4 pr-10 rounded-md w-full bg-gray-800 text-white placeholder-gray-400 border-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPwd((p) => !p)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-lg text-gray-400 hover:text-white select-none"
                            aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                            {showPwd ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <button
                        onClick={resetPassword}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-full font-semibold"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;