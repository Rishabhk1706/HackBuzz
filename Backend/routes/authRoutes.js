import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { sendOtp, verifyOtp, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

export default router;