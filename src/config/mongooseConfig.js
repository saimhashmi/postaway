import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import { DatabaseError } from "../utils/errors.js";
dotenv.config();

const url = process.env.MONGODB || "mongodb://0.0.0.0:27017/Postaway";

const options = {
	serverSelectionTimeoutMS: 20000, // Timeout after 20 seconds
	// New code to connect to mongodb atlas server
	serverApi: {
		version: ServerApiVersion.v1,
		// strict: true,
		deprecationErrors: true,
	},
	maxPoolSize: 10,
};

export const connectUsingMongoose = async () => {
	try {
		await mongoose.connect(url, options);
		console.log("Connection established to MongoDB");
	} catch (error) {
		const dbError = new DatabaseError("Error connecting to MongoDB", 500);
		dbError.originalError = error.message;
		throw dbError;
	}
};

export const closeMongoDBConnection = async () => {
	try {
		if (mongoose.connection.readyState !== 0) {
			await mongoose.connection.close();
			console.log("MongoDB connection closed");
		} else {
			console.warn(
				"Mongoose connection already closed or not established",
			);
		}
	} catch (error) {
		const dbError = new DatabaseError(
			"Error closing MongoDB connection",
			500,
		);
		dbError.originalError = error.message;
		throw dbError;
	}
};
