// loginToken.repository.js
import crypto from "crypto";
import LoginToken from "./loginToken.schema.js";
import { ServerError } from "../../utils/errors.js";

const hashToken = (jwtToken) => {
	return crypto.createHash("sha256").update(jwtToken).digest("hex");
};

export const isTokenValid = async (userId, jwtToken) => {
	try {
		const hashedToken = hashToken(jwtToken);
		const found = await LoginToken.exists({ userId, token: hashedToken });
		return Boolean(found);
	} catch (error) {
		throw new ServerError({ error: error });
	}
};

export const createLoginToken = async (userId, jwtToken) => {
	try {
		const hashedToken = hashToken(jwtToken);
		return LoginToken.create({ userId, token: hashedToken });
	} catch (error) {
		throw new ServerError({ error: error });
	}
};

export const deleteLoginToken = async (userId, jwtToken) => {
	try {
		const hashedToken = hashToken(jwtToken);
		return LoginToken.deleteOne({ userId, token: hashedToken });
	} catch (error) {
		throw new ServerError({ error: error });
	}
};

export const deleteAllLoginTokens = async (userId) => {
	try {
		return await LoginToken.deleteMany({ userId });
	} catch (error) {
		throw new ServerError({ error: error });
	}
};
