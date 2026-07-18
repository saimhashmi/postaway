import Otp from "./otp.schema.js";
import { ServerError } from "../../utils/errors.js";
import User from "../Users/user.schema.js";

const generateOtp = (otp = "") => {
	if (otp.length === 6) {
		return otp;
	}

	const randomDigit = Math.floor(Math.random() * 10);

	return generateOtp(otp + randomDigit);
};

export const sendOtp = async (userId, email) => {
	try {
		const otp = generateOtp();
		const newOtp = new Otp({ userId, email, otp });
		await Otp.deleteMany({ userId: userId }); // Deleting the old ones before commit new OTP's

		return await newOtp.save();
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const verifyOtp = async (userId, OTP) => {
	try {
		// Find the OTP record in the database
		const otpRecord = await Otp.findOne({ userId: userId, otp: OTP });

		// Burn-after-reading: Delete the OTP so it cannot be used again
		if (otpRecord) {
			await otpRecord.deleteOne();
		}

		return otpRecord;
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const resetPassword = async (userId, newPassword) => {
	try {
		console.log(userId);
		return await User.findByIdAndUpdate(
			userId,
			{
				$set: { password: newPassword },
			},
			{ returnDocument: "after" },
		);
	} catch (error) {
		throw new ServerError({ error });
	}
};
