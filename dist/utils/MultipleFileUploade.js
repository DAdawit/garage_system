"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleFileUploade = void 0;
const multer_1 = __importDefault(require("multer"));
// Function to configure and return a Multer instance based on the destination
const configureMulter = (destination) => {
    const storage = multer_1.default.diskStorage({
        destination: `public/${destination}`,
        filename: (req, file, cb) => {
            const imageUrl = Date.now() + "-" + file.originalname;
            cb(null, imageUrl);
        },
    });
    // Change here: Use .array() for multiple files under the same field name
    return (0, multer_1.default)({ storage: storage }).array("images");
};
// Adjusted function to handle multiple file uploads
const MultipleFileUploade = (req, destination) => {
    const upload = configureMulter(destination);
    return new Promise((resolve, reject) => {
        upload(req, {}, (err) => {
            if (err) {
                reject(new Error("Error uploading files."));
            }
            else {
                // Adjusted to handle multiple files
                if (req.files && Array.isArray(req.files)) {
                    const normalizedPaths = req.files.map((file) => file.path.replace(/\\/g, "/").replace(/^public\//, ""));
                    resolve(normalizedPaths);
                }
                else {
                    reject(new Error("Files upload unsuccessful."));
                }
            }
        });
    });
};
exports.MultipleFileUploade = MultipleFileUploade;
