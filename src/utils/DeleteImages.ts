import * as fs from "fs/promises"; // Import the promises API from the 'fs' module

export const DeleteImage = async (imagePath: string) => {
  await fs
    .unlink(imagePath)
    .catch((err) => console.error("Failed to delete image:", err));
};
