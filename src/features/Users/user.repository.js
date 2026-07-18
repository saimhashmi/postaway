// user.repository.js
import User from "./user.schema.js";
import { ServerError } from "../../utils/errors.js";

export const getUsers = async (userId = null) => {
	try {
		if (userId) {
			return await User.findById(userId)
				.populate("posts")
				.populate("comments");
		}

		return await User.find();
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const findUserByEmail = async (email) => {
	try {
		return await User.findOne({ email: email }).select("+password");
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const signup = async (user) => {
	try {
		const newUser = new User(user);
		await newUser.save();

		return await User.findById(newUser._id);
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const updateVerifiedStatus = async (userId) => {
	try {
		return await User.findByIdAndUpdate(
			userId,
			{
				$set: { isVerified: true },
			},
			{ returnDocument: "after" },
		);
	} catch (error) {
		throw new ServerError({ error });
	}
};

export const updateUser = async (userId, avatar, name, gender) => {
	try {
		const userData = {};
		if (avatar !== undefined) userData.avatar = avatar;
		if (name !== undefined) userData.name = name;
		if (gender !== undefined) userData.gender = gender;

		return await User.findByIdAndUpdate(
			userId,
			{ $set: userData },
			{ returnDocument: "after", runValidators: true },
		);
	} catch (error) {
		throw new ServerError({ error });
	}
};
