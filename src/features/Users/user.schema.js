import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	avatar: {
		type: String,
		trim: true,
		validate: {
			validator: function (value) {
				const urlOrRelativePathRegex = /^(https?:\/\/|\/)[^\s]+$/;
				return urlOrRelativePathRegex.test(value);
			},
			message: (props) =>
				`${props.value} is not a valid avatar destination! Must be a full URL or a relative path starting with '/'.`,
		},
		default: "/uploads/avatars/default.png",
	},
	name: {
		type: String,
		trim: true,
		required: [true, "name is required"],
		minLength: [3, "The name should be at least 3 characters long"],
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: [true, "email is required"],
		match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
	},
	password: {
		type: String,
		required: [true, "password is required"],
		select: false,
		minLength: [8, "The password must be at least 8 characters long"],
	},
	gender: {
		type: String,
		required: [true, "Gender is required"],
		enum: ["Male", "Female", "Others"],
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Like",
			index: true,
		},
	],
});

const User = mongoose.model("User", userSchema);

export default User;
