import express from "express";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/", jwtAuth, getUsers);
router.post("/signup", validateNewUser, userSignup);
router.post("/signin", userSignin);

export default router;
