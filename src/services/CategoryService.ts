import { DeleteResult, getRepository } from "typeorm";
import { Category } from "../entities/Category";
import Multer from "multer";
import { Request } from "express";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Paginate } from "../utils/pagination";

export class CategoryService {
  async getAll(): Promise<Category[] | null> {
    try {
      const categories = await Category.find({});
      return categories;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async admingetCategories(req: Request): Promise<any | null> {
    try {
      const queryBuilder = Category.createQueryBuilder().orderBy(
        "created_at",
        "DESC"
      );
      const data = Paginate<Category>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }
  async categoriesWithSubCategories(): Promise<Category[] | null> {
    try {
      const categories = await Category.find({
        relations: {
          subCategory: true,
        },
      });
      return categories;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const category = Category.findOne({
        where: { id: parseInt(id) },
        relations: {
          subCategory: true,
        },
      });
      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }
  async categoryById(id: string): Promise<Category | null> {
    try {
      const category = Category.findOneBy({
        id: parseInt(id),
      });
      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred in fetching category"
      );
    }
  }

  async add(req: Request): Promise<Category | null> {
    try {
      // Use the utility function to handle file upload
      const imagePath = await uploadFile(req, "category");

      const category = new Category();
      category.name = req.body.name.toLowerCase();
      category.image = imagePath || "";

      try {
        await category.save();
      } catch (error) {
        console.log(error);
      }

      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the category"
      );
    }
  }

  async update(id: string, req: Request): Promise<Category | null> {
    const category = await Category.findOne({
      where: {
        id: parseInt(id),
      },
    });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "category");
    } catch (error) {
      imagePath = null;
    }
    const imageTodelete = `public/${category?.image}`;
    if (imagePath !== null) {
      await DeleteImage(imageTodelete);
    }

    if (category !== null) {
      category.name = req.body.name.toLowerCase();
      category.image = imagePath ?? category.image;
    }
    await category?.save();
    return category;
  }

  async remove(id: string): Promise<any | null> {
    try {
      const category = await Category.delete({ id: parseInt(id) });
      if (category.affected === 0) {
        return null;
      }
      return category;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting category"
      );
    }
  }
}
