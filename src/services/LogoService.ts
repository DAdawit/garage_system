import { DeleteResult, getRepository } from "typeorm";
import { Category } from "../entities/Category";
import Multer from "multer";
import { Request } from "express";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Logo } from "../entities/Logo";
import { Paginate } from "../utils/pagination";

export class LogoService {
  async getAll(): Promise<Logo[] | null> {
    try {
      const logos = await Logo.find({});
      // console.log(logos);

      return logos;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async admingetLogos(req: Request): Promise<any | null> {
    try {
      const queryBuilder = Logo.createQueryBuilder().orderBy(
        "created_at",
        "DESC"
      );
      const data = Paginate<Logo>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async getById(req: Request): Promise<Logo | null> {
    try {
      const logo = Logo.findOne({
        where: { id: parseInt(req.params.id) },
      });
      return logo;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async add(req: Request): Promise<Logo | null> {
    try {
      // Use the utility function to handle file upload
      const imagePath = await uploadFile(req, "logos");

      const logo = new Logo();
      logo.name = req.body.name.toLowerCase();
      logo.image = imagePath || "";

      try {
        await logo.save();
      } catch (error) {
        console.log(error);
      }
      logo.loadImagePath();

      return logo;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the category"
      );
    }
  }

  async update(req: Request): Promise<Logo | null> {
    const logo = await Logo.findOneBy({
      id: parseInt(req.params.id),
    });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "logos");
    } catch (error) {
      imagePath = null;
    }
    const imageTodelete = `public/${logo?.image}`;
    if (imagePath !== null) {
      await DeleteImage(imageTodelete);
    }

    if (logo !== null) {
      logo.name = req.body.name.toLowerCase();
      logo.image = imagePath ?? logo.image;
    }
    await logo?.save();
    logo?.loadImagePath();

    return logo;
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
