import express from "express";
import {
	getPendingFriendRequests,
	getUsersFriends,
	responseToFriendRequest,
	toggleUserFriendship,
} from "./friend.controller.js";

// Initialize Express router
const router = express.Router();

// All the paths to controller methods.
router.get("/get-friends/:userId", getUsersFriends);
router.get("/get-pending-requests", getPendingFriendRequests);
router.post("/toggle-friendship/:friendId", toggleUserFriendship);
router.post("/response-to-request/:friendId", responseToFriendRequest);

export default router;
