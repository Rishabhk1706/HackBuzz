import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import loginphoto from "../assets/loginphoto.webp";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loginMsg, setLoginMsg] = useState({ text: "", type: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
        navigate("/dashboard");
        return;
    }

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if(rememberedEmail){
        setEmail(rememberedEmail);
        setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg({ text: "", type: "" });
    try {
      const res = await axios.post("https://hackbuzz.onrender.com/api/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if(rememberMe){
        localStorage.setItem("rememberedEmail", email);
      }
      else{
        localStorage.removeItem("rememberedEmail");
      }
      setLoginMsg({ text: "Login successful!", type: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      const msg =
        error.response?.data?.error || error.message || "Login failed";
      setLoginMsg({ text: msg, type: "error" });
    }
  };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header variant="auth" />

            <main className="flex-grow flex items-center justify-center pt-40 pb-40 px-4">
                <div className="flex flex-col md:flex-row bg-black shadow-2xl rounded-lg overflow-hidden w-full max-w-4xl min-h-[400px]">
                    <Link to="/" className="block flex-1 min-h-[220px] md:min-h-0">
                        <div
                            className="h-40 md:h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${loginphoto})` }}
                        />
                    </Link>

                    <div className="flex-1 p-8 flex flex-col justify-center bg-black text-white">
                        <h2 className="text-2xl font-bold mb-2">Log in to your account</h2>
                        <p className="text-sm mb-5">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-purple-300 hover:underline">
                                Create one
                            </Link>
                        </p>

                        <form className="flex flex-col gap-3" onSubmit={handleLogin}>
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                className="py-3 px-4 rounded-md bg-gray-800 text-white placeholder-gray-400 border-none mb-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    className="py-3 px-4 pr-10 rounded-md w-full bg-gray-800 text-white placeholder-gray-400 border-none mb-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    onClick={() => setShowPwd((p) => !p)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-lg text-gray-400 hover:text-white select-none"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                >
                                    {showPwd ? "🙈" : "👁️"}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-300 mb-3 gap-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="accent-purple-500" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="text-purple-300 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            {loginMsg.text && (
                                <div
                                    className={`text-center text-sm mb-2 ${
                                        loginMsg.type === "success"
                                            ? "text-green-500"
                                            : "text-rose-400"
                                    }`}
                                >
                                    {loginMsg.text}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-800 transition-colors text-white py-2 px-8 rounded-full text-base font-semibold"
                                >
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;