import Multer from "multer";
import { Request } from "express";

// Function to configure and return a Multer instance based on the destination
const configureMulter = (destination: string) => {
  const storage = Multer.diskStorage({
    destination: `public/${destination}`,
    filename: (req, file, cb) => {
      const imageUrl = Date.now() + "-" + file.originalname;
      cb(null, imageUrl);
    },
  });

  return Multer({ storage: storage }).single("image");
};

// Function to handle file upload, now accepts a destination parameter
export const uploadFile = (
  req: Request,
  destination: string
): Promise<string> => {
  const upload = configureMulter(destination);

  return new Promise((resolve, reject) => {
    upload(req, {} as any, (err) => {
      if (err) {
        reject(new Error("Error uploading file."));
      } else {
        // Assuming the file is uploaded and its filename is stored in req.file
        if (req.file && req.file.path) {
          const normalizedPath = req.file.path
            .replace(/\\/g, "/")
            .replace(/^public\//, "");

          resolve(normalizedPath);
        } else {
          reject(new Error("File upload unsuccessful."));
        }
      }
    });
  });
};
