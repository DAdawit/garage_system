import { Router } from "express";
import UserController from "../controller/UserController";
import authMiddleware from "../middleware/authMiddleware";

/**
 * Router configuration for the Garage System API
 * Organizes routes by authentication requirement and resource type
 */
const router = Router();


// Public routes
const publicRoutes = Router();

/**
 * Authentication routes
 * @public
 */
publicRoutes.post("/auth/login", UserController.LoginUser);
publicRoutes.post("/auth/verify-token", UserController.verifyToken);

/**
 * Public user routes
 * @public
 */
publicRoutes.post("/users", UserController.addUser); // signup

// Protected routes
const protectedRoutes = Router();
protectedRoutes.use(authMiddleware);

/**
 * Protected user routes
 * @protected
 */
protectedRoutes.get("/users", UserController.GetUsers);
protectedRoutes.get("/users/:id", UserController.GetUserById);
protectedRoutes.delete("/users/:id", UserController.deleteUser);
protectedRoutes.post("/users/:id/change-password", UserController.ChangePassword);
protectedRoutes.put("/users/:id/profile-picture", UserController.updateProfilePic);

// Apply routes to main router
router.use(publicRoutes);
router.use(protectedRoutes);

export default router;// In a separate error-handler.ts file

