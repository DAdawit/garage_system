import { getRepository } from "typeorm";
import {
  OrderCreateI,
  SortedCarItemsBasedOnStoreT,
  UnsortedCartItmesI,
  UserOrdersOutI,
} from "../Types";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItems";
import { User } from "../entities/User";
import { Request } from "express";
import { DeliveryAddress } from "../entities/DeliveryAddress";
import { clearCart } from "../utils/DBHelpers";

export class OrderService {
  async OrderProduct(userId: number, req: Request): Promise<any | null> {
    try {
      const cartItems = await Cart.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          menu: true,
          color: true,
        },
      });
      // console.log("hello mother", cartItems);

      const orderId = this.generateOrderId();

      const address = new DeliveryAddress();
      address.user = userId as any;
      address.fullName = req.body.fullName;
      address.phoneNumber = req.body.phoneNumber;
      address.country = req.body.country;
      address.city = req.body.city;
      address.street = req.body.street;
      address.lat = req.body.useCurrentLocation ? req.body.lat : null;
      address.long = req.body.useCurrentLocation ? req.body.long : null;
      address.default = req.body.default ? req.body.default : false;
      try {
        await address.save();
      } catch (error) {
        console.log("Error on saving address");
      }
      await address.save();

      // cartItems.map(async (storeCart) => {
      //   const order = new Order();
      //   order.user = userId as any;
      //   order.order_id = orderId;
      //   order.deliveryAddress = address;
      //   try {
      //     await order.save();
      //   } catch (error) {
      //     console.log("Error saving order");
      //   }
      //   storeCart.map(async (cartItems) => {
      //     console.log("order id", order.id);

      //     const item = new OrderItem();
      //     item.color = cartItems.color?.id as any;
      //     item.quantity = cartItems.quantity;
      //     item.menu = cartItems.menu.id as any;
      //     item.order = order.id as any;
      //     item.subTotal = cartItems.quantity * cartItems.menu.price;

      //     try {
      //       await item.save();
      //     } catch (error) {
      //       console.log("Error saving order item");
      //     }
      //   });
      // });

      await clearCart(userId);
      return true;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async getUserOrders(userId: number): Promise<UserOrdersOutI[] | null> {
    try {
      const orders = await Order.find({
        where: { user: { id: userId } },
        relations: {
          ordersItems: { menu: true, color: true },
        },
      });
      return null;
      // return orders as UserOrdersOutI[];
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async CancelFullOrder(req: Request): Promise<any | null> {
    try {
      const order = await Order.delete({ id: parseInt(req.params.id) });
      if (order.affected === 0) {
        return null;
      }
      return order;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async CancelOrderItem(req: Request): Promise<any | null> {
    try {
      const order = await OrderItem.delete({ id: parseInt(req.params.id) });
      if (order.affected === 0) {
        return null;
      }
      return order;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
  async ChangeStatus(req: Request): Promise<Order | null> {
    try {
      const order = await Order.findOne({
        where: { id: parseInt(req.params.id) },
      });
      if (order === null) {
        return null;
      }
      order.status = req.body.status;
      order.save();
      return order;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  private generateOrderId() {
    return Math.random().toString(36).substr(2, 18);
  }

  private separateCartItemsByStore(
    cartItems: UnsortedCartItmesI[]
  ): Promise<SortedCarItemsBasedOnStoreT> {
    const groupedByStoreId = cartItems.reduce(
      (acc: Record<number, UnsortedCartItmesI[]>, item) => {
        const storeId = item.product.store.id;
        if (!acc[storeId]) {
          acc[storeId] = [];
        }
        acc[storeId].push(item);
        return acc;
      },
      {}
    );

    return Promise.resolve(Object.values(groupedByStoreId));
  }
}
