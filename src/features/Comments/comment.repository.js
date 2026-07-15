import { ServerError, UnauthorizedError } from "../../utils/errors.js";
import Post from "../Posts/post.schema.js";
import User from "../Users/user.schema.js";
import Comment from "./comment.schema.js";

export const getComments = async (postId) => {
	try {
		return await Comment.find({ postId: postId }).populate({
			path: "userId",
			model: "User",
			select: "avatar name",
		});
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const postComments = async (comment) => {
	try {
		const newComment = new Comment(comment);

		await newComment.save();

		const updatedUser = await User.findByIdAndUpdate(
			comment.userId,
			{
				$push: { comments: newComment._id },
			},
			{ new: true },
		);

		const updatedPost = await Post.findByIdAndUpdate(
			comment.postId,
			{
				$push: { comments: newComment._id },
			},
			{ new: true },
		);
		console.log(updatedPost, updatedPost);
		return newComment;
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const deleteComment = async (userId, commentId) => {
	try {
		const comment = await Comment.findById(commentId);
		const post = await Post.findById(comment.postId);
		if (
			userId !== comment.userId.toString() &&
			userId !== post.userId.toString()
		) {
			throw new UnauthorizedError();
		}
		const deletedComment = await Comment.findOneAndDelete({
			_id: commentId,
			userId: userId,
		});
		console.log(deletedComment);
		await User.findByIdAndUpdate(userId, {
			$pull: { comments: commentId },
		});
		await Post.findByIdAndUpdate(deletedComment.postId, {
			$pull: { comments: commentId },
		});

		return deletedComment;
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			throw error;
		}
		throw new ServerError({ error });
	}
};

export const updateComment = async (userId, commentId, content) => {
	try {
		const comment = await Comment.findById(commentId);
		const post = await Post.findById(comment.postId);
		if (
			userId !== comment.userId.toString() &&
			userId !== post.userId.toString()
		) {
			throw new UnauthorizedError();
		}

		const updatedComment = await Comment.findOneAndUpdate(
			{
				_id: commentId,
				userId: userId,
			},
			{
				content: content,
			},
			{
				new: true,
			},
		);

		return updatedComment;
	} catch (error) {
		throw new ServerError({ error });
	}
};
