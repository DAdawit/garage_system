import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { DataStoredInToken } from "../Types/dataStoredInToken";
import { Request, Response, NextFunction } from "express";

/**
 * Type declaration to extend Express Request interface
 * Adds optional user property to store authenticated user information
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

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
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const decoded = jwt.verify(token, secret) as DataStoredInToken;
    const user = await User.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ detail: "Invalid token" });
    }

    // Attach user to request object for use in subsequent middleware/routes
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ detail: "Invalid token" });
    }
    return res.status(500).json({ detail: "Internal server error" });
  }
}

export default authMiddleware;
