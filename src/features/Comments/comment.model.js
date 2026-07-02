import { UnauthorizedError } from "../../utils/errors.js";

let id = 0;
let comments = [];

export default class CommentModel {
	constructor(userId, postId, content) {
		this.id = ++id;
		this.userId = userId;
		this.postId = postId;
		this.content = content;
	}
}

export const getComments = (postId) => {
	return comments.filter((comment) => comment.postId == postId);
};

export const postCommet = (userId, postId, content) => {
	const newComment = new CommentModel(userId, postId, content);
	comments.push(newComment);
	return newComment;
};

export const deleteComment = (commentId, userId) => {
	const index = comments.findIndex((comment) => comment.id == commentId);
	if (index > -1) {
		if (comments[index].userId !== userId) {
			throw new UnauthorizedError(
				"User cannot delete another user's comments",
			);
		}
		const [removed] = comments.splice(index, 1);
		return removed;
	}
	return false;
};

export const updateComment = (newData) => {
	const index = comments.findIndex(
		(comment) => comment.id == newData.commentId,
	);
	if (index > -1) {
		if (comments[index].userId !== newData.userId) {
			throw new UnauthorizedError(
				"User cannot modify another user's comments",
			);
		}
		comments[index].content = newData.content;
		return comments[index];
	}
	return false;
};
