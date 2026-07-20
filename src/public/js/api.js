const API = {
	async request(method, path, body, options = {}) {
		const headers = { ...(options.headers || {}) };
		const token = Auth.getToken();

		if (token && !options.skipAuth) {
			headers.Authorization = `Bearer ${token}`;
		}

		const config = {
			method,
			credentials: "include",
			headers,
		};

		if (body !== undefined && body !== null && !options.isFormData) {
			headers["Content-Type"] = "application/json";
			config.body = JSON.stringify(body);
		} else if (options.isFormData) {
			config.body = body;
		}

		const response = await fetch(path, config);
		let json = null;

		try {
			json = await response.json();
		} catch {
			json = { success: false, message: "Invalid server response" };
		}

		if (response.status === 401 && !options.skipAuthRedirect) {
			Auth.clearSession();
			if (!window.location.pathname.includes("/auth/")) {
				window.location.href = "/auth/login.html";
			}
			throw new Error(json.message || "Unauthorized");
		}

		if (!response.ok || json.success === false) {
			throw new Error(json.message || "Request failed");
		}

		return json;
	},

	get(path, options) {
		return this.request("GET", path, undefined, options);
	},

	post(path, body, options) {
		return this.request("POST", path, body, options);
	},

	put(path, body, options) {
		return this.request("PUT", path, body, options);
	},

	delete(path, options) {
		return this.request("DELETE", path, undefined, options);
	},

	upload(path, formData, method = "POST") {
		return this.request(method, path, formData, { isFormData: true });
	},
};
