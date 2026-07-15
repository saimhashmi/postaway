// errorHandler.middleware.js
import { errorLogger } from "./logger.middleware.js";

export const errorHandler = (err, req, res, next) => {
	// Default to 500 if the error didn't come from our AppError hierarchy
	// (e.g. a raw bug like `undefined.someMethod()`)
	const statusCode = err.statusCode || 500;
	const isOperational = err.isOperational || false;

	const body = { ...req.body };
	if (body.password) delete body.password;
	// Always log full detail internally — stack trace, request context, everything.
	// errorLogger.error({
	// 	message: err.message,
	// 	...(err.originalError && { originalError: err.originalError }), // e.g. "jwt expired", "invalid signature"
	// 	...(err.errors && { errors: err.errors }), // e.g. validation field errors
	// 	...(err.error && { error: err.error }), // e.g. error stack
	// 	...(err.recipient && { recipient: err.recipient }), // e.g. Email tracking context
	// 	stack: err.stack,
	// 	statusCode,
	// 	isOperational,
	// 	url: req.originalUrl,
	// 	method: req.method,
	// 	body: body,
	// });
	const originalError = err.error || err.originalError;

	errorLogger.error({
		message: originalError?.message || err.message,
		stack: originalError?.stack || err.stack,
		statusCode,
		isOperational,
		method: req.method,
		url: req.originalUrl,
		body,
		...(err.errors && { errors: err.errors }),
		...(err.recipient && { recipient: err.recipient }),
	});

	// What we send back to the API consumer differs based on error type:
	if (isOperational) {
		// Errors we threw on purpose (NotFoundError, ValidationError, etc.)
		// — safe to show the real message.
		return res.status(statusCode).json({
			success: false,
			message: err.message,
			...(err.errors && { errors: err.errors }), // e.g. validation field errors
		});
	}

	// Unexpected/programming errors — never leak internals (stack trace, DB errors, etc.)
	// to the client. Log it above, but respond generically.
	return res.status(500).json({
		success: false,
		message: "Something went wrong. Please try again later.",
	});
};
