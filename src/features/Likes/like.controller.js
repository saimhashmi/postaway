import { getLikes, toggleLike } from "../models/like.model.js";
import { NotFoundError } from "../../utils/errors.js";

export const getLikesForPosts = (req, res, next) => {
	try {
		const postId = req.params.postId;
		const likes = getLikes(postId);
		if (likes.length == 0) {
			throw new NotFoundError("No likes available");
		}
		return res.status(200).json({
			success: true,
			data: likes,
		});
	} catch (error) {
		next(error);
	}
};

export const toggleLikeForPost = (req, res, next) => {
	try {
		const userId = req.userId;
		const postId = req.params.postId;

		const newLike = toggleLike(userId, postId);

		return res.status(200).json({
			success: true,
			data: newLike,
		});
	} catch (error) {
		next(error);
	}
};
