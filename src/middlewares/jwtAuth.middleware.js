import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UnauthorizedError } from "../utils/errors.js";

dotenv.config();

const jwtAuth = (req, res, next) => {
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
