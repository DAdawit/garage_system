import { Request, Response } from "express";
import { SubCategoryService } from "../services/SubCategoryService";
import { plainToInstance } from "class-transformer";
import { SubCategory } from "../entities/SubCategory";
import { validate } from "class-validator";
import { validationErrorFormater } from "../utils/validationErrorConverter";

const service = new SubCategoryService();

class SubcategoryController {
  public static getAll = (req: Request, res: Response) => {
    service
      .index()
      .then((subcategories) => {
        res.send(subcategories);
      })
      .catch((err) => {
        res.send(err);
      });
  };
  public static AdmingetSubCategories = (req: Request, res: Response) => {
    service
      .AdmingetSubCategories(req)
      .then((subcategories) => {
        res.send(subcategories);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static getDetail = (req: Request, res: Response) => {
    service
      .detail(req.params.id)
      .then((subcategory) => {
        res.send(subcategory);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static addSubCategory = async (req: Request, res: Response) => {
    // const subCategory = plainToInstance(SubCategory, req.body);
    // const errors = await validate(subCategory);
    // const err = validationErrorFormater(errors);

    // if (errors.length > 0) {
    //   res.status(400).send(err);
    // }

    service
      .store(req)
      .then((subCategory) => {
        res.send(subCategory);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateSubCategory = (req: Request, res: Response) => {
    service
      .update(req)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static deleteSubcategory = (req: Request, res: Response) => {
    service
      .remove(req.params.id)
      .then(() => {
        res.send({ message: "SubCategory deleted successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default SubcategoryController;
