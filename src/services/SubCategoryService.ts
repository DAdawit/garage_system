import { Request } from "express";
import { SubCategoryCreateI } from "../Types";
import { SubCategory } from "../entities/SubCategory";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Paginate } from "../utils/pagination";

export class SubCategoryService {
  async index(): Promise<SubCategory[] | null> {
    try {
      const subCategories = await SubCategory.find({
        relations: { category: true },
      });
      return subCategories;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching subCategories"
      );
    }
  }

  async AdmingetSubCategories(req: Request): Promise<any | null> {
    try {
      const queryBuilder = SubCategory.createQueryBuilder("subcategory")
        .leftJoinAndSelect("subcategory.category", "category")
        .orderBy("subcategory.created_at", "DESC");

      const data = Paginate<SubCategory>(queryBuilder, req);
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching subCategories"
      );
    }
  }

  async store(req: Request): Promise<SubCategory | null> {
    try {
      const imagePath = await uploadFile(req, "subCategory");

      const subCategory = new SubCategory();
      subCategory.name = req.body.name;
      subCategory.category = req.body.categoryId;
      subCategory.image = imagePath || "";

      await subCategory.save();
      return subCategory;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching subCategories"
      );
    }
  }

  async detail(id: string): Promise<SubCategory | null> {
    try {
      const subCategory = await SubCategory.findOne({
        where: {
          id: parseInt(id),
        },
      });

      return subCategory;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching subCategories"
      );
    }
  }

  async update(req: Request): Promise<SubCategory | null> {
    console.log("update");

    const subcategory = await SubCategory.findOneBy({
      id: parseInt(req.params.id),
    });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "subCategory");
    } catch (error) {
      imagePath = null;
    }
    const imageTodelete = `public/${subcategory?.image}`;
    if (imagePath !== null) {
      await DeleteImage(imageTodelete);
    }

    if (subcategory !== null) {
      subcategory.name = req.body.name;
      subcategory.category = req.body.categoryId as any;
      subcategory.image = imagePath ?? subcategory.image;
    }
    await subcategory?.save();
    return subcategory;
  }

  async remove(id: string): Promise<any | null> {
    try {
      const subCategory = await SubCategory.delete({ id: parseInt(id) });
      if (subCategory.affected === 0) {
        return null;
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting category"
      );
    }
  }
}
