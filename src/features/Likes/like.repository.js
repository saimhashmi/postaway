import Like from "./like.schema.js";
import { ServerError } from "../../utils/errors.js";
import { populate } from "dotenv";

export const getLikes = async (itemId, type) => {
	try {
		if (type === "Post") {
			return await Like.find({
				like: itemId,
				type: type,
			})
				.populate({
					path: "user",
					model: "User",
					select: "name email",
				})
				.populate({
					path: "like",
					model: type,
					select: "caption imageUrl comments timeStamp",
				});
		} else {
			return await Like.find({
				like: itemId,
				type: type,
			})
				.populate({
					path: "user",
					model: "User",
					select: "name email",
				})
				.populate({
					path: "like",
					model: type,
					select: "postId content timeStamp",
					populate: {
						path: "postId",
						model: "Post",
						select: "userId caption imageUrl comments timeStamp",
						populate: {
							path: "userId",
							model: "User",
							select: "name email",
						},
					},
				});
		}
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const toggleLike = async (userId, itemId, type) => {
	try {
		const existingLike = await Like.findOne({
			user: userId,
			like: itemId,
			type: type,
		});
		if (existingLike) {
			await existingLike.deleteOne();
			return existingLike;
		} else {
			const newLike = new Like({
				user: userId,
				like: itemId,
				type: type,
			});

			return await newLike.save();
		}
	} catch (error) {
		throw new ServerError();
	}
};
