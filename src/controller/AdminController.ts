import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { UserService } from "../services/userService";
import { ReportedProductService } from "../services/ReportedProductService";
const userService = new UserService();
const service = new AdminService();

const reportProdService = new ReportedProductService();
class AdminController {
  public static getUsers = (req: Request, res: Response) => {
    userService
      .get()
      .then((users) => {
        res.send(users);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static deActivateUser = (req: Request, res: Response) => {
    service
      .DeActivateUser(req)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static activateUser = (req: Request, res: Response) => {
    service
      .ActivateUser(req)
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static getReportedProducts = (req: Request, res: Response) => {
    reportProdService
      .GetReportedMenu()
      .then((stores) => {
        res.send(stores);
      })
      .catch((error) => {
        res.json(error);
      });
  };
}

export default AdminController;
