import { getLikes, toggleLike } from "./like.repository.js";
import { NotFoundError } from "../../utils/errors.js";

export const getLikesById = async (req, res, next) => {
	try {
		const itemId = req.params.Id;
		const type = req.query.type;
		const likes = await getLikes(itemId, type);
		if (!likes) {
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

export const toggleLikeById = async (req, res, next) => {
	try {
		const userId = req.userId;
		const itemId = req.params.Id;
		const type = req.query.type;

		const newLike = await toggleLike(userId, itemId, type);

		return res.status(200).json({
			success: true,
			data: newLike,
		});
	} catch (error) {
		next(error);
	}
};
