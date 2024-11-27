import { Cart } from "../entities/Cart";
import { Request } from "express";
import { Wishlist } from "../entities/Wishlist";
import { clearCart } from "../utils/DBHelpers";
export class CartService {
  async getcartItems(): Promise<Cart[] | null> {
    try {
      return await Cart.find({
        relations: {
          user: true,
          menu: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async AddTocart(userId: number, req: Request): Promise<Cart | null> {
    try {
      const existingCart = await Cart.findOne({
        where: {
          user: { id: userId as any },
          menu: { id: req.body.productId },
        },
        relations: {
          menu: true,
          color: true,
        },
      });

      if (existingCart) {
        existingCart.menu = req.body.productId;
        existingCart.user = userId as any;
        existingCart.color = req.body.colorId ?? null;
        try {
          await existingCart.save();
        } catch (error) {
          console.log("error on saving");
        }
        return existingCart;
      }

      const cart = new Cart();
      cart.menu = req.body.productId;
      cart.user = userId as any;
      cart.color = req.body.colorId ?? null;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async RemoveFromCart(id: string): Promise<any | null> {
    try {
      const cart = await Cart.delete({ id: parseInt(id) });

      if (cart.affected === 0) {
        return null;
      }
      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async addQuantity(id: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findOne({ where: { id: parseInt(id) } });
      if (cart !== null) {
        cart.quantity = cart.quantity + 1;
        await cart.save();
      }

      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async subtractQuantity(id: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findOne({ where: { id: parseInt(id) } });
      if (cart && cart.quantity == 1) {
        return cart;
      }
      if (cart !== null) {
        cart.quantity = cart.quantity - 1;
        await cart.save();
      }

      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async userCart(userId: number): Promise<Cart[] | null> {
    try {
      const cart = await Cart.find({
        where: { user: { id: userId } },
        relations: {
          menu: true,
          color: true,
        },
        order: {
          id: "ASC",
        },
      });
      return cart;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async CartToWishlist(userId: number, req: Request): Promise<Wishlist | null> {
    try {
      const cart = await Cart.delete({ id: parseInt(req.params.id) });
      if (cart.affected === 0) {
        return null;
      }
      const wishlist = new Wishlist();
      wishlist.product = req.body.productId;
      wishlist.user = userId as any;
      await wishlist.save();
      return wishlist;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async ClearCart(userId: number): Promise<void | null> {
    try {
      await clearCart(userId);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while in clearing cart items"
      );
    }
  }
}
