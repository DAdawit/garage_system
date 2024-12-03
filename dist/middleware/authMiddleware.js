"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
/**
 * Authentication middleware for protecting routes
 *
 * This middleware validates JWT tokens from the Authorization header and ensures
 * that requests are authenticated before proceeding to protected routes.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @throws {Error} If SECRET environment variable is not set
 *
 * @returns {Promise<void>}
 *
 * Response Status Codes:
 * - 401 Unauthorized: No token provided or missing authorization header
 * - 403 Forbidden: Invalid or expired token
 * - 500 Internal Server Error: Unexpected server error
 *
 * Usage:
 * ```typescript
 * app.use('/protected-route', authMiddleware, protectedRouteHandler);
 * ```
 */
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ detail: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ detail: "Token missing" });
        }
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error("SECRET environment variable is not set");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = yield User_1.User.findOne({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(403).json({ detail: "Invalid token" });
        }
        // Attach user to request object for use in subsequent middleware/routes
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(403).json({ detail: "Invalid token" });
        }
        return res.status(500).json({ detail: "Internal server error" });
    }
});
exports.default = authMiddleware;
