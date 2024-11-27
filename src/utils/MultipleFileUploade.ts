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

  // Change here: Use .array() for multiple files under the same field name
  return Multer({ storage: storage }).array("images");
};

// Adjusted function to handle multiple file uploads
export const MultipleFileUploade = (
  req: Request,
  destination: string
): Promise<string[]> => {
  const upload = configureMulter(destination);

  return new Promise((resolve, reject) => {
    upload(req, {} as any, (err) => {
      if (err) {
        reject(new Error("Error uploading files."));
      } else {
        // Adjusted to handle multiple files
        if (req.files && Array.isArray(req.files)) {
          const normalizedPaths = req.files.map((file) =>
            file.path.replace(/\\/g, "/").replace(/^public\//, "")
          );

          resolve(normalizedPaths);
        } else {
          reject(new Error("Files upload unsuccessful."));
        }
      }
    });
  });
};
