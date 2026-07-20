const Comments = {
	async getForPost(postId) {
		try {
			const result = await API.get(`/api/comments/${postId}`);
			return result.data || [];
		} catch (error) {
			if (error.message?.includes("No comments")) return [];
			throw error;
		}
	},

	async create(postId, content) {
		const result = await API.post(`/api/comments/${postId}`, { content });
		return result.data;
	},

	async update(commentId, content) {
		const result = await API.put(`/api/comments/${commentId}`, { content });
		return result.data;
	},

	async remove(commentId) {
		const result = await API.delete(`/api/comments/${commentId}`);
		return result.data;
	},

	renderComment(comment, currentUserId) {
		const user = comment.userId || {};
		const isOwner = getUserId(user) === currentUserId;
		const commentId = comment._id;

		return `
			<div class="flex gap-3 py-3 border-b border-gray-100 last:border-0" data-comment-id="${commentId}">
				<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-9 w-9 rounded-full object-cover bg-gray-100">
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2">
						<span class="font-medium text-gray-900 text-sm">${escapeHtml(user.name || "User")}</span>
						<span class="text-xs text-gray-400">${formatRelativeTime(comment.timeStamp)}</span>
					</div>
					<p class="text-gray-700 text-sm mt-1 comment-content">${escapeHtml(comment.content)}</p>
					<div class="flex gap-3 mt-2 text-xs">
						<button type="button" class="text-indigo-600 hover:text-indigo-800" data-like-comment="${commentId}">Like</button>
						${isOwner ? `
							<button type="button" class="text-gray-500 hover:text-gray-700" data-edit-comment="${commentId}">Edit</button>
							<button type="button" class="text-red-500 hover:text-red-700" data-delete-comment="${commentId}">Delete</button>
						` : ""}
					</div>
				</div>
			</div>
		`;
	},
};
