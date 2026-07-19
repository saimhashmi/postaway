// user.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
	getUsers,
	findUserByEmail,
	signup,
	updateUser,
	updateVerifiedStatus,
} from "./user.repository.js";
import {
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../../utils/errors.js";
import { verificationEmail, welcomeEmail } from "../../utils/emailTemplates.js";
import sendEmail from "../../service/email.service.js";
import {
	createLoginToken,
	deleteAllLoginTokens,
	deleteLoginToken,
} from "./loginToken.repository.js";
import { verifyJWT } from "../../middlewares/jwtAuth.middleware.js";

const sendVerificationToken = async (newUser) => {
	// Generate Verification JWT (Expires in 5 minutes)
	const verificationToken = jwt.sign(
		{ userId: newUser._id, email: newUser.email },
		process.env.JWT_SECRET,
		{ expiresIn: "5m" },
	);
	const verificationUrl = `http://localhost:3000/api/users/verify-email?token=${verificationToken}`;
	const sentMail = await sendEmail(
		newUser.email,
		verificationEmail(newUser.name, verificationUrl),
	);

	return sentMail;
};

export const getUserDetails = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const loggedInUser = await getUsers(req.userId);
		const user = await getUsers(userId);
		console.log(loggedInUser, user);

		if (!user) {
			throw new NotFoundError("User not found");
		}
		// if (!loggedInUser.isAdmin && userId !== req.userId) {
		// 	throw new UnauthorizedError();
		// }

		return res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(error);
	}
};
export const getAllUserDetails = async (req, res, next) => {
	try {
		const loggedInUser = await getUsers(req.userId);
		const users = await getUsers();

		// if (!loggedInUser.isAdmin) {
		// 	throw new UnauthorizedError();
		// }

		return res.status(200).json({
			success: true,
			data: users,
		});
	} catch (error) {
		next(error);
	}
};

export const userSignup = async (req, res, next) => {
	try {
		const { name, email, password, gender } = req.body;

		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			throw new ValidationError(
				"An account with this email already exists!",
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await signup({
			name,
			email,
			password: hashedPassword,
			gender,
		});

		// Send verification email
		const sentMail = sendVerificationToken(newUser);

		return res.status(201).json({
			success: true,
			message:
				"Registration successful, verification mail sent, Welcome to Postaway",
			data: newUser,
		});
	} catch (error) {
		next(error);
	}
};

export const verifyEmail = async (req, res, next) => {
	try {
		const token = req.query.token;
		if (!token) {
			throw new ValidationError("Verification token is missing");
		}
		const payload = verifyJWT(token);
		const user = await updateVerifiedStatus(payload.userId);
		const sentMail = await sendEmail(user.email, welcomeEmail(user.name));

		return res.status(200).json({
			success: true,
			msg: "Email verification successful",
		});
	} catch (error) {
		next(error);
	}
};

export const userSignin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedError("Invalid email or password");
		}

		if (!user.isVerified) {
			// Send verification email
			sendVerificationToken(user);

			throw new ValidationError(
				"Please verify your registered email first, Verification mail sent to registered email.",
			);
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const secretKey = process.env.JWT_SECRET;
		const payload = {
			userId: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
		const validity = { expiresIn: "1h" };
		const token = jwt.sign(payload, secretKey, validity);

		res.cookie("jwtToken", token, { httpOnly: true });
		await createLoginToken(user._id, token);

		return res.status(200).json({
			success: true,
			data: { user: user.email, JWT: token },
		});
	} catch (error) {
		next(error);
	}
};

export const userLogout = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];
		const bearerToken = authHeader?.startsWith("Bearer ")
			? authHeader.slice(7)
			: authHeader;
		const token = req.cookies?.jwtToken || bearerToken;

		await deleteLoginToken(req.userId, token);

		return res.clearCookie("jwtToken").json({
			success: true,
			msg: "logout successful",
		});
	} catch (error) {
		next(error);
	}
};

export const userLogoutAllDevices = async (req, res, next) => {
	try {
		await deleteAllLoginTokens(req.userId);

		return res.clearCookie("jwtToken").json({
			success: true,
			msg: "logout from all devices successful",
		});
	} catch (error) {
		next(error);
	}
};

export const updateUserDetails = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		if (userId !== req.userId) {
			throw new UnauthorizedError();
		}
		const { avatar, name, gender } = req.body;

		const updatedUser = await updateUser(userId, avatar, name, gender);

		return res.status(200).json({
			success: true,
			message: "User data updated!",
			data: updatedUser,
		});
	} catch (error) {
		next(error);
	}
};
