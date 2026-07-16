import express from "express";
import { getLikesById, toggleLikeById } from "./like.controller.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/:Id", getLikesById);
router.post("/toggle/:Id", toggleLikeById);

export default router;
