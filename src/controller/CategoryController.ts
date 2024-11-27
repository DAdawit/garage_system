import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { Category } from "../entities/Category";
import * as fs from "fs/promises"; // Import the promises API from the 'fs' module
import { DeleteImage } from "../utils/DeleteImages";

const service = new CategoryService();

class CategoryController {
  public static getCategories = (req: Request, res: Response) => {
    service
      .getAll()
      .then((categories) => {
        res.json(categories);
      })
      .catch((err) => [res.send(err)]);
  };

  public static AdmingetCategories = (req: Request, res: Response) => {
    service
      .admingetCategories(req)
      .then((categories) => {
        res.json(categories);
      })
      .catch((err) => [res.send(err)]);
  };
  public static getCategorieswithSubcategories = (
    req: Request,
    res: Response
  ) => {
    service
      .categoriesWithSubCategories()
      .then((categories) => {
        res.json(categories);
      })
      .catch((err) => [res.send(err)]);
  };

  public static getCategoryById(req: Request, res: Response) {
    service
      .getById(req.params.id)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  public static categoryById(req: Request, res: Response) {
    service
      .categoryById(req.params.id)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  public static addCategory = (req: Request, res: Response) => {
    service
      .add(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateCategory = (req: Request, res: Response) => {
    service
      .update(req.params.id, req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static removeCategory = async (req: Request, res: Response) => {
    const category = await Category.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!category) {
      res.status(404).send({ message: "Category not found" });
    } else {
      service
        .remove(req.params.id)
        .then(async () => {
          const imagePath = `public/${category.image}`;

          await DeleteImage(imagePath);
          res.send({ message: "Category deleted successfully" });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  };
}

export default CategoryController;
