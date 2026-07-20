const Likes = {
	async getLikes(itemId, type) {
		try {
			const result = await API.get(
				`/api/likes/${itemId}?type=${encodeURIComponent(type)}`,
			);
			return result.data || [];
		} catch (error) {
			if (error.message?.includes("No likes")) return [];
			throw error;
		}
	},

	isLikedByUser(likes, userId) {
		return likes.some((like) => getUserId(like.user) === userId);
	},

	async toggle(itemId, type) {
		const result = await API.post(
			`/api/likes/toggle/${itemId}?type=${encodeURIComponent(type)}`,
		);
		return result.data;
	},
};
