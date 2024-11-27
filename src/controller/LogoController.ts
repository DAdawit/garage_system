import { Request, Response } from "express";

import * as fs from "fs/promises"; // Import the promises API from the 'fs' module
import { DeleteImage } from "../utils/DeleteImages";
import { Hero } from "../entities/Hero";
import { LogoService } from "../services/LogoService";
import { Logo } from "../entities/Logo";

const service = new LogoService();

class LogoController {
  public static getLogos = (req: Request, res: Response) => {
    service
      .getAll()
      .then((hero) => {
        res.json(hero);
      })
      .catch((err) => [res.send(err)]);
  };

  public static AdmingetLogos = (req: Request, res: Response) => {
    service
      .admingetLogos(req)
      .then((logos) => {
        res.json(logos);
      })
      .catch((err) => [res.send(err)]);
  };
  public static getLogoById(req: Request, res: Response) {
    service
      .getById(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  public static addLogo = (req: Request, res: Response) => {
    service
      .add(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateLogo = (req: Request, res: Response) => {
    service
      .update(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static removeLogo = async (req: Request, res: Response) => {
    const category = await Logo.findOneBy({
      id: parseInt(req.params.id),
    });

    if (!category) {
      res.status(404).send({ message: "logo not found" });
    } else {
      service
        .remove(req)
        .then(async () => {
          const imagePath = `public/${category.image}`;
          console.log(imagePath);

          await DeleteImage(imagePath);
          res.send({ message: "logo deleted successfully" });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  };
}

export default LogoController;
