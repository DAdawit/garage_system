import { NextFunction, Request, Response } from "express";
import { MenuService } from "../services/MenuService";
import { Menu } from "../entities/Menu";
import { DeleteImage } from "../utils/DeleteImages";
import { validate } from "class-validator";
import { validationErrorFormater } from "../utils/validationErrorConverter";
import { plainToInstance } from "class-transformer";
const service = new MenuService();
class ProductController {
  // public static getPaginatedProducts = (req: Request, res: Response) => {
  //   service
  //     .GetPaginatedProducts()
  //     .then((products) => {
  //       res.json(products);
  //     })
  //     .catch((err) => {
  //       res.json(err);
  //     });
  // };
  public static get = (req: Request, res: Response) => {
    service
      .get2(req)
      .then((menues) => {
        res.json(menues);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static fetchMenuesByMealTime = (req: Request, res: Response) => {
    service
      .FeatchMenuesByMealTime(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static menuesByCategory = (req: Request, res: Response) => {
    service
      .MenuesByCategory()
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static menuesByMealTime = (req: Request, res: Response) => {
    service
      .MenuesByMealTime()
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static menuesBySubCategory = (req: Request, res: Response) => {
    service
      .MenuesBySubCategory()
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static fetchMenuesByCategory = (req: Request, res: Response) => {
    service
      .FeatchMenuesByCategory(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static featchMenuesBySubCategory = (req: Request, res: Response) => {
    service
      .FeatchMenuesBySubCategory(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static featchMenuBySubCategory = (req: Request, res: Response) => {
    service
      .FeatchMenuesBySubCategory(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static fetchSpecialFoodsMenus = (req: Request, res: Response) => {
    service
      .FetchSpecialFoodsMenus()
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static SearchMenus = (req: Request, res: Response) => {
    service
      .searchMenus(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static adminMenuSearch = (req: Request, res: Response) => {
    service
      .AdminMenuSearch(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static fetchAllSpecialFoodsMenus = (req: Request, res: Response) => {
    service
      .FetchAllSpecialFoodsMenus(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static fetchMainDishes = (req: Request, res: Response) => {
    service
      .FetchMainDishes()
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static fetchAllMainDishes = (req: Request, res: Response) => {
    service
      .FetchAllMainDishes(req)
      .then((menus) => {
        res.send(menus);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static relatedProducts = (req: Request, res: Response) => {
    service
      .RelatedProducts(req)
      .then((products) => {
        res.send(products);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static add = async (req: Request, res: Response) => {
    if (!req.body.categoryId) {
      return res.status(400).send({ message: "category required" });
    }

    const newMenu = plainToInstance(Menu, req.body);
    const errors = await validate(newMenu);
    const err = validationErrorFormater(errors);
    if (errors.length > 0) {
      res.status(400).send(err);
    }

    service
      .add(req)
      .then((menu) => {
        res.status(201).send(menu);
      })
      .catch((err) => {
        if (err instanceof Error) {
          // Here you can add more specific error handling based on the error message or type
          // For example, if you have a custom NotFoundError for items not found in the database
          // if (err instanceof NotFoundError) {
          //   return res.status(404).json({ message: err.message });
          // }

          // For this example, we'll assume any error caught here is a server error
          res.status(500).json({ message: err.message });
        } else {
          // If the error is not an instance of Error, it's an unexpected condition
          res.status(500).json({ message: "An unexpected error occurred" });
        }
        res.send(err);
      });
  };

  public static detail = (req: Request, res: Response) => {
    service
      .detail(req)
      .then((menu) => {
        res.send(menu);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static updateMenu = (req: Request, res: Response) => {
    service
      .update(req)
      .then((menu) => {
        res.send(menu);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static delete = async (req: Request, res: Response) => {
    const menu = await Menu.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!menu) {
      res.status(404).send({ message: "product not found" });
    } else {
      service
        .remove(req.params.id)
        .then(async () => {
          const imagePath = `menues/${menu.image}`;
          await DeleteImage(imagePath);
          res.send({ message: "product deleted successfully" });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  };

  public static addProductColor = (req: Request, res: Response) => {
    service
      .AddProductColor(req)
      .then((menu) => {
        res.send(menu);
      })
      .catch((err) => {
        res.send(err);
      });
  };
  public static addOrChangeMenuImage = (req: Request, res: Response) => {
    service
      .AddOrChangeMenuImage(req)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default ProductController;
