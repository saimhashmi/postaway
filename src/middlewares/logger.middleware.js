import winston from "winston";
import { PATHS } from "../utils/paths.js";

// Logger for errors only (level: "error" means ONLY error-level logs pass)
export const errorLogger = winston.createLogger({
	level: "error",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json(),
	),
	defaultMeta: { service: "user-service" },
	transports: [new winston.transports.File({ filename: PATHS.errorLog })],
});

// Logger for general request/server activity (level: "info" catches info + warn + error)
export const serverLogger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	defaultMeta: { service: "request-logging" },
	transports: [new winston.transports.File({ filename: PATHS.serverLog })],
});

const logger = (req, res, next) => {
	const startTime = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - startTime;
		const body = { ...req.body };
		if (body.password) delete body.password;

		const logPayload = {
			method: req.method,
			route: req.originalUrl,
			body,
			status: res.statusCode,
			durationMs: duration,
		};

		// Also print to console for local dev visibility
		console.log(
			`${new Date().toISOString()} | ${req.method} ${req.originalUrl} ${JSON.stringify(body)} | Status: ${res.statusCode} | ${duration}ms`,
		);

		serverLogger.info(logPayload);
	});

	next();
};

export default logger;
