const PostPage = {
	post: null,

	async init() {
		if (!Router.requireAuth()) return;
		await UI.loadNavbar("feed");

		const postId = getQueryParam("id");
		if (!postId) {
			window.location.href = "/app/feed.html";
			return;
		}

		await this.loadPost(postId);
	},

	async loadPost(postId) {
		const container = document.getElementById("post-container");
		UI.showLoading(container);

		try {
			const [post, comments, likes] = await Promise.all([
				Posts.getOne(postId),
				Comments.getForPost(postId),
				Likes.getLikes(postId, "Post"),
			]);

			this.post = post;
			const currentUserId = Auth.getUserId();
			const user = post.userId || {};
			const isOwner = getUserId(post.userId) === currentUserId;
			const liked = Likes.isLikedByUser(likes, currentUserId);

			container.innerHTML = `
				<article class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
					<div class="p-4 flex items-center gap-3">
						<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-10 w-10 rounded-full object-cover bg-gray-100">
						<div>
							<a href="/app/user.html?id=${getUserId(user)}" class="font-semibold text-gray-900 hover:text-indigo-600">${escapeHtml(user.name || "User")}</a>
							<p class="text-xs text-gray-400">${formatRelativeTime(post.timeStamp)}</p>
						</div>
					</div>
					<img src="${normalizeImageUrl(post.imageUrl)}" alt="" class="w-full max-h-[28rem] object-contain bg-gray-100">
					<div class="p-4">
						<p class="text-gray-800">${escapeHtml(post.caption)}</p>
						<div class="flex items-center gap-4 mt-4 text-sm">
							<button id="like-post-btn" type="button" class="${liked ? "text-red-500" : "text-gray-600"} hover:text-red-500">
								${liked ? "♥" : "♡"} <span id="post-like-count">${likes.length}</span>
							</button>
							<span class="text-gray-500">${comments.length} comments</span>
							${
								isOwner
									? `
								<button id="edit-post-btn" type="button" class="text-gray-500 hover:text-indigo-600 ml-auto">Edit</button>
								<button id="delete-post-btn" type="button" class="text-red-500 hover:text-red-700">Delete</button>
							`
									: ""
							}
						</div>
					</div>
				</article>

				<section class="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
					<form id="comment-form" class="flex gap-2 mb-4">
						<input name="content" required placeholder="Write a comment..." class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm">
						<button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Post</button>
					</form>
					<div id="comments-list">
						${comments.length === 0 ? `<p class="text-gray-500 text-sm py-4 text-center">No comments yet.</p>` : comments.map((comment) => Comments.renderComment(comment, currentUserId)).join("")}
					</div>
				</section>
			`;

			this.bindActions(postId, currentUserId);
		} catch (error) {
			container.innerHTML = `<p class="text-center text-red-500 py-10">${escapeHtml(error.message)}</p>`;
		}
	},

	bindActions(postId, currentUserId) {
		document
			.getElementById("like-post-btn")
			?.addEventListener("click", async () => {
				try {
					await Likes.toggle(postId, "Post");
					const likes = await Likes.getLikes(postId, "Post");
					const liked = Likes.isLikedByUser(likes, currentUserId);
					const button = document.getElementById("like-post-btn");
					button.className = `${liked ? "text-red-500" : "text-gray-600"} hover:text-red-500`;
					button.innerHTML = `${liked ? "♥" : "♡"} <span id="post-like-count">${likes.length}</span>`;
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});

		document
			.getElementById("delete-post-btn")
			?.addEventListener("click", async () => {
				if (!(await UI.confirm("Delete this post?"))) return;
				try {
					await Posts.remove(postId);
					UI.toast("Post deleted", "success");
					window.location.href = "/app/feed.html";
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});

		document
			.getElementById("edit-post-btn")
			?.addEventListener("click", () => {
				Posts.openEditModal(this.post, () => this.loadPost(postId));
			});

		document
			.getElementById("comment-form")
			?.addEventListener("submit", async (event) => {
				event.preventDefault();
				const input = event.target.content;
				const content = input.value.trim();
				if (!content) return;

				try {
					await Comments.create(postId, content);
					input.value = "";
					UI.toast("Comment added", "success");
					await this.loadPost(postId);
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});

		document.querySelectorAll("[data-delete-comment]").forEach((button) => {
			button.addEventListener("click", async () => {
				if (!(await UI.confirm("Delete this comment?"))) return;
				try {
					await Comments.remove(button.dataset.deleteComment);
					UI.toast("Comment deleted", "success");
					await this.loadPost(postId);
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});
		});

		document.querySelectorAll("[data-edit-comment]").forEach((button) => {
			button.addEventListener("click", async () => {
				const commentId = button.dataset.editComment;
				const row = button.closest("[data-comment-id]");
				const current =
					row.querySelector(".comment-content").textContent;
				const updated = window.prompt("Edit comment", current);
				if (updated === null || updated.trim() === "") return;

				try {
					await Comments.update(commentId, updated.trim());
					UI.toast("Comment updated", "success");
					await this.loadPost(postId);
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});
		});

		document.querySelectorAll("[data-like-comment]").forEach((button) => {
			button.addEventListener("click", async () => {
				try {
					await Likes.toggle(button.dataset.likeComment, "Comment");
					UI.toast("Comment like updated", "success");
				} catch (error) {
					UI.toast(error.message, "error");
				}
			});
		});
	},
};

document.addEventListener("DOMContentLoaded", () => PostPage.init());
