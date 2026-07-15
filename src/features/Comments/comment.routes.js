import express from "express";
import { validateNewComment } from "../../middlewares/validation.middleware.js";
import {
	createNewComments,
	deleteUserComment,
	getCommentforPost,
	updateUserComment,
} from "./comment.controller.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/:postId", getCommentforPost);
router.post("/:postId", validateNewComment, createNewComments);
router.delete("/:commentId", deleteUserComment);
router.put("/:commentId", updateUserComment);

export default router;
