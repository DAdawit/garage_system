import { DeleteResult, getRepository } from "typeorm";
import { Category } from "../entities/Category";
import Multer from "multer";
import { Request } from "express";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Hero } from "../entities/Hero";
import { HeroSectionResponse } from "../Types";
import { Logo } from "../entities/Logo";
import { Paginate } from "../utils/pagination";

export class HeroSectionService {
  async getAll(): Promise<HeroSectionResponse | null> {
    try {
      const hero = await Hero.find({ take: 1 });
      const logo = await Logo.findOne({
        where: {
          name: "Primary",
        },
      });
      let resData: HeroSectionResponse = {
        hero: null,
        logo: null,
      };
      resData.hero = hero[0];
      resData.logo = logo;

      return resData;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }
  async getAllHeroSection(): Promise<Hero[] | null> {
    try {
      const hero = await Hero.find({});
      return hero;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }
  async AdmingetAll(req: Request): Promise<any | null> {
    try {
      const queryBuilder = Hero.createQueryBuilder().orderBy(
        "created_at",
        "DESC"
      );
      const data = Paginate<Hero>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async getById(req: Request): Promise<Hero | null> {
    try {
      const hero = Hero.findOne({
        where: { id: parseInt(req.params.id) },
      });
      return hero;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async add(req: Request): Promise<Hero | null> {
    try {
      // Use the utility function to handle file upload
      const imagePath = await uploadFile(req, "herosection");

      const hero = new Hero();
      hero.slogan = req.body.slogan;
      hero.title = req.body.title;
      hero.content = req.body.content;
      hero.image = imagePath || "";

      try {
        await hero.save();
      } catch (error) {
        console.log(error);
      }
      hero.loadImagePath();

      return hero;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the category"
      );
    }
  }

  async update(req: Request): Promise<Hero | null> {
    const hero = await Hero.findOneBy({
      id: parseInt(req.params.id),
    });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "herosection");
    } catch (error) {
      imagePath = null;
    }
    const imageTodelete = `public/${hero?.image}`;
    if (imagePath !== null) {
      await DeleteImage(imageTodelete);
    }

    if (hero !== null) {
      hero.slogan = req.body.slogan;
      hero.title = req.body.title;
      hero.content = req.body.content;
      hero.image = imagePath ?? hero.image;
    }
    await hero?.save();
    hero?.loadImagePath();

    return hero;
  }

  async remove(req: Request): Promise<any | null> {
    try {
      const hero = await Hero.delete({ id: parseInt(req.params.id) });
      if (hero.affected === 0) {
        return null;
      }
      return hero;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting category"
      );
    }
  }
}
