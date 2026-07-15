import {
	deleteComment,
	getComments,
	postCommet,
	updateComment,
} from "../models/comment.model.js";
import { NotFoundError } from "../../utils/errors.js";

export const getAllCommentsForPost = (req, res, next) => {
	try {
		const postId = req.params.id;
		const comments = getComments(postId);
		if (comments.length == 0) {
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

export const createNewComments = (req, res, next) => {
	try {
		const userId = req.userId;
		const postId = parseInt(req.params.id);
		const content = req.body.content;

		const newComment = postCommet(userId, postId, content);

		return res.status(201).json({
			success: true,
			data: newComment,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUserComment = (req, res, next) => {
	try {
		const commentId = req.params.id;
		const userId = req.userId;
		const deletedComment = deleteComment(commentId, userId);

		if (deletedComment) {
			return res.status(200).json({
				success: true,
				data: deletedComment,
			});
		} else {
			throw new NotFoundError(`Comment with id: ${commentId}, not found`);
		}
	} catch (error) {
		next(error);
	}
};

export const updateUserComment = (req, res, next) => {
	try {
		const commentId = req.params.id;
		const userId = req.userId;
		const { content } = req.body;

		const updatedComment = updateComment({ commentId, userId, content });

		if (updatedComment) {
			return res.status(200).json({
				success: true,
				data: updatedComment,
			});
		} else {
			throw new NotFoundError(`Comment with id: ${commentId}, not found`);
		}
	} catch (error) {
		next(error);
	}
};
