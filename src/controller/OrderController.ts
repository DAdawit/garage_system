import { Request, Response } from "express";
import { Order } from "../entities/Order";
import { OrderService } from "../services/OrderService";
import { getUserId } from "../utils/getUserid";

const service = new OrderService();
class OrderController {
  public static orderProduct = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .OrderProduct(userId, req)
      .then((cart) => {
        // res.send(cart);
        res.status(201).send({ message: "order placed successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static userOrders = async (req: Request, res: Response) => {
    const userId = await Promise.resolve(getUserId(req));

    service
      .getUserOrders(userId)
      .then((order) => {
        res.send(order);
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static cancelFullOrder = async (req: Request, res: Response) => {
    service
      .CancelFullOrder(req)
      .then(() => {
        res.status(201).send({ message: "Order cancel successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  };

  public static cancelOrderItem = async (req: Request, res: Response) => {
    service
      .CancelOrderItem(req)
      .then(() => {
        res.status(201).send({ message: "Order Item canceled successfully" });
      })
      .catch((err) => {
        res.send(err);
      });
  };
  public static changeStatus = async (req: Request, res: Response) => {
    service
      .ChangeStatus(req)
      .then((order) => {
        res.status(200).send(order);
      })
      .catch((err) => {
        res.send(err);
      });
  };
}

export default OrderController;
