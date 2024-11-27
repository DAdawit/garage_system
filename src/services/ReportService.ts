import { Category } from "../entities/Category";
import { AppDataSource } from "../config";
import { SubCategory } from "../entities/SubCategory";
import { AvailableMealTime } from "../entities/AvaliableMealTime";
import { Menu } from "../entities/Menu";
export class ReportService {
  async IenusByCategory() {
    const categoryWithMenuItemsCount = await AppDataSource.manager
      .getRepository(Category)
      .createQueryBuilder("category")
      .leftJoin("category.menu", "menu")
      .select("category.id", "id")
      .addSelect("category.name", "name")
      .addSelect("COUNT(menu.id)", "menuItemsCount")
      .groupBy("category.id") // Keep this for SQL validity
      .getRawMany();
    return categoryWithMenuItemsCount;
  }

  async IenusBySubCategory() {
    const categoryWithMenuItemsCount = await AppDataSource.manager
      .getRepository(SubCategory)
      .createQueryBuilder("category")
      .leftJoin("category.menu", "menu")
      .select("category.id", "id")
      .addSelect("category.name", "name")
      .addSelect("COUNT(menu.id)", "menuItemsCount")
      .groupBy("category.id") // Keep this for SQL validity
      .getRawMany();
    return categoryWithMenuItemsCount;
  }
  async MenusBymealtime() {
    const categoryWithMenuItemsCount = await AppDataSource.manager
      .getRepository(AvailableMealTime)
      .createQueryBuilder("mealtime")
      .leftJoin("mealtime.menues", "menues")
      .select("mealtime.id", "id")
      .addSelect("mealtime.name", "name")
      .addSelect("COUNT(mealtime.id)", "menuItemsCount")
      .groupBy("mealtime.id") // Keep this for SQL validity
      .getRawMany();
    return categoryWithMenuItemsCount;
  }

  async Index() {
    const categories = await Category.count();
    const subcategories = await Category.count();
    const menus = await Menu.count();
    const data = {
      categories: categories,
      subcategories: subcategories,
      menus: menus,
    };
    return data;
  }
}
