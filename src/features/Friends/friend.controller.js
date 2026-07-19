import { ClientError, NotFoundError } from "../../utils/errors.js";
import {
	getFriends,
	getPendingRequests,
	responseToRequest,
	toggleFriendship,
} from "./friend.repository.js";

export const getUsersFriends = async (req, res, next) => {
	try {
		const userId =
			req.params.userId === ":userId" ? req.userId : req.params.userId;
		const friends = await getFriends(userId);

		if (!friends) {
			throw new NotFoundError("You have no friends");
		}

		return res.status(200).json({
			success: true,
			data: friends,
		});
	} catch (error) {
		next(error);
	}
};

export const getPendingFriendRequests = async (req, res, next) => {
	try {
		const userId = req.userId;
		const pendingFriendRequests = await getPendingRequests(userId);

		if (!pendingFriendRequests) {
			throw new NotFoundError("You have no pending requests");
		}

		return res.status(200).json({
			success: true,
			data: pendingFriendRequests,
		});
	} catch (error) {
		next(error);
	}
};

export const toggleUserFriendship = async (req, res, next) => {
	try {
		const userId = req.userId;
		const friendId = req.params.friendId;

		if (userId === friendId) {
			throw new ClientError(
				"You cannot be your own friend (on postaway atleast)",
			);
		}

		const result = await toggleFriendship(userId, friendId);

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const responseToFriendRequest = async (req, res, next) => {
	try {
		const userId = req.userId;
		const friendId = req.params.friendId;
		const accept = req.body.accept ?? false;
		const result = await responseToRequest(userId, friendId, accept);

		return res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
