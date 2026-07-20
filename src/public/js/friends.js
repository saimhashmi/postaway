const Friends = {
	async init() {
		if (!Router.requireAuth()) return;
		await UI.loadNavbar("friends");
		await this.loadFriends();
		await this.loadPendingRequests();

		document.getElementById("tab-friends")?.addEventListener("click", () => {
			this.setActiveTab("friends");
		});
		document.getElementById("tab-requests")?.addEventListener("click", () => {
			this.setActiveTab("requests");
		});
	},

	setActiveTab(tab) {
		document.getElementById("friends-panel")?.classList.toggle("hidden", tab !== "friends");
		document.getElementById("requests-panel")?.classList.toggle("hidden", tab !== "requests");
		document.getElementById("tab-friends")?.classList.toggle("bg-indigo-600", tab === "friends");
		document.getElementById("tab-friends")?.classList.toggle("text-white", tab === "friends");
		document.getElementById("tab-requests")?.classList.toggle("bg-indigo-600", tab === "requests");
		document.getElementById("tab-requests")?.classList.toggle("text-white", tab === "requests");
	},

	async loadFriends() {
		const container = document.getElementById("friends-list");
		UI.showLoading(container);

		try {
			const userId = Auth.getUserId();
			const result = await API.get(`/api/friends/get-friends/${userId}`);
			const friends = result.data?.friends || [];

			if (friends.length === 0) {
				UI.showEmpty(container, "You have no friends yet.");
				return;
			}

			container.innerHTML = friends
				.map((entry) => {
					const user = entry.user || {};
					const pending = entry.pending ? " (pending)" : "";
					return `
						<div class="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
							<div class="flex items-center gap-3">
								<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-12 w-12 rounded-full object-cover bg-gray-100">
								<div>
									<a href="/app/user.html?id=${getUserId(user)}" class="font-medium text-gray-900 hover:text-indigo-600">${escapeHtml(user.name)}</a>
									<p class="text-sm text-gray-500">${escapeHtml(user.email)}${pending}</p>
								</div>
							</div>
							<button type="button" data-remove-friend="${getUserId(user)}" class="text-sm text-red-500 hover:text-red-700">Remove</button>
						</div>
					`;
				})
				.join("");

			container.querySelectorAll("[data-remove-friend]").forEach((button) => {
				button.addEventListener("click", async () => {
					try {
						const result = await API.post(
							`/api/friends/toggle-friendship/${button.dataset.removeFriend}`,
						);
						UI.toast(result.data, "success");
						await this.loadFriends();
					} catch (error) {
						UI.toast(error.message, "error");
					}
				});
			});
		} catch (error) {
			if (error.message?.includes("no friends")) {
				UI.showEmpty(container, "You have no friends yet.");
				return;
			}
			container.innerHTML = `<p class="text-center text-red-500 py-10">${escapeHtml(error.message)}</p>`;
		}
	},

	async loadPendingRequests() {
		const container = document.getElementById("requests-list");

		try {
			const result = await API.get("/api/friends/get-pending-requests");
			const requests = result.data?.friendRequests || [];

			if (requests.length === 0) {
				container.innerHTML = `<p class="text-center text-gray-500 py-10">No pending requests.</p>`;
				return;
			}

			container.innerHTML = requests
				.map((user) => `
					<div class="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
						<div class="flex items-center gap-3">
							<img src="${normalizeImageUrl(user.avatar)}" alt="" class="h-12 w-12 rounded-full object-cover bg-gray-100">
							<div>
								<p class="font-medium text-gray-900">${escapeHtml(user.name)}</p>
								<p class="text-sm text-gray-500">${escapeHtml(user.email)}</p>
							</div>
						</div>
						<div class="flex gap-2">
							<button type="button" data-accept="${user._id}" class="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">Accept</button>
							<button type="button" data-reject="${user._id}" class="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Reject</button>
						</div>
					</div>
				`)
				.join("");

			container.querySelectorAll("[data-accept]").forEach((button) => {
				button.addEventListener("click", () =>
					this.respond(button.dataset.accept, true),
				);
			});

			container.querySelectorAll("[data-reject]").forEach((button) => {
				button.addEventListener("click", () =>
					this.respond(button.dataset.reject, false),
				);
			});
		} catch (error) {
			if (error.message?.includes("no pending")) {
				container.innerHTML = `<p class="text-center text-gray-500 py-10">No pending requests.</p>`;
				return;
			}
			container.innerHTML = `<p class="text-center text-red-500 py-10">${escapeHtml(error.message)}</p>`;
		}
	},

	async respond(friendId, accept) {
		try {
			const result = await API.post(
				`/api/friends/response-to-request/${friendId}`,
				{ accept },
			);
			UI.toast(result.data, "success");
			await this.loadFriends();
			await this.loadPendingRequests();
		} catch (error) {
			UI.toast(error.message, "error");
		}
	},
};

document.addEventListener("DOMContentLoaded", () => Friends.init());
