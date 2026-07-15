import mongoose from "mongoose";
import { ClientError, ServerError } from "../../utils/errors.js";
import Post from "./post.schema.js";
import User from "../Users/user.schema.js";

export const getPosts = async (postId = null) => {
	try {
		if (postId) {
			return await Post.findById(postId);
		}

		return await Post.find();
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const getPostByUserId = async (userId) => {
	try {
		return await Post.find({ userId: userId });
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

		return post;
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
