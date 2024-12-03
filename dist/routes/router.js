"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controller/UserController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
/**
 * Router configuration for the Garage System API
 * Organizes routes by authentication requirement and resource type
 */
const router = (0, express_1.Router)();
// Public routes
const publicRoutes = (0, express_1.Router)();
/**
 * Authentication routes
 * @public
 */
publicRoutes.post("/auth/login", UserController_1.default.LoginUser);
publicRoutes.post("/auth/verify-token", UserController_1.default.verifyToken);
/**
 * Public user routes
 * @public
 */
publicRoutes.post("/users", UserController_1.default.addUser); // signup
// Protected routes
const protectedRoutes = (0, express_1.Router)();
protectedRoutes.use(authMiddleware_1.default);
/**
 * Protected user routes
 * @protected
 */
protectedRoutes.get("/users", UserController_1.default.GetUsers);
protectedRoutes.get("/users/:id", UserController_1.default.GetUserById);
protectedRoutes.delete("/users/:id", UserController_1.default.deleteUser);
protectedRoutes.post("/users/:id/change-password", UserController_1.default.ChangePassword);
protectedRoutes.put("/users/:id/profile-picture", UserController_1.default.updateProfilePic);
// Apply routes to main router
router.use(publicRoutes);
router.use(protectedRoutes);
exports.default = router; // In a separate error-handler.ts file
