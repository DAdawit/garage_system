import { error } from "console";
import { Request, Response } from "express";
import { PlainObjectToNewEntityTransformer } from "typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer";
import { UserService } from "../services/userService";
import { User } from "../entities/User";
import { WishLilstService } from "../services/WishLilstService";
import { getUserId } from "../utils/getUserid";

const service = new WishLilstService();

class WishListController {
  public static getwishlists = (req: Request, res: Response, next: any) => {
    service
      .GetWishlists()
      .then((wishlists) => {
        res.json(wishlists);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static getUserWishlist = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .userWishlist(userId)
      .then((wishlist) => {
        res.send(wishlist);
      })
      .catch((err) => {
        return res.send(err);
      });
  };

  public static addToWishlist = async (
    req: Request,
    res: Response,
    next: any
  ) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .AddToWishList(userId, req.body)
      .then((wishlist) => {
        res.send(wishlist);
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static removeFromWishlist = (
    req: Request,
    res: Response,
    next: any
  ) => {
    service
      .RemoveFromWishlist(req.params.id)
      .then(() => {
        res.send({ message: "product removed from the wishlist successfully" });
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static wishListToCArt = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));
    service
      .WishListToCart(userId, req)
      .then((cart) => {
        res.send(cart);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static clearWishlist = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));
    service
      .ClearWishlist(userId)
      .then(() => {
        res.send({ message: "wishlist cleared successfully!" });
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default WishListController;
