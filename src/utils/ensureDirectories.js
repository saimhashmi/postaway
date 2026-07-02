import fs from "fs";
import { PATHS } from "./paths.js";

// Runs immediately when this module is imported — no function call needed.
// To ensure the folders exist before anything tries to write to them.
const REQUIRED_DIRS = [PATHS.logsDir, PATHS.uploadsDir];

for (const dir of REQUIRED_DIRS) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created missing directory: ${dir}`);
	}
}
