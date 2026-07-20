const Posts = {
	async getAll() {
		try {
			const result = await API.get("/api/posts/all");
			return result.data || [];
		} catch (error) {
			if (error.message?.includes("No posts")) return [];
			throw error;
		}
	},

	async getOne(postId) {
		const result = await API.get(`/api/posts/${postId}`);
		return result.data;
	},

	async getByUser(userId) {
		const posts = await this.getAll();
		return posts.filter((post) => getUserId(post.userId) === userId);
	},

	async create(formData) {
		const result = await API.upload("/api/posts/", formData);
		return result.data;
	},

	async update(postId, formData) {
		const result = await API.upload(
			`/api/posts/${postId}`,
			formData,
			"PUT",
		);
		return result.data;
	},

	async remove(postId) {
		const result = await API.delete(`/api/posts/${postId}`);
		return result.data;
	},

	openCreateModal(onSuccess) {
		const body = `
			<form id="create-post-form" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Caption</label>
					<textarea name="caption" required rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Image file</label>
					<input type="file" name="imageFile" accept="image/*" class="w-full text-sm">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Or image URL</label>
					<input type="url" name="imageUrl" placeholder="https://..." class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
				</div>
			</form>
		`;

		const footer = `
			<button type="button" data-close-modal class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
			<button type="submit" form="create-post-form" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Post</button>
		`;

		const overlay = UI.openModal("Create Post", body, footer);
		const form = overlay.querySelector("#create-post-form");

		form.addEventListener("submit", async (event) => {
			event.preventDefault();
			const formData = new FormData(form);
			const caption = formData.get("caption");
			const file = formData.get("imageFile");
			const imageUrl = formData.get("imageUrl");

			const payload = new FormData();
			payload.append("caption", caption);
			if (file && file.size > 0) {
				payload.append("imageUrl", file);
			} else if (imageUrl) {
				payload.append("imageUrl", imageUrl);
			} else {
				UI.toast("Please add an image file or URL", "error");
				return;
			}

			try {
				await Posts.create(payload);
				UI.closeModal();
				UI.toast("Post created", "success");
				if (onSuccess) onSuccess();
			} catch (error) {
				UI.toast(error.message, "error");
			}
		});
	},

	openEditModal(post, onSuccess) {
		const body = `
			<form id="edit-post-form" class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Caption</label>
					<textarea name="caption" required rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">${escapeHtml(post.caption)}</textarea>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Replace image (optional)</label>
					<input type="file" name="imageFile" accept="image/*" class="w-full text-sm">
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Or image URL</label>
					<input type="url" name="imageUrl" placeholder="https://..." class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
				</div>
			</form>
		`;

		const footer = `
			<button type="button" data-close-modal class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
			<button type="submit" form="edit-post-form" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
		`;

		const overlay = UI.openModal("Edit Post", body, footer);
		const form = overlay.querySelector("#edit-post-form");

		form.addEventListener("submit", async (event) => {
			event.preventDefault();
			const formData = new FormData(form);
			const payload = new FormData();
			payload.append("caption", formData.get("caption"));

			const file = formData.get("imageFile");
			const imageUrl = formData.get("imageUrl");
			if (file && file.size > 0) {
				payload.append("imageUrl", file);
			} else if (imageUrl) {
				payload.append("imageUrl", imageUrl);
			}

			try {
				await Posts.update(post._id, payload);
				UI.closeModal();
				UI.toast("Post updated", "success");
				if (onSuccess) onSuccess();
			} catch (error) {
				UI.toast(error.message, "error");
			}
		});
	},

	renderPostCard(post, currentUserId, likes = []) {
		const user = post.userId || {};
		const isOwner = getUserId(post.userId) === currentUserId;
		const liked = Likes.isLikedByUser(likes, currentUserId);

		return `
			<article class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" data-post-id="${post._id}">
				<div class="p-4 flex items-center gap-3">
					<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-10 w-10 rounded-full object-cover bg-gray-100">
					<div>
						<a href="/app/user.html?id=${getUserId(user)}" class="font-semibold text-gray-900 hover:text-indigo-600">${escapeHtml(user.name || "User")}</a>
						<p class="text-xs text-gray-400">${formatRelativeTime(post.timeStamp)}</p>
					</div>
				</div>
				<a href="/app/post.html?id=${post._id}">
					<img src="${normalizeImageUrl(post.imageUrl)}" alt="" class="w-full max-h-96 object-contain bg-gray-100">
				</a>
				<div class="p-4">
					<p class="text-gray-800">${escapeHtml(post.caption)}</p>
					<div class="flex items-center gap-4 mt-4 text-sm">
						<button type="button" data-like-post="${post._id}" class="${liked ? "text-red-500" : "text-gray-600"} hover:text-red-500">
							${liked ? "♥" : "♡"} <span data-like-count="${post._id}">${likes.length}</span>
						</button>
						<a href="/app/post.html?id=${post._id}" class="text-gray-600 hover:text-indigo-600">
							💬 ${post.comments?.length || 0}
						</a>
						${
							isOwner
								? `
							<button type="button" data-edit-post="${post._id}" class="text-gray-500 hover:text-indigo-600 ml-auto">Edit</button>
							<button type="button" data-delete-post="${post._id}" class="text-red-500 hover:text-red-700">Delete</button>
						`
								: ""
						}
					</div>
				</div>
			</article>
		`;
	},
};
