const Feed = {
	postsCache: [],

	async init() {
		if (!Router.requireAuth()) return;
		await UI.loadNavbar("feed");
		await this.loadFeed();

		const openCreateModal = () => {
			Posts.openCreateModal(() => this.loadFeed());
		};

		if (window.location.hash === "#create") {
			openCreateModal();
			history.replaceState(null, "", window.location.pathname);
		}

		window.addEventListener("postaway:open-create-post", openCreateModal);
		window.addEventListener("hashchange", () => {
			if (window.location.hash === "#create") {
				openCreateModal();
				history.replaceState(null, "", window.location.pathname);
			}
		});

		document.getElementById("open-create-post")?.addEventListener("click", openCreateModal);
	},

	async loadFeed() {
		const container = document.getElementById("feed-container");
		UI.showLoading(container);

		try {
			const posts = await Posts.getAll();
			this.postsCache = posts;

			if (posts.length === 0) {
				UI.showEmpty(
					container,
					"No posts yet",
					`<button id="empty-create-post" class="mt-4 inline-flex bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Create the first post</button>`,
				);
				document
					.getElementById("empty-create-post")
					?.addEventListener("click", () => {
						Posts.openCreateModal(() => this.loadFeed());
					});
				return;
			}

			const currentUserId = Auth.getUserId();
			const cards = await Promise.all(
				posts.map(async (post) => {
					const likes = await Likes.getLikes(post._id, "Post");
					return Posts.renderPostCard(post, currentUserId, likes);
				}),
			);

			container.innerHTML = `<div class="space-y-6">${cards.join("")}</div>`;
			this.bindActions(container, currentUserId);
		} catch (error) {
			container.innerHTML = `<p class="text-center text-red-500 py-10">${escapeHtml(error.message)}</p>`;
		}
	},

	bindActions(container, currentUserId) {
		container.querySelectorAll("[data-like-post]").forEach((button) => {
			button.addEventListener("click", async () => {
				const postId = button.dataset.likePost;
				try {
					await Likes.toggle(postId, "Post");
					const likes = await Likes.getLikes(postId, "Post");
					const countEl = container.querySelector(
						`[data-like-count="${postId}"]`,
					);
					if (countEl) countEl.textContent = String(likes.length);
					button.classList.toggle("text-red-500", Likes.isLikedByUser(likes, currentUserId));
					button.classList.toggle("text-gray-600", !Likes.isLikedByUser(likes, currentUserId));
					button.innerHTML = `${Likes.isLikedByUser(likes, currentUserId) ? "♥" : "♡"} <span data-like-count="${postId}">${likes.length}</span>`;
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});
		});

		container.querySelectorAll("[data-delete-post]").forEach((button) => {
			button.addEventListener("click", async () => {
				const postId = button.dataset.deletePost;
				if (!(await UI.confirm("Delete this post?"))) return;
				try {
					await Posts.remove(postId);
					UI.toast("Post deleted", "success");
					await this.loadFeed();
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});
		});

		container.querySelectorAll("[data-edit-post]").forEach((button) => {
			button.addEventListener("click", async () => {
				const postId = button.dataset.editPost;
				const post = this.postsCache.find((item) => item._id === postId);
				if (!post) return;
				Posts.openEditModal(post, () => this.loadFeed());
			});
		});
	},
};

document.addEventListener("DOMContentLoaded", () => Feed.init());
