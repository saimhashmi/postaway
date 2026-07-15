import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
		index: true,
	},
	caption: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
