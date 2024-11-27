import { Request, Response } from "express";

import * as fs from "fs/promises"; // Import the promises API from the 'fs' module
import { DeleteImage } from "../utils/DeleteImages";
import { Hero } from "../entities/Hero";
import { ProfileService } from "../services/ProfileService";
import { Logo } from "../entities/Logo";
import { plainToInstance } from "class-transformer";
import { Profile } from "../entities/Profile";
import { validate } from "class-validator";
import { validationErrorFormater } from "../utils/validationErrorConverter";

const service = new ProfileService();

class ProfileController {
  public static get = (req: Request, res: Response) => {
    service
      .get()
      .then((profile) => {
        res.json(profile);
      })
      .catch((err) => [res.send(err)]);
  };

  public static addProfile = async (req: Request, res: Response) => {
    const profile = plainToInstance(Profile, req.body);
    const errors = await validate(profile);
    const err = validationErrorFormater(errors);

    if (errors.length > 0) {
      res.status(400).send(err);
    }
    service
      .addProfile(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateProfile = (req: Request, res: Response) => {
    service
      .update(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static deleteProfile = async (req: Request, res: Response) => {
    service
      .remove(req)
      .then(async () => {
        res.send({ message: "profile deleted successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default ProfileController;
