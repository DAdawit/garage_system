"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorFormater = void 0;
const validationErrorFormater = (errors) => {
    return errors.map((error) => ({
        property: error.property,
        // constraints: error.constraints,
        errors: error.constraints
            ? Object.keys(error.constraints).map((key) => error.constraints && (error === null || error === void 0 ? void 0 : error.constraints[key]))
            : [],
    }));
};
exports.validationErrorFormater = validationErrorFormater;
