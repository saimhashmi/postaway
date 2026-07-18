import {
	deleteComment,
	getComments,
	postComments,
	updateComment,
} from "./comment.repository.js";
import { NotFoundError } from "../../utils/errors.js";

export const getCommentforPost = async (req, res, next) => {
	try {
		const postId = req.params.postId;
		const comments = await getComments(postId);

		if (!comments) {
			throw new NotFoundError("No comments available");
		}

		return res.status(200).json({
			success: true,
			data: comments,
		});
	} catch (error) {
		next(error);
	}
};

export const createNewComments = async (req, res, next) => {
	try {
		const userId = req.userId;
		const postId = req.params.postId;
		const content = req.body.content;

		const newComment = await postComments({ userId, postId, content });

		return res.status(201).json({
			success: true,
			data: newComment,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUserComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const userId = req.userId;

		const deletedComment = await deleteComment(userId, commentId);

		if (!deletedComment) throw new NotFoundError(`Comment not found`);

		return res.status(200).json({
			success: true,
			data: deletedComment,
		});
	} catch (error) {
		next(error);
	}
};

export const updateUserComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const userId = req.userId;
		const content = req.body.content;

		const updatedComment = await updateComment({
			commentId,
			userId,
			content,
		});

		if (!updatedComment) {
			throw new NotFoundError(`Comment not found`);
		}
		return res.status(200).json({
			success: true,
			data: updatedComment,
		});
	} catch (error) {
		next(error);
	}
};
