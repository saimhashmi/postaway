import path from "path";
import { fileURLToPath } from "url";

// ESM doesn't have __dirname — reconstruct it, then anchor everything to the
// actual project root instead of process.cwd(), which changes depending on
// where `node` is launched from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file lives at src/utils/paths.js — project root is two levels up.
export const ROOT_DIR = path.join(__dirname, "..", "..");

export const PATHS = {
	logsDir: path.join(ROOT_DIR, "logs"),
	errorLog: path.join(ROOT_DIR, "logs", "error.log"),
	serverLog: path.join(ROOT_DIR, "logs", "server.log"),
	uploadsDir: path.join(ROOT_DIR, "src", "public", "uploads"),
};
