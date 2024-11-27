"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRequestValidator = void 0;
const express_validator_1 = require("express-validator");
const bookRequestValidator = () => {
    return [
        (0, express_validator_1.body)("title").isLength({ min: 1 }).withMessage("title is required"),
        (0, express_validator_1.body)("writer").isLength({ min: 1 }).withMessage("writer is required"),
        (0, express_validator_1.body)("points").isNumeric(),
        (0, express_validator_1.body)("quantity").isNumeric(),
    ];
};
exports.bookRequestValidator = bookRequestValidator;
