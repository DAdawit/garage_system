import { Cart } from "../entities/Cart";
import { CartCreateI, WishListCreateI } from "../Types";
import { Wishlist } from "../entities/Wishlist";
import { Request } from "express";
import { CartService } from "./CartService";
import { clearWishlist } from "../utils/DBHelpers";

const cartService = new CartService();

export class WishLilstService {
  async GetWishlists(): Promise<Wishlist[] | null> {
    try {
      return await Wishlist.find({
        relations: {
          user: true,
          product: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while retrieving wishlist"
      );
    }
  }

  async AddToWishList(
    userId: number,
    data: WishListCreateI
  ): Promise<Wishlist | null> {
    try {
      const existingCart = await Wishlist.find({
        where: {
          user: { id: userId as any },
          product: { id: data.productId as any },
        },
      });

      if (existingCart.length > 0) {
        return null;
      }
      const wishlist = new Wishlist();
      wishlist.product = data.productId as any;
      wishlist.user = userId as any;
      await wishlist.save();
      return wishlist;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the wishlist"
      );
    }
  }

  async RemoveFromWishlist(id: string): Promise<any | null> {
    try {
      const wishlist = await Wishlist.delete({ id: parseInt(id) });

      if (wishlist.affected === 0) {
        return null;
      }
      return wishlist;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the wishlist"
      );
    }
  }

  async userWishlist(id: number): Promise<Wishlist[] | null> {
    try {
      const wishlist = await Wishlist.find({
        where: { user: { id: id } },
        relations: {
          product: true,
        },
        order: {
          id: "ASC",
        },
      });
      return wishlist;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async WishListToCart(userId: number, req: Request): Promise<Cart | null> {
    try {
      const wishlist = await Wishlist.delete({ id: parseInt(req.params.id) });
      if (wishlist.affected === 0) {
        return null;
      }
      const cart = new Cart();
      cart.menu = req.body.productId;
      cart.user = userId as any;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async ClearWishlist(userId: number): Promise<any | null> {
    try {
      await clearWishlist(userId);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while in clearing cart items"
      );
    }
  }
}
