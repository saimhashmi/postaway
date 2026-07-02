import express from "express";
import {
	getLikesForPosts,
	toggleLikeForPost,
} from "../controllers/like.controller.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/:postId", getLikesForPosts);
router.get("/toggle/:postId", toggleLikeForPost);

export default router;
