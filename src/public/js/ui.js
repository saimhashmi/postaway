const UI = {
	toast(message, type = "info") {
		let container = document.getElementById("toast-container");
		if (!container) {
			container = document.createElement("div");
			container.id = "toast-container";
			container.className =
				"fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm";
			document.body.appendChild(container);
		}

		const colors = {
			info: "bg-indigo-600",
			success: "bg-green-600",
			error: "bg-red-600",
		};

		const toast = document.createElement("div");
		toast.className = `${colors[type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg text-sm`;
		toast.textContent = message;
		container.appendChild(toast);

		setTimeout(() => toast.remove(), 3500);
	},

	showLoading(container, message = "Loading...") {
		container.innerHTML = `
			<div class="flex flex-col items-center justify-center py-16 text-gray-500">
				<div class="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
				<p class="mt-4 text-sm">${escapeHtml(message)}</p>
			</div>
		`;
	},

	showEmpty(container, message, actionHtml = "") {
		container.innerHTML = `
			<div class="text-center py-16 text-gray-500">
				<p class="text-lg font-medium text-gray-700">${escapeHtml(message)}</p>
				${actionHtml}
			</div>
		`;
	},

	async confirm(message) {
		return window.confirm(message);
	},

	openModal(title, bodyHtml, footerHtml) {
		this.closeModal();

		const overlay = document.createElement("div");
		overlay.id = "modal-overlay";
		overlay.className =
			"fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4";
		overlay.innerHTML = `
			<div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
				<div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
					<h3 class="text-lg font-semibold text-gray-900">${escapeHtml(title)}</h3>
					<button type="button" data-close-modal class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
				</div>
				<div class="px-5 py-4">${bodyHtml}</div>
				<div class="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">${footerHtml}</div>
			</div>
		`;

		overlay.addEventListener("click", (event) => {
			if (
				event.target === overlay ||
				event.target.closest("[data-close-modal]")
			) {
				this.closeModal();
			}
		});

		document.body.appendChild(overlay);
		return overlay;
	},

	closeModal() {
		document.getElementById("modal-overlay")?.remove();
	},

	async loadNavbar(activePage = "") {
		const slot = document.getElementById("navbar-slot");
		if (!slot) return;

		const response = await fetch("/components/navbar.html");
		slot.innerHTML = await response.text();

		const session = Auth.getSession();
		const emailEl = document.getElementById("nav-email");
		if (emailEl && session?.email) {
			emailEl.textContent = session.email;
		}

		document.getElementById("nav-logout")?.addEventListener("click", () => {
			Auth.logout();
		});

		document.getElementById("nav-new-post")?.addEventListener("click", () => {
			if (window.location.pathname.endsWith("/app/feed.html")) {
				window.dispatchEvent(new CustomEvent("postaway:open-create-post"));
				return;
			}
			window.location.href = "/app/feed.html#create";
		});

		document
			.querySelectorAll("[data-nav-link]")
			.forEach((link) => {
				if (link.dataset.navLink === activePage) {
					link.classList.add("text-indigo-600", "font-semibold");
				}
			});

		try {
			const pending = await API.get("/api/friends/get-pending-requests");
			const count = pending.data?.friendRequests?.length || 0;
			const badge = document.getElementById("pending-badge");
			if (badge && count > 0) {
				badge.textContent = String(count);
				badge.classList.remove("hidden");
			}
		} catch {
			// Ignore badge errors on pages without auth.
		}
	},
};
