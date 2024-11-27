import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { DataStoredInToken } from "../Types/dataStoredInToken";
import { Request, Response, NextFunction } from "express";

async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const token = request.headers.authorization?.split(" ")[1];

  const secrete = process.env.SECRETE;
  if (!secrete) {
    throw new Error("secrete environment variable is not set");
  }

  if (token) {
    try {
      const verificationResponse = jwt.verify(
        token,
        secrete
      ) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        next();
      } else {
        next(response.status(401).send({ detail: "invalid token" }));
      }
    } catch (error) {
      next(response.status(401).send({ detail: "invalid token" }));
    }
  } else {
    next(response.status(404).send({ detail: "Unauthorized" }));
  }
}

export default authMiddleware;
