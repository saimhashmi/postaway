const Profile = {
	currentUser: null,

	async initOwnProfile() {
		if (!Router.requireAuth()) return;
		await UI.loadNavbar("profile");

		const userId = Auth.getUserId();
		await this.loadProfile(userId, true);
		this.bindEditForm(userId);
	},

	async initUserProfile() {
		if (!Router.requireAuth()) return;
		await UI.loadNavbar("feed");

		const userId = getQueryParam("id");
		if (!userId) {
			window.location.href = "/app/feed.html";
			return;
		}

		await this.loadProfile(userId, false);
		this.bindFriendButton(userId);
	},

	async loadProfile(userId, isOwnProfile) {
		const container = document.getElementById("profile-container");
		UI.showLoading(container);

		try {
			const result = await API.get(`/api/users/get-details/${userId}`);
			this.currentUser = result.data;
			const user = result.data;
			const posts = await Posts.getByUser(userId);

			container.innerHTML = `
				<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
					<div class="flex flex-col sm:flex-row gap-5 items-start">
						<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-24 w-24 rounded-full object-cover bg-gray-100">
						<div class="flex-1">
							<h1 class="text-2xl font-bold text-gray-900">${escapeHtml(user.name)}</h1>
							<p class="text-gray-500 mt-1">${escapeHtml(user.email)}</p>
							<p class="text-sm text-gray-400 mt-1">${escapeHtml(user.gender || "")}</p>
							${!isOwnProfile ? `<button id="friend-action" type="button" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Add Friend</button>` : ""}
						</div>
					</div>
				</div>

				${isOwnProfile ? `
					<form id="profile-edit-form" class="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
						<h2 class="text-lg font-semibold text-gray-900">Edit Profile</h2>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
							<input name="avatar" value="${escapeHtml(user.avatar || "")}" class="w-full border border-gray-300 rounded-lg px-3 py-2">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
							<input name="name" value="${escapeHtml(user.name || "")}" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
							<select name="gender" class="w-full border border-gray-300 rounded-lg px-3 py-2">
								<option value="Male" ${user.gender === "Male" ? "selected" : ""}>Male</option>
								<option value="Female" ${user.gender === "Female" ? "selected" : ""}>Female</option>
								<option value="Others" ${user.gender === "Others" ? "selected" : ""}>Others</option>
							</select>
						</div>
						<button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Save Changes</button>
					</form>
				` : ""}

				<section class="mt-8">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Posts (${posts.length})</h2>
					<div id="profile-posts" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						${posts.length === 0 ? `<p class="text-gray-500 col-span-full text-center py-8">No posts yet.</p>` : posts.map((post) => `
							<a href="/app/post.html?id=${post._id}" class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition">
								<img src="${normalizeImageUrl(post.imageUrl)}" alt="" class="w-full h-44 object-cover bg-gray-100">
								<div class="p-3">
									<p class="text-sm text-gray-700 line-clamp-2">${escapeHtml(post.caption)}</p>
								</div>
							</a>
						`).join("")}
					</div>
				</section>
			`;
		} catch (error) {
			container.innerHTML = `<p class="text-center text-red-500 py-10">${escapeHtml(error.message)}</p>`;
		}
	},

	bindEditForm(userId) {
		document.getElementById("profile-edit-form")?.addEventListener("submit", async (event) => {
			event.preventDefault();
			const form = event.target;
			const payload = {
				avatar: form.avatar.value.trim(),
				name: form.name.value.trim(),
				gender: form.gender.value,
			};

			try {
				await API.put(`/api/users/update-details/${userId}`, payload);
				UI.toast("Profile updated", "success");
				await this.loadProfile(userId, true);
				this.bindEditForm(userId);
			} catch (error) {
				UI.toast(error.message, "error");
			}
		});
	},

	bindFriendButton(friendId) {
		const button = document.getElementById("friend-action");
		if (!button) return;

		button.addEventListener("click", async () => {
			try {
				const result = await API.post(`/api/friends/toggle-friendship/${friendId}`);
				UI.toast(result.data, "success");
			} catch (error) {
				UI.toast(error.message, "error");
			}
		});
	},
};
