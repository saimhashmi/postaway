import Like from "./like.schema.js";
import { ServerError } from "../../utils/errors.js";
import User from "../Users/user.schema.js";
import Post from "../Posts/post.schema.js";
import Comment from "../Comments/comment.schema.js";

export const getLikes = async (itemId, type) => {
	try {
		if (type === "Post") {
			return await Like.find({
				likedItem: itemId,
				type: type,
			})
				.populate({
					path: "user",
					model: "User",
					select: "name email",
				})
				.populate({
					path: "likedItem",
					model: type,
					select: "caption imageUrl comments timeStamp",
				});
		} else {
			return await Like.find({
				likedItem: itemId,
				type: type,
			})
				.populate({
					path: "user",
					model: "User",
					select: "name email",
				})
				.populate({
					path: "likedItem",
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
			likedItem: itemId,
			type: type,
		});
		if (existingLike) {
			await existingLike.deleteOne();
			await User.findByIdAndUpdate(userId, {
				$pull: { likes: existingLike._id },
			});
			if (type === "Post") {
				await Post.findByIdAndUpdate(itemId, {
					$pull: { likes: existingLike._id },
				});
			} else {
				await Comment.findByIdAndUpdate(itemId, {
					$pull: { likes: existingLike._id },
				});
			}

			return existingLike;
		} else {
			const newLike = new Like({
				user: userId,
				likedItem: itemId,
				type: type,
			});

			await User.findByIdAndUpdate(userId, {
				$push: { likes: newLike._id },
			});
			if (type === "Post") {
				await Post.findByIdAndUpdate(itemId, {
					$push: { likes: newLike._id },
				});
			} else {
				await Comment.findByIdAndUpdate(itemId, {
					$push: { likes: newLike._id },
				});
			}

			return await newLike.save();
		}
	} catch (error) {
		throw new ServerError({ error });
	}
};
