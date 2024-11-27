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
  private static readonly createToken = (id: number) => {
    const secrete = process.env.SECRETE;
    if (!secrete) {
      throw new Error("secrete environment variable is not set");
    }
    const token = jwt.sign({ id: id }, secrete, { expiresIn: "10d" });

    return token;
  };

  public static readonly GetUsers = (req: Request, res: Response) => {
    service
      .getUsers(req)
      .then((users) => {
        return res.send(users);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static readonly GetUserById = (req: Request, res: Response) => {
    service
      .getUserById(req.params.id)
      .then((users) => {
        return res.send(users);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static readonly addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const Newuser = plainToInstance(User, req.body);

    const errors = await validate(Newuser);
    const err = validationErrorFormater(errors);
    const user = await User.findOne({ where: { email: Newuser.email } });

    if (user) {
      return res.status(400).json({ detail: "email already exists !" });
    }

    if (errors.length > 0) {
      res.status(400).send(err);
    } else {
      service
        .addUser(Newuser)
        .then((user) => {
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
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    }
  };

  public static readonly deleteUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    service
      .remove(req.params.id)
      .then(() => {
        return res.send({ message: "user deleted successfully" });
      })
      .catch((error) => {
        return res.send(error);
      });
  };

  public static readonly LoginUser = async (req: Request, res: Response) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({ detail: "Incorrect email or password." });
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = this.createToken(user.id);
      const data = {
        user: user,
        token: token,
      };
      return res.status(200).send(data);
    } else {
      return res.status(401).json({ detail: "Incorrect email or password." });
    }
  };

  public static readonly verifyToken = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return res.status(200).send(userWithoutPassword);
    }
  };

  public static readonly updateProfilePic = (req: Request, res: Response) => {
    service
      .UpdateProfilePic(req.params.id, req)
      .then((user) => {
        return res.send(user);
      })
      .catch((err) => {
        return res.send(err);
      });
  };

  public static readonly ChangePassword = async (
    req: Request,
    res: Response
  ) => {
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
  };
}

export default UserController;
