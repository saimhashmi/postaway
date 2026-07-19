import mongoose from "mongoose";
import { ClientError, NotFoundError, ServerError } from "../../utils/errors.js";
import User from "../Users/user.schema.js";

export const getFriends = async (userId) => {
	try {
		const friends = await User.findById(userId)
			.select("friends")
			.populate("friends.user", "name avatar email");

		return friends;
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		}

		throw new ServerError({ error });
	}
};

export const getPendingRequests = async (userId) => {
	try {
		const friendRequests = await User.findById(userId)
			.select("friendRequests")
			.populate("friendRequests", "avatar name email");

		return friendRequests;
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		}

		throw new ServerError({ error });
	}
};

export const toggleFriendship = async (userId, friendId) => {
	try {
		const existingFriendship = await User.findOne({
			_id: userId,
			"friends.user": friendId,
		});

		if (existingFriendship) {
			// Remove friend from the User's Document
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { friends: { user: friendId } } },
			);
			// Remove User from the friend's Document
			if (existingFriendship.pending) {
				await User.findOneAndUpdate(
					{ _id: friendId },
					{ $pull: { friendRequests: userId } },
				);
				return "Friend request cancelled";
			} else {
				await User.findOneAndUpdate(
					{ _id: friendId },
					{ $pull: { friends: { user: userId } } },
				);
				return "Friend Removed";
			}
		} else {
			// Send friend request
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $addToSet: { friends: { user: friendId } } },
			);
			// Receive friend request on other side
			await User.findOneAndUpdate(
				{ _id: friendId },
				{ $addToSet: { friendRequests: userId } },
			);

			return "Friend Request Sent";
		}
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		}

		throw new ServerError({ error });
	}
};

export const responseToRequest = async (userId, friendId, accept) => {
	try {
		if (accept) {
			const existingFriendship = await User.findOne({
				_id: userId,
				"friends.user": friendId,
			});
			if (existingFriendship) {
				const friendship = existingFriendship.friends?.find(
					(f) => f.user.toString() === friendId,
				);
				if (!friendship.pending)
					throw new ClientError("already accepted");
			}

			// Update on Users side
			await User.updateOne(
				{ _id: userId },
				{
					$pull: { friendRequests: friendId },
					$push: { friends: { user: friendId, pending: false } },
				},
			);

			// Update on friends side
			await User.updateOne(
				{ _id: friendId, "friends.user": userId },
				{ $set: { "friends.$.pending": false } },
			);

			return "Friend request accepted";
		} else {
			const existingFriendship = await User.findOne({
				_id: userId,
				"friends.user": friendId,
			});

			if (existingFriendship) {
				const friendship = existingFriendship.friends.find(
					(f) => f.user.toString() === friendId,
				);
				if (!friendship.pending)
					throw new ClientError("already accepted");
			}

			// Update on Users side
			await User.updateOne(
				{ _id: userId },
				{ $pull: { friendRequests: friendId } },
			);

			// Update on friends side
			await User.updateOne(
				{ _id: friendId },
				{ $pull: { friends: { user: userId } } },
			);

			return "Friend request rejected";
		}
	} catch (error) {
		// Intercepting Mongoose CastError specifically
		if (
			error instanceof mongoose.Error.CastError ||
			error.name === "CastError"
		) {
			throw new ClientError("Invalid ID format", error);
		} else if (
			error instanceof ClientError ||
			error.name === "ClientError"
		) {
			throw new ClientError(error.message);
		}
		throw new ServerError({ error });
	}
};
