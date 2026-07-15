import {
	createPost,
	deletePost,
	getPostByUserId,
	getPosts,
	updatePost,
} from "./post.repository.js";
import { NotFoundError, ServerError } from "../../utils/errors.js";

export const getAllPosts = async (req, res, next) => {
	try {
		const posts = await getPosts();
		if (posts.length == 0) {
			throw new NotFoundError("No posts available");
		}
		return res.status(200).json({
			success: true,
			data: posts,
		});
	} catch (error) {
		next(error);
	}
};

export const getOnePost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		const post = await getPosts(postId);
		if (!post) {
			throw new NotFoundError("Post not found");
		}

		return res.status(200).json({
			success: true,
			data: post,
		});
	} catch (error) {
		next(error);
	}
};

export const getPostsByUser = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const posts = await getPostByUserId(userId);

		if (!posts) {
			throw new NotFoundError("No posts available");
		}

		return res.status(200).json({
			success: true,
			data: posts,
		});
	} catch (error) {
		next(error);
	}
};

export const createNewPost = async (req, res, next) => {
	try {
		const userId = req.userId;
		const { caption } = req.body;
		const imageUrl = req.file
			? `./uploads/${req.file.filename}`
			: req.body.imageUrl;

		const newPost = await createPost({ userId, caption, imageUrl });

		return res.status(201).json({
			success: true,
			data: newPost,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUserPost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		const userId = req.userId;
		const deletedPost = await deletePost(postId, userId);

		if (!deletedPost) {
			throw new NotFoundError(`Post not found`);
		}

		return res.status(200).json({
			success: true,
			data: deletedPost,
		});
	} catch (error) {
		next(error);
	}
};

export const updateUserPost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		const userId = req.userId;
		const caption = req.body?.caption ?? null;
		const imageUrl = req.file
			? `./uploads/${req.file.filename}`
			: req.body.imageUrl;

		const updatedPost = await updatePost({
			postId,
			userId,
			caption,
			imageUrl,
		});

		if (!updatedPost) {
			throw new NotFoundError(`Post not found`);
		}

		return res.status(200).json({
			success: true,
			data: updatedPost,
		});
	} catch (error) {
		next(error);
	}
};
