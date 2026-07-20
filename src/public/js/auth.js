const Auth = {
	TOKEN_KEY: "postaway_jwt",
	USER_KEY: "postaway_user",

	getToken() {
		return sessionStorage.getItem(this.TOKEN_KEY);
	},

	getSession() {
		const raw = sessionStorage.getItem(this.USER_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	},

	getUserId() {
		return this.getSession()?.userId || null;
	},

	setSession(token) {
		sessionStorage.setItem(this.TOKEN_KEY, token);
		const payload = parseJwt(token);
		if (payload?.userId) {
			sessionStorage.setItem(
				this.USER_KEY,
				JSON.stringify({
					userId: payload.userId,
					email: payload.email,
				}),
			);
		}
	},

	clearSession() {
		sessionStorage.removeItem(this.TOKEN_KEY);
		sessionStorage.removeItem(this.USER_KEY);
	},

	isLoggedIn() {
		return Boolean(this.getToken());
	},

	async login(email, password) {
		const result = await API.post(
			"/api/users/signin",
			{ email, password },
			{ skipAuthRedirect: true },
		);
		const token = result.data?.JWT;
		if (!token) throw new Error("Login failed");
		this.setSession(token);
		return result;
	},

	async logout() {
		try {
			await API.post("/api/users/logout");
		} catch {
			// Still clear local session if server logout fails.
		}
		this.clearSession();
		window.location.href = "/auth/login.html";
	},

	async signup(payload) {
		return API.post("/api/users/signup", payload, {
			skipAuthRedirect: true,
		});
	},
};
