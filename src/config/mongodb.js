import { MongoClient, ServerApiVersion } from "mongodb";
import { customError } from "../middlewares/errorHandler.middleware.js";
import dotenv from "dotenv";
dotenv.config();

const connectionURL = process.env.MONGODB || process.env.MongoDB_Connection_URL;

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

//  let client;
const client = new MongoClient(connectionURL, options);

export const connectToMongoDB = async () => {
	try {
		// client = await MongoClient.connect(connectionURL, options);
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// console.log("Connected to database:", client.s.url);
		// Send a ping to confirm a successful connection
		const response = await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!",
			response,
		);
		createCounter(client.db());
		createIndexes(client.db());
	} catch (error) {
		console.log("Error Connecting to DB", error);
		throw new customError("Error connecting to DB", 500);
	}
};

export const getDB = () => {
	return client.db();
};

export const getClient = () => {
	return client;
};

const createCounter = async (db) => {
	try {
		const existingCounter = await db
			.collection("Counters")
			.findOne({ _id: "cartItemId" });

		if (!existingCounter) {
			await db
				.collection("Counters")
				.insertOne({ _id: "cartItemId", value: 0 });
		}
	} catch (error) {
		console.log(error);
		throw new customError("Error connecting to DB", 500);
	}
};

const createIndexes = async (db) => {
	try {
		// Single field index
		// creating indexes on price in ascending order
		await db.collection("Products").createIndex({ price: 1 });
		// Compound Index
		await db.collection("Products").createIndex({ name: 1, category: -1 });
		// Text based Index
		await db.collection("Products").createIndex({ desc: "text" });
		console.log("Indexes created in products collection");
	} catch (error) {
		console.log(error);
		throw new customError("Error connecting to DB", 500);
	}
};

export const closeMongoDBConnection = async () => {
	try {
		if (client) {
			await client.close();
			console.log("MongoDB connection closed");
		} else {
			console.warn("MongoDB client not available for closing");
		}
	} catch (err) {
		console.error("Error closing MongoDB connection:", err);
		throw new customError("Error connecting to DB", 500);
	}
};
