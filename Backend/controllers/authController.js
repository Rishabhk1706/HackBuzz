import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  const { name, username, email, password, college } = req.body;
  if (!name || !username || !email || !password || !college) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const otpRecord = await Otp.findOne({ email });
  if (otpRecord) {
    return res
      .status(400)
      .json({ error: "Please verify OTP before registering" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({
    ...req.body,
    password: hashed,
    isVerified: true,
  });

  await user.save();

  res.status(201).json({ message: "User registered", user });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token, user });
};

export const sendOtp = async (req, res) => {
  try {
    let { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    email = email.trim().toLowerCase();
    
    purpose = purpose || "signup";

    const user = await User.findOne({ email });

    if (purpose === "signup" && user) {
      return res.status(400).json({
        error: "Email already exists. Please login instead.",
      });
    }
    
    if (purpose === "forgot" && !user) {
      return res.status(404).json({
        error: "Email not found. Please register first.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendEmail(
      email,
      "HackBuzz OTP Verification",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ error: "OTP expired" });
    }

    await Otp.deleteMany({ email });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};