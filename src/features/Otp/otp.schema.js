import mongoose, { Types } from "mongoose";

const OtpSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 600,
	},
});

const Otp = mongoose.model("OTP", OtpSchema);

export default Otp;
