// This MUST be the first import — creates logs/ and public/uploads/ before
// any other module (logger, multer) tries to write into them.
import "./src/utils/ensureDirectories.js";

// Import packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import middlwares
import logger from "./src/middlewares/logger.middleware.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

// Import routes
import userRouter from "./src/routes/user.routes.js";
import postRouter from "./src/routes/post.routes.js";
import commentRouter from "./src/routes/comment.routes.js";
import likeRouter from "./src/routes/like.routes.js";
import { PATHS } from "./src/utils/paths.js";

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
server.use("/uploads", express.static(PATHS.uploadsDir));

// logger must be BEFORE routes, so it wraps every request
server.use(logger);

// API routes
server.use("/api", userRouter);
server.use("/api/posts", jwtAuth, postRouter);
server.use("/api/comments", jwtAuth, commentRouter);
server.use("/api/likes", jwtAuth, likeRouter);

// --- Error middleware MUST be registered last, after all routes ---
server.use(errorHandler);

server.listen(port, () => {
	console.log(`server is line at http://localhost:${port}/`);
});
