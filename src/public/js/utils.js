function parseJwt(token) {
	try {
		const payload = token.split(".")[1];
		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		return JSON.parse(atob(base64));
	} catch {
		return null;
	}
}

function getQueryParam(name) {
	return new URLSearchParams(window.location.search).get(name);
}

function normalizeImageUrl(url) {
	if (!url) return "/uploads/avatars/default.png";
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("./")) return url.slice(1);
	if (url.startsWith("/")) return url;
	return `/${url}`;
}

function formatRelativeTime(dateString) {
	const date = new Date(dateString);
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
	return date.toLocaleDateString();
}

function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text ?? "";
	return div.innerHTML;
}

function getUserId(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	return value._id || value.toString();
}
