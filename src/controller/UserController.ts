import { error } from "console";
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
  private static createToken = (id: number) => {
    const secrete = process.env.SECRETE;
    if (!secrete) {
      throw new Error("secrete environment variable is not set");
    }
    const token = jwt.sign({ id: id }, secrete, { expiresIn: "10d" });

    return token;
  };

  public static getUsers = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    service
      .get()
      .then((users) => {
        res.json(users);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static addUser = async (
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
            res.status(200).send(data);
          }
          // res.send(user);
        })
        .catch((error) => {
          res.send(error);
        });
    }
  };

  public static deleteUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    service
      .remove(req.params.id)
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        res.send(error);
      });
  };
  public static LoginUser = async (req: Request, res: Response) => {
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

  public static verifyToken = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.status(200).send(userWithoutPassword);
    }
  };

  public static updateProfilePic = (req: Request, res: Response) => {
    service
      .UpdateProfilePic(req.params.id, req)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  };
  public static ChangePassword = async (req: Request, res: Response) => {
    // console.log(req.body);

    const userId = getUserId(req);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (user && bcrypt.compareSync(req.body.old_password, user.password)) {
      user.password = bcrypt.hashSync(req.body.new_password, 8);
      user.save();
      return res.status(200).send("password changed successfully");
    } else {
      return res.status(401).json({ detail: "Old password is incorrect !" });
    }
  };
}

export default UserController;
