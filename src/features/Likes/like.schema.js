import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true,
	},
	likedItem: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "type", // Adding multiple references
	},
	type: {
		type: String,
		enum: ["Post", "Comment"],
	},
});

const Like = mongoose.model("Like", LikeSchema);

export default Like;
