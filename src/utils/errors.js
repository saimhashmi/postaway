// errors.js
// Base class for all "expected" errors we throw on purpose (bad input, not found, etc.)
// These are "operational" errors — safe to show a clean message to the API consumer.
export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true; // flags this as an error we anticipated

		// keeps the stack trace clean, excluding the constructor call itself
		Error.captureStackTrace(this, this.constructor);
	}
}

// Specific, named errors — makes route code read like plain English
// and lets you `if (err instanceof NotFoundError)` if you ever need to.
export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Invalid input", errors = null) {
		super(message, 400);
		this.errors = errors;
	}
}

export class ClientError extends AppError {
	constructor(message = "Invalid user input", error = null) {
		super(message, 400);
		this.error = error;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Not authorized") {
		super(message, 401);
	}
}

export class ServerError extends AppError {
	constructor({
		message = "Something went wrong, please try again later!",
		error = null,
	}) {
		super(message, 500);
		this.error = error;
	}
}

export class EmailDeliveryError extends AppError {
	constructor({
		message = "Failed to send transactional alert",
		recipient = null,
		error = null,
	}) {
		// 502 Bad Gateway represents a failure in an upstream provider (Gmail, Resend, etc.)
		super(message, 502);

		this.recipient = recipient; // Email tracking context
		this.error = error; // Original error payload from Nodemailer / Vendor API
	}
}
