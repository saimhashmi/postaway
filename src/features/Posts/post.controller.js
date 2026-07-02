import {
	createPosts,
	getPosts,
	getPostsByuserId,
	updatePost,
	deletePost,
} from "../models/post.model.js";
import { NotFoundError, ServerError } from "../../utils/errors.js";

export const getAllPosts = (req, res, next) => {
	try {
		const posts = getPosts();
		if (posts.length == 0) {
			throw new NotFoundError("No posts available");
		}
		return res.status(200).json({
			success: true,
			data: posts,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const getOnePost = (req, res, next) => {
	try {
		const postId = req.params.id;
		const post = getPosts(postId);
		if (!post) {
			throw new NotFoundError(`Post with id: ${postId}, not found`);
		}

		return res.status(200).json({
			success: true,
			data: post,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const getPostsByUser = (req, res, next) => {
	try {
		const userId = req.userId;
		const posts = getPostsByuserId(userId);

		if (!posts) {
			throw new NotFoundError("No posts available");
		}

		return res.status(200).json({
			success: true,
			data: posts,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const createNewPost = (req, res, next) => {
	try {
		const userId = req.userId;
		const { caption } = req.body;
		const imageUrl = req.file
			? `./uploads/${req.file.filename}`
			: req.body.imageUrl;

		const newPost = createPosts(userId, caption, imageUrl);

		return res.status(201).json({
			success: true,
			data: newPost,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const deleteUserPost = (req, res, next) => {
	try {
		const postId = req.params.id;
		const userId = req.userId;
		const deletedPost = deletePost(postId, userId);

		if (deletedPost) {
			return res.status(200).json({
				success: true,
				data: deletedPost,
			});
		} else {
			throw new NotFoundError(`Post with id: ${postId}, not found`);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const updateUserPost = (req, res, next) => {
	try {
		const id = req.params.id;
		const userId = req.userId;
		const caption = req.body?.caption ?? null;
		const imageUrl = req.file
			? `./uploads/${req.file.filename}`
			: req.body.imageUrl;

		const updatedPost = updatePost({ id, userId, caption, imageUrl });

		if (updatedPost) {
			return res.status(201).json({
				success: true,
				data: updatedPost,
			});
		} else {
			throw new NotFoundError(`Post with id: ${id}, not found`);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};
