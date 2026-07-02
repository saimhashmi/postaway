import express from "express";
import {
	getUsers,
	userSignup,
	userSignin,
} from "../controllers/user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";
import { validateNewUser } from "../../middlewares/validation.middleware.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/", jwtAuth, getUsers);
router.post("/signup", validateNewUser, userSignup);
router.post("/signin", userSignin);

export default router;
