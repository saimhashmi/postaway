const Router = {
	requireAuth() {
		if (!Auth.isLoggedIn()) {
			window.location.href = "/auth/login.html";
			return false;
		}
		return true;
	},

	redirectIfAuthed(target = "/app/feed.html") {
		if (Auth.isLoggedIn()) {
			window.location.href = target;
			return true;
		}
		return false;
	},
};
