"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
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
    return (0, multer_1.default)({ storage: storage }).single("image");
};
// Function to handle file upload, now accepts a destination parameter
const uploadFile = (req, destination) => {
    const upload = configureMulter(destination);
    return new Promise((resolve, reject) => {
        upload(req, {}, (err) => {
            if (err) {
                reject(new Error("Error uploading file."));
            }
            else {
                // Assuming the file is uploaded and its filename is stored in req.file
                if (req.file && req.file.path) {
                    const normalizedPath = req.file.path
                        .replace(/\\/g, "/")
                        .replace(/^public\//, "");
                    resolve(normalizedPath);
                }
                else {
                    reject(new Error("File upload unsuccessful."));
                }
            }
        });
    });
};
exports.uploadFile = uploadFile;
