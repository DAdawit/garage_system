import { error } from "console";
import { Request, Response } from "express";
import { PlainObjectToNewEntityTransformer } from "typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer";
import { UserService } from "../services/userService";
import { User } from "../entities/User";
import { CartService } from "../services/CartService";
import { getUserId } from "../utils/getUserid";

const service = new CartService();

class CartController {
  public static getCartItems = (req: Request, res: Response, next: any) => {
    service
      .getcartItems()
      .then((carts) => {
        res.json(carts);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static getUserCart = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .userCart(userId)
      .then((cart) => {
        res.send(cart);
      })
      .catch((err) => {
        return res.send(err);
      });
  };

  public static addToCart = async (req: Request, res: Response, next: any) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .AddTocart(userId, req)
      .then((cart) => {
        res.send(cart);
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static removeFromCart = (req: Request, res: Response, next: any) => {
    service
      .RemoveFromCart(req.params.id)
      .then(() => {
        res.send({ message: "product removed from the cart successfully" });
      })
      .catch((error) => {
        res.send(error);
      });
  };
  public static AddQuantity = (req: Request, res: Response) => {
    service
      .addQuantity(req.params.id)
      .then((cart) => {
        res.send(cart);
      })
      .catch((error) => {
        res.send(error);
      });
  };
  public static SubtractQuantity = (req: Request, res: Response) => {
    service
      .subtractQuantity(req.params.id)
      .then((cart) => {
        res.send(cart);
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static cartToWishlist = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));
    service
      .CartToWishlist(userId, req)
      .then((cart) => {
        res.send(cart);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static clearCart = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));
    service
      .ClearCart(userId)
      .then(() => {
        res.send({ message: "cart cleared successfully!" });
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default CartController;
