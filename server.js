// This MUST be the first import — creates logs/ and public/uploads/ before
// any other module (logger, multer) tries to write into them.
import "./src/utils/ensureDirectories.js";

// Import packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

// Import middlwares
import logger from "./src/middlewares/logger.middleware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import invalidRoutesHandler from "./src/middlewares/invalidRoutesHandler.middleware.js";

// Import neccessary modules
import { PATHS } from "./src/utils/paths.js";
import {
	closeMongoDBConnection,
	connectUsingMongoose,
} from "./src/config/mongooseConfig.js";

// Import routes
import userRouter from "./src/features/Users/user.routes.js";
import postRouter from "./src/features/Posts/post.routes.js";
import commentRouter from "./src/features/Comments/comment.routes.js";
import likeRouter from "./src/features/Likes/like.routes.js";
import friendRouter from "./src/features/Friends/friend.routes.js";
import otpRouter from "./src/features/Otp/otp.routes.js";
import { swaggerSpec } from "./src/config/swaggerConfig.js";

const server = express();
const port = 3000;

// CORS policy configuration
const corsOptions = {
	origin: "*", // By default it will allow all origins
	allowedHeaders: ["Content-Type", "authorization"],
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
server.use(express.static(PATHS.publicDir));

// logger must be BEFORE routes, so it wraps every request
server.use(logger);

// API routes
server.use("/api/users", userRouter);
server.use("/api/posts", jwtAuth, postRouter);
server.use("/api/comments", jwtAuth, commentRouter);
server.use("/api/likes", jwtAuth, likeRouter);
server.use("/api/friends", jwtAuth, friendRouter);
server.use("/api/otp", otpRouter);
server.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		explorer: true,
		customSiteTitle: "Postaway API Docs",
	}),
);

// Middlware to handle 404 requests
// Needs to be put in the end or other handler(s) will not work
server.use(invalidRoutesHandler);

// --- Error middleware MUST be registered last, after all routes ---
server.use(errorHandler);

server.listen(port, async () => {
	console.log(`server is line at http://localhost:${port}/`);
	await connectUsingMongoose();
});

// Graceful shutdown: close Mongo connection on Ctrl+C
process.on("SIGINT", async () => {
	await closeMongoDBConnection();
	process.exit(0);
});
