import { NextFunction, Request, Response } from "express";
import { PlainObjectToNewEntityTransformer } from "typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer";
import { UserService } from "../services/userService";
import { User } from "../entities/User";
import { Validate, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { validationErrorFormater } from "../utils/validationErrorConverter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserId } from "../utils/getUserid";
dotenv.config();
const service = new UserService();

class UserController {
  private static readonly createToken = (id: number): string => {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("SECRET environment variable is not set");
    }
    return jwt.sign({ id }, secret, { expiresIn: "10d" });
  };

  public static readonly GetUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await service.getUsers(req);
      return res.status(200).json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ detail: "Failed to fetch users" });
    }
  };

  public static readonly GetUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await service.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ detail: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ detail: "Failed to fetch user" });
    }
  };

  public static readonly addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const Newuser = plainToInstance(User, req.body);

    const errors = await validate(Newuser);
    const err = validationErrorFormater(errors);
    const user = await User.findOne({ where: { email: Newuser.email } });

    if (user) {
      return res.status(400).json({ detail: "email already exists !" });
    }

    if (errors.length > 0) {
      return res.status(400).send(err);
    } else {
      try {
        const user = await service.addUser(Newuser);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          const token = this.createToken(user.id);
          const data = {
            user: userWithoutPassword,
            token: token,
          };
          return res.status(200).send(data);
        }
        return res.status(400).send({ detail: "User creation failed" });
      } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ detail: "Failed to create user" });
      }
    }
  };

  public static readonly deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      await service.remove(req.params.id);
      return res.send({ message: "user deleted successfully" });
    } catch (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ detail: "Failed to delete user" });
    }
  };

  public static readonly LoginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ detail: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ detail: "Incorrect email or password" });
      }

      const token = this.createToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ detail: "Authentication failed" });
    }
  };

  public static readonly verifyToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = getUserId(req);
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.status(200).send(userWithoutPassword);
      } else {
        return res.status(404).json({ detail: "User not found" });
      }
    } catch (err) {
      console.error('Error verifying token:', err);
      return res.status(500).json({ detail: "Failed to verify token" });
    }
  };

  public static readonly updateProfilePic = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await service.UpdateProfilePic(req.params.id, req);
      return res.send(user);
    } catch (err) {
      console.error('Error updating profile picture:', err);
      return res.status(500).json({ detail: "Failed to update profile picture" });
    }
  };

  public static readonly ChangePassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = getUserId(req);
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ detail: "User not found" });
      }

      const { old_password, new_password } = req.body;
      if (!old_password || !new_password) {
        return res
          .status(400)
          .json({ detail: "old and new passwords are required" });
      }

      const isPasswordCorrect = bcrypt.compareSync(old_password, user.password);
      if (isPasswordCorrect) {
        user.password = bcrypt.hashSync(new_password, 8);
        await user.save();
        return res.status(200).send({ message: "Password changed successfully" });
      } else {
        return res.status(401).json({ detail: "old password is incorrect!" });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      return res.status(500).json({ detail: "Failed to change password" });
    }
  };
}

export default UserController;
