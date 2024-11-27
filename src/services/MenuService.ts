import { Request } from "express";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Color } from "../entities/Color";
import { Equal, In, Not, getRepository } from "typeorm";
import { Paginate } from "../utils/pagination";
import { Menu } from "../entities/Menu";
import { AvailableMealTime } from "../entities/AvaliableMealTime";
import { Category } from "../entities/Category";
import { SubCategory } from "../entities/SubCategory";
import { DataSource } from "typeorm";
import { AppDataSource } from "../config";
const searchCache = new Map<string, any>();
export class MenuService {
  async get2(req: Request): Promise<any | null> {
    try {
      const queryBuilder = Menu.createQueryBuilder("menu")
        .leftJoinAndSelect("menu.category", "category")
        .leftJoinAndSelect("menu.subCategory", "subCategory")
        .innerJoinAndSelect("menu.available_meal_times", "available_meal_times")
        .orderBy("menu.created_at", "DESC");

      const data = Paginate<Menu>(queryBuilder, req);
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products"
      );
    }
  }

  async get(req: Request): Promise<Menu[] | null> {
    try {
      const menues = await Menu.find({
        take: req.body.take || 25,
        skip: req.body.skip || 0,
        relations: {
          available_meal_times: true,
          category: true,
          subCategory: true,
        },
        order: {
          created_at: "DESC",
        },
      });
      return menues;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products"
      );
    }
  }

  async FeatchMenuesByCategory(req: Request): Promise<any | null> {
    try {
      const id = parseInt(req.params.id);
      const category = await Category.findOneBy({
        id,
      });

      const queryBuilder = Menu.createQueryBuilder("menu")
        .where("menu.categoryId = :id", { id })
        .leftJoin("menu.category", "category");

      const data = await Paginate<Menu>(queryBuilder, req);
      const result = { category, ...data };

      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }
  async FeatchMenuesBySubCategory(req: Request): Promise<any | null> {
    try {
      console.log("hello");

      const id = parseInt(req.params.id);
      const category = await SubCategory.findOneBy({
        id,
      });
      console.log(category);

      const queryBuilder = Menu.createQueryBuilder("menu")
        .where("menu.subCategoryId = :id", { id })
        .leftJoin("menu.subCategory", "subCategory");

      const data = await Paginate<Menu>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }

  async FeatchMenuesByMealTime(req: Request): Promise<any | null> {
    try {
      const id = parseInt(req.params.id);

      const queryBuilder = Menu.createQueryBuilder("menu")
        .innerJoin("menu.available_meal_times", "available_meal_times")
        .where("available_meal_times.id = :id", { id });

      const data = await Paginate<Menu>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }
  async FeatchMenuBySubCategory(req: Request): Promise<Menu[] | null> {
    try {
      const menues = await Menu.find({
        where: { subCategory: { id: parseInt(req.params.id) } },
      });
      return menues;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by subCategory"
      );
    }
  }

  async MenuesByMealTime(): Promise<any | null> {
    try {
      const mealtimes = await AvailableMealTime.find({});
      const dataPromises = mealtimes.map(async (item) => {
        let menu = await Menu.find({
          where: {
            available_meal_times: {
              id: item.id,
            },
          },
          take: 14,
        });
        return { ...item, menues: menu }; // Assuming you want to return the item with menus attached
      });

      const data = await Promise.all(dataPromises); // Wait for all promises to resolve
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }

  async MenuesBySubCategory(): Promise<any | null> {
    try {
      const mealtimes = await SubCategory.find({});
      const dataPromises = mealtimes.map(async (item) => {
        let menu = await Menu.find({
          where: {
            subCategory: {
              id: item.id,
            },
          },
          take: 25,
        });
        return { ...item, menues: menu }; // Assuming you want to return the item with menus attached
      });

      const data = await Promise.all(dataPromises); // Wait for all promises to resolve
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }

  async MenuesByCategory(): Promise<any | null> {
    try {
      const mealtimes = await Category.find({});
      const dataPromises = mealtimes.map(async (item) => {
        let menu = await Menu.find({
          where: {
            category: {
              id: item.id,
            },
          },
          take: 6,
        });
        return { ...item, menues: menu }; // Assuming you want to return the item with menus attached
      });

      const data = await Promise.all(dataPromises); // Wait for all promises to resolve
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by category"
      );
    }
  }

  async FetchSpecialFoodsMenus(): Promise<Menu[] | null> {
    try {
      const menues = await AppDataSource.manager
        .getRepository(Menu)
        .createQueryBuilder("menu")
        .leftJoinAndSelect("menu.category", "category")
        .where("category.name ILike :name", { name: `%food%` })
        .take(15)
        .getMany();

      return menues;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }
  async searchMenus(req: Request): Promise<any | null> {
    try {
      const searchTerm = req.query.search as string;
      if (searchCache?.has(searchTerm)) {
        return searchCache.get(searchTerm);
      }
      const queryBuilder = Menu.createQueryBuilder("menu").where(
        "menu.name LIKE :search OR menu.description LIKE :search OR menu.ingridiants LIKE :search",
        { search: `%${req.query.search}%` }
      );
      const data = await Paginate<Menu>(queryBuilder, req);
      searchCache.set(searchTerm, data);
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }
  async AdminMenuSearch(req: Request): Promise<any | null> {
    try {
      const queryBuilder = Menu.createQueryBuilder("menu")
        .where(
          "menu.name LIKE :search OR menu.description LIKE :search OR menu.ingridiants LIKE :search",
          { search: `%${req.query.search}%` }
        )
        .leftJoinAndSelect("menu.category", "category")
        .leftJoinAndSelect("menu.subCategory", "subCategory")
        .innerJoinAndSelect("menu.available_meal_times", "available_meal_times")
        .orderBy("menu.created_at", "DESC");
      const data = await Paginate<Menu>(queryBuilder, req);
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }
  async FetchMainDishes(): Promise<Menu[] | null> {
    try {
      const menues = await Menu.find({ where: { mainDishes: true }, take: 5 });
      return menues;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }

  async FetchAllMainDishes(req: Request): Promise<any | null> {
    try {
      const queryBuilder = getRepository(Menu)
        .createQueryBuilder("menu")
        .where("menu.mainDishes = :mainDishes", { mainDishes: true });
      const data = await Paginate<Menu>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }

  async FetchAllSpecialFoodsMenus(req: Request): Promise<any | null> {
    try {
      const queryBuilder = getRepository(Menu)
        .createQueryBuilder("menu")
        .where("menu.special = :special", { special: true });
      const data = await Paginate<Menu>(queryBuilder, req);

      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching menus by category name"
      );
    }
  }

  async RelatedProducts(req: Request): Promise<Menu[] | null> {
    try {
      const menu = await Menu.findOne({
        where: { id: parseInt(req.params.id) },
        relations: {
          subCategory: true,
        },
      });
      if (!menu) {
        return null;
      }

      const relatedMenues = await Menu.find({
        where: {
          subCategory: { id: menu.subCategory.id },
          id: Not(Equal(menu.id)), // Exclude the original product from the results
        },
      });
      return relatedMenues;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on fetching products by subCategory"
      );
    }
  }

  async add(req: Request): Promise<Menu | null> {
    try {
      const availableMealTimes = await AvailableMealTime.findByIds(
        req.body.available_meal_times
      );
      const subCategoryId = parseInt(req.body.subCategoryId);
      // console.log(req.body);

      const menu = new Menu();
      menu.name = req.body.name;
      menu.description = req.body.description;
      menu.price = req.body.price;
      menu.special = req.body.special;
      menu.ingridiants = req.body.ingredients;
      menu.avaliable_all_day = req.body.avaliable_all_day;
      menu.mainDishes = req.body.mainDishes;
      menu.category = parseInt(req.body.categoryId) as any;
      menu.subCategory = subCategoryId ? (subCategoryId as any) : null;

      menu.available_meal_times = availableMealTimes;
      // console.log(menu);

      try {
        await menu.save();
      } catch (error) {
        console.log(error);
        throw error;
      }
      menu.loadImagePath();
      return menu;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the category"
      );
    }
  }

  async update(req: Request): Promise<Menu | null> {
    const menu = await Menu.findOneBy({ id: parseInt(req.params.id) });

    const availableMealTimes = await AvailableMealTime.find({
      where: {
        id: In(req.body.available_meal_times),
      },
    });
    console.log(req.body);

    if (!menu) {
      return null;
    }
    const subCategoryId = parseInt(req.body.subCategoryId);
    console.log(subCategoryId);

    menu.name = req?.body.name;
    menu.description = req.body.description;
    menu.price = req.body.price;
    menu.special = req.body.special;
    menu.ingridiants = req.body.ingredients;
    menu.avaliable_all_day = req.body.avaliable_all_day;
    menu.mainDishes = req.body.mainDishes;
    menu.category = parseInt(req.body.categoryId) as any;
    menu.subCategory = subCategoryId ? (subCategoryId as any) : null;
    menu.available_meal_times = availableMealTimes;
    // console.log(menu);

    try {
      await menu.save();
    } catch (error) {
      console.log(error);
    }
    menu.loadImagePath();
    // console.log(menu);

    return menu;
  }

  async detail(req: Request): Promise<Menu | null> {
    try {
      const menu = await Menu.findOne({
        where: { id: parseInt(req.params.id) },
        relations: {
          available_meal_times: true,
          category: true,
          subCategory: true,
        },
      });

      return menu;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred on product detail"
      );
    }
  }

  async remove(id: string): Promise<any | null> {
    try {
      const menu = await Menu.delete({ id: parseInt(id) });
      if (menu.affected === 0) {
        return null;
      }
      return menu;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting product"
      );
    }
  }

  async AddProductColor(req: Request): Promise<Color | null> {
    console.log(req.body, req.params);

    try {
      const color = new Color();
      color.quantity = req.body.quantity;
      color.name = req.body.name;
      await color.save();
      return color;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving product model."
      );
    }
  }

  async AddOrChangeMenuImage(req: Request): Promise<Menu | null> {
    const menu = await Menu.findOneBy({ id: parseInt(req.params.id) });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "menues");
    } catch (error) {
      console.log(error);

      imagePath = null;
    }
    const imageTodelete = `public/${menu?.image}`;

    if (menu?.image !== null) {
      if (imagePath !== null) {
        await DeleteImage(imageTodelete);
      }
    }

    if (menu !== null) {
      menu.image = imagePath ?? "";
    }
    await menu?.save();
    menu?.loadImagePath();
    return menu;
  }
}
