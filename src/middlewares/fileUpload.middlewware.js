// Import modules
import multer from "multer";
import { PATHS } from "../utils/paths.js";

// Configure storqage with filename and location
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, PATHS.uploadsDir);
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + "_" + file.originalname);
	},
});

export const upload = multer({ storage: storage });
