import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
	getAllUsers,
	findUserByEmail,
	userRegister,
} from "../models/user.model.js";
import { UnauthorizedError, ValidationError } from "../../utils/errors.js";

export const userSignup = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = findUserByEmail(email);

		if (existingUser) {
			throw new ValidationError(
				"An account with this email already exists!",
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = userRegister({
			name,
			email,
			password: hashedPassword,
		});

		// Never send the password hash back, even to the user who just registered.
		const { password: _omit, ...safeUser } = newUser;

		return res.status(201).json({
			success: true,
			data: safeUser,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const userSignin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const secretKey = process.env.JWT_SECRET;
		const payload = { userId: user.id, email: user.email };
		const validity = { expiresIn: "1h" };
		const token = jwt.sign(payload, secretKey, validity);

		res.cookie("jwtToken", token, { httpOnly: true });

		return res.status(200).json({
			success: true,
			data: { user: user.email, JWT: token },
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export const getUsers = (req, res) => {
	// Strip password hashes before sending the list back.
	const safeUsers = getAllUsers().map(({ password, ...rest }) => rest);
	return res.status(200).json({
		success: true,
		data: safeUsers,
	});
};
