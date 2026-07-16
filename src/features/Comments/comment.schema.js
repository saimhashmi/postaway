import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
		index: true,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Post",
		index: true,
	},
	content: {
		type: String,
		required: true,
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Like",
			index: true,
		},
	],
	timeStamp: {
		type: Date,
		default: Date.now,
	},
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
