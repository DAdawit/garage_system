import { DeleteResult, getRepository } from "typeorm";
import { Category } from "../entities/Category";
import Multer from "multer";
import { Request } from "express";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Logo } from "../entities/Logo";
import { Paginate } from "../utils/pagination";
import { Profile } from "../entities/Profile";
import { log } from "console";

export class ProfileService {
  async get(): Promise<Profile | null> {
    try {
      const profile = await Profile.find({ take: 1 });
      return profile[0];
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async addProfile(req: Request): Promise<Profile | null> {
    try {
      const profile = new Profile();
      profile.name = req.body.name;
      profile.email = req.body.email;
      profile.address = req.body.address;
      profile.city = req.body.city;
      profile.phone = req.body.phone;
      profile.openTime = req.body.openTime;
      profile.secondaryPhone = req.body.secondaryPhone;

      try {
        await profile.save();
      } catch (error) {
        log(error);
      }

      return profile;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async update(req: Request): Promise<Profile | null> {
    const profile = await Profile.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!profile) {
      return null;
    }
    profile.name = req.body.name;
    profile.email = req.body.email;
    profile.address = req.body.address;
    profile.city = req.body.city;
    profile.phone = req.body.phone;
    profile.openTime = req.body.openTime;
    profile.secondaryPhone = req.body.secondaryPhone;

    try {
      await profile.save();
    } catch (error) {
      console.log(error);
    }
    return profile;
  }

  async remove(req: Request): Promise<any | null> {
    try {
      const logo = await Logo.delete({ id: parseInt(req.params.id) });
      if (logo.affected === 0) {
        return null;
      }
      return logo;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting category"
      );
    }
  }
}
