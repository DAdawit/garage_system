import { body } from "express-validator";

export const bookRequestValidator = () => {
  return [
    body("title").isLength({ min: 1 }).withMessage("title is required"),
    body("writer").isLength({ min: 1 }).withMessage("writer is required"),
    body("points").isNumeric(),
    body("quantity").isNumeric(),
  ];
};
