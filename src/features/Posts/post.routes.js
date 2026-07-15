import express from "express";
import {
	createNewPost,
	deleteUserPost,
	getAllPosts,
	getOnePost,
	getPostsByUser,
	updateUserPost,
} from "./post.controller.js";
import { upload } from "../../middlewares/fileUpload.middlewware.js";
import { validateNewPost } from "../../middlewares/validation.middleware.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/all", getAllPosts);
router.get("/:postId", getOnePost);
router.get("/user/:userId", getPostsByUser);
router.post("/", upload.single("imageUrl"), validateNewPost, createNewPost);
router.delete("/:postId", deleteUserPost);
router.put("/:postId", upload.single("imageUrl"), updateUserPost);

export default router;
