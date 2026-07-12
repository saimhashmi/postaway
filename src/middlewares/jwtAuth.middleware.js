import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UnauthorizedError } from "../utils/errors.js";
import { isTokenValid } from "../features/Users/loginToken.repository.js";

dotenv.config();

const jwtAuth = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const bearerToken = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7)
		: authHeader;
	const token = req.cookies?.jwtToken || bearerToken;

	if (!token) {
		throw new UnauthorizedError("Unauthorized, no token provided");
	}

	const secretKey = process.env.JWT_SECRET;

	try {
		const payload = jwt.verify(token, secretKey);
		const valid = await isTokenValid(payload.userId, token);

		if (!valid) {
			throw new UnauthorizedError(
				"Unauthorized: session has been logged out",
			);
		}

		req.userId = payload.userId;
	} catch (error) {
		const authError = new UnauthorizedError(
			"Unauthorized: invalid or expired token",
		);
		authError.originalError = error.message;
		throw authError;
	}

	next();
};

export default jwtAuth;
