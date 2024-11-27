import { Cart } from "../entities/Cart";
import { Wishlist } from "../entities/Wishlist";

export const clearCart = async (userId: number) => {
  try {
    const cartItems = await Cart.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    cartItems.map(async (item) => {
      await Cart.delete({ id: item.id });
    });
  } catch (error) {}
};

export const clearWishlist = async (userId: number) => {
  try {
    const wishlists = await Wishlist.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    wishlists.map(async (item) => {
      await Wishlist.delete({ id: item.id });
    });
  } catch (error) {}
};
