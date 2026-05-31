import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = process.env.VERCEL
	? path.join("/tmp", "uploads")
	: path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Store uploaded files on disk under ./uploads
export const upload = multer({ dest: uploadDir });