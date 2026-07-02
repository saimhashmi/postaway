let id = 0;
let likes = [];

export default class LikeModel {
	constructor(userId, postId) {
		this.id = ++id;
		this.userId = userId;
		this.postId = postId;
	}
}

export const getLikes = (postId) => {
	return likes.filter((like) => like.postId == postId);
};

// Removes the like if it exists, adds it if it doesn't.
export const toggleLike = (userId, postId) => {
	const existingIndex = likes.findIndex(
		(like) => like.userId == userId && like.postId == postId,
	);

	if (existingIndex > -1) {
		const [removed] = likes.splice(existingIndex, 1);
		return { action: "unliked", like: removed };
	}

	const newLike = new LikeModel(userId, postId);
	likes.push(newLike);
	return { action: "liked", like: newLike };
};
