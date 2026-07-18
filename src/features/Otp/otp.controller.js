import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { resetPassword, sendOtp, verifyOtp } from "./otp.repository.js";
import { findUserByEmail } from "../Users/user.repository.js";
import sendEmail from "../../service/email.service.js";
import { otpEmail } from "../../utils/emailTemplates.js";
import {
	ClientError,
	ServerError,
	UnauthorizedError,
} from "../../utils/errors.js";
import { createLoginToken } from "../Users/loginToken.repository.js";

export const sendOtpToUser = async (req, res, next) => {
	try {
		const email = req.body.email;
		const user = await findUserByEmail(email);
		const Otp = await sendOtp(user._id, email);

		await sendEmail(email, otpEmail(user.name, Otp.otp));

		return res.status(200).json({
			success: true,
			msg: "OTP sent to email",
		});
	} catch (error) {
		next(error);
	}
};

export const verifyOtpFromUser = async (req, res, next) => {
	try {
		const { email, otp } = req.body;
		const user = await findUserByEmail(email);
		const result = await verifyOtp(user._id, otp);

		if (result) {
			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "5m" },
			);

			await createLoginToken(user._id, token);

			res.cookie("jwtToken", token, { httpOnly: true });

			return res.status(200).json({
				success: true,
				data: "Verification successful",
			});
		} else {
			throw new ClientError("Invalid OTP");
		}
	} catch (error) {
		next(error);
	}
};

export const resetPasswordforUser = async (req, res, next) => {
	try {
		const email = req.body.email;
		const user = await findUserByEmail(email);
		const newPassword = req.body.password;
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		if (req.email !== email && user._id !== req.userId) {
			throw new UnauthorizedError();
		}

		const updatedUser = await resetPassword(user._id, hashedPassword);

		if (updatedUser) {
			return res.status(200).json({
				success: true,
				data: "password reset successful",
			});
		} else {
			throw new ClientError();
		}
	} catch (error) {
		next(error);
	}
};
