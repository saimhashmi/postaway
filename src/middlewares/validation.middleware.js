import { body, query, validationResult } from "express-validator";
import { ValidationError } from "../utils/errors.js";

export const validateNewUser = async (req, res, next) => {
	const rules = [
		body("name").notEmpty().withMessage("Name is required"),
		body("email").isEmail().withMessage("Enter a valid Email Address"),
		body("password")
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters"),
	];

	await Promise.all(rules.map((rule) => rule.run(req)));

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// To prevent passwords from being printed in server logs
		const sanitizedErrors = errors.array().map(({ path, msg }) => ({
			field: path,
			message: msg,
		}));
		throw new ValidationError("Validation failed", sanitizedErrors);
	}

	next();
};

export const validateNewPost = async (req, res, next) => {
	const rules = [
		body("caption").notEmpty().withMessage("Caption cannot be empty"),
		body().custom((value, { req }) => {
			if (!req.file && !req.body.imageUrl) {
				throw new Error("Image file or Image URL must be provided");
			}
			return true;
		}),
	];

	await Promise.all(rules.map((rule) => rule.run(req)));

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const errorsArray = errors.array();
		throw new ValidationError("Validation failed", errorsArray);
	}

	next();
};

export const validateNewComment = async (req, res, next) => {
	const rules = [
		body("content").notEmpty().withMessage("Comment cannot be empty"),
	];

	await Promise.all(rules.map((rule) => rule.run(req)));

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const errorsArray = errors.array();
		throw new ValidationError("Validation failed", errorsArray);
	}

	next();
};
