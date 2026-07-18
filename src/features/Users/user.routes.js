import express from "express";
import {
	getUserDetails,
	getAllUserDetails,
	userSignup,
	userSignin,
	userLogout,
	updateUserDetails,
	userLogoutAllDevices,
	verifyEmail,
} from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/get-details/:userId", jwtAuth, getUserDetails);
router.get("/get-all-details", jwtAuth, getAllUserDetails);
router.get("/verify-email", verifyEmail);
router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.post("/logout", jwtAuth, userLogout);
router.post("/logout-all-devices", jwtAuth, userLogoutAllDevices);
router.put("/update-details/:userId", jwtAuth, updateUserDetails);

export default router;
