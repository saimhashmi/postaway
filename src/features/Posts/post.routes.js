import express from "express";
import {
	createNewPost,
	deleteUserPost,
	getAllPosts,
	getOnePost,
	getPostsByUser,
	updateUserPost,
} from "../controllers/post.controller.js";
import { upload } from "../../middlewares/fileUpload.middlewware.js";
import { validateNewPost } from "../../middlewares/validation.middleware.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/all", getAllPosts);
router.get("/:id", getOnePost);
router.get("/", getPostsByUser);
router.post("/", upload.single("imageUrl"), validateNewPost, createNewPost);
router.delete("/:id", deleteUserPost);
router.put("/:id", upload.single("imageUrl"), updateUserPost);

export default router;
