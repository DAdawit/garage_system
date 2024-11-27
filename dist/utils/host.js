"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getBaseUrl() {
    const host = process.env.HOST;
    return host !== null && host !== void 0 ? host : "http://localhost:4000/";
}
exports.getBaseUrl = getBaseUrl;
