import mongoose from "mongoose";
import User from "./user.schema.js";
import { DatabaseError } from "../../utils/errors.js";

export const getUsers = async (userId = null) => {
	try {
		if (userId) {
			return await User.findById(userId);
		}

		return await User.find();
	} catch (error) {
		throw new DatabaseError(error.message);
	}
};

export const findUserByEmail = async (email) => {
	try {
		return await User.findOne({ email: email }).select("+password");
	} catch (error) {
		throw new DatabaseError(error.message);
	}
};

export const signup = async (user) => {
	try {
		const newUser = new User(user);
		await newUser.save();

		return await User.findById(newUser._id);
	} catch (error) {
		throw new DatabaseError(error.message);
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
		throw new DatabaseError(error.message);
	}
};

export const resetPassword = async (userID, newPassword) => {
	try {
		let user = await UserModel.findById(userID);

		if (user) {
			user.password = newPassword;
			await user.save();

			return user;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		throw new customError("Something went wrong", 500);
	}
};
