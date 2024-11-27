import { Request, Response } from "express";
import { HeroSectionService } from "../services/HeroSectionService";
import { Category } from "../entities/Category";
import * as fs from "fs/promises"; // Import the promises API from the 'fs' module
import { DeleteImage } from "../utils/DeleteImages";
import { Hero } from "../entities/Hero";

const service = new HeroSectionService();

class HeroController {
  public static getHeroSection = (req: Request, res: Response) => {
    service
      .getAll()
      .then((hero) => {
        res.json(hero);
      })
      .catch((err) => [res.send(err)]);
  };
  public static getAllHeroSection = (req: Request, res: Response) => {
    service
      .getAllHeroSection()
      .then((hero) => {
        res.json(hero);
      })
      .catch((err) => [res.send(err)]);
  };

  public static AdminHeroSection = (req: Request, res: Response) => {
    service
      .AdmingetAll(req)
      .then((hero) => {
        res.json(hero);
      })
      .catch((err) => [res.send(err)]);
  };

  public static getHeroSectionById(req: Request, res: Response) {
    service
      .getById(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  public static addHeroSection = (req: Request, res: Response) => {
    service
      .add(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateHeroSection = (req: Request, res: Response) => {
    service
      .update(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static removeHeroSection = async (req: Request, res: Response) => {
    const category = await Hero.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!category) {
      res.status(404).send({ message: "hero not found" });
    } else {
      service
        .remove(req)
        .then(async () => {
          const imagePath = `public/${category.image}`;
          console.log(imagePath);

          await DeleteImage(imagePath);
          res.send({ message: "hero deleted successfully" });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  };
}

export default HeroController;
