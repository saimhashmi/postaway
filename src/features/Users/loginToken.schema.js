import mongoose from "mongoose";

const loginTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// TTL index: MongoDB's background task deletes the doc
// once `createdAt` is older than 3600s (1hr) — matches your JWT expiry
loginTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const LoginToken = mongoose.model("LoginToken", loginTokenSchema);

export default LoginToken;
