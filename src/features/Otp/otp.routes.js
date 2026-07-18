import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";
import {
	resetPasswordforUser,
	sendOtpToUser,
	verifyOtpFromUser,
} from "./otp.controller.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.post("/send", sendOtpToUser);
router.post("/verify", verifyOtpFromUser);
router.post("/reset-password", jwtAuth, resetPasswordforUser);

export default router;
