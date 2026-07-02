import express from "express";
import {
	createNewComments,
	deleteUserComment,
	getAllCommentsForPost,
	updateUserComment,
} from "../controllers/comment.controller.js";
import { validateNewComment } from "../../middlewares/validation.middleware.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/:id", getAllCommentsForPost);
router.post("/:id", validateNewComment, createNewComments);
router.delete("/:id", deleteUserComment);
router.put("/:id", updateUserComment);

export default router;
