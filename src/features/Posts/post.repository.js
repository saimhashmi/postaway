import mongoose from "mongoose";
import { ClientError, ServerError } from "../../utils/errors.js";
import Post from "./post.schema.js";
import User from "../Users/user.schema.js";

export const getPosts = async (postId = null) => {
	try {
		if (postId) {
			return await Post.findById(postId)
				.populate({
					path: "userId",
					model: "User",
					select: "avatar name email",
				})
				.populate({
					path: "comments",
					select: "userId content",
					populate: {
						path: "userId",
						model: "User",
						select: "avatar name email",
					},
				});
		}

		return await Post.find()
			.populate({
				path: "userId",
				model: "User",
				select: "avatar name",
			})
			.populate({
				path: "comments",
				select: "userId content",
				populate: {
					path: "userId",
					model: "User",
					select: "avatar name",
				},
			});
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const getPostByUserId = async (userId) => {
	try {
		return await Post.find({ userId: userId }).populate({
			path: "comments",
			populate: {
				path: "userId",
				model: "User",
				select: "name",
			},
		});
	} catch (error) {
		throw new ServerError({ error: error });
	}
};

export const createPost = async (post) => {
	try {
		const newPost = new Post(post);
		await newPost.save();
		await User.findByIdAndUpdate(newPost.userId, {
			$push: { posts: newPost._id },
		});

		return newPost;
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const deletePost = async (postId, userId) => {
	try {
		const deletedItem = await Post.findOneAndDelete({
			_id: postId,
			userId: userId,
		});
		await User.findByIdAndUpdate(userId, {
			$pull: { posts: postId },
		});
		return deletedItem;
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		}

		throw new ServerError({ error: error });
	}
};

export const updatePost = async (updatePost) => {
	try {
		const { postId, userId, caption, imageUrl } = updatePost;
		const post = await Post.findById(postId);

		if (!post) return null;
		post.caption = updatePost.caption ?? post.caption;
		post.imageUrl = updatePost.imageUrl ?? post.imageUrl;

		await post.save();

		return post.populate({
			path: "comments",
			populate: {
				path: "userId",
				model: "User",
				select: "name",
			},
		});
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		}

		throw new ServerError({ error: error });
	}
};
