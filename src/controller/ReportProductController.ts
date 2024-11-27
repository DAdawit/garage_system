import { Request, Response } from "express";
import { ReportedProductService } from "../services/ReportedProductService";
import { getUserId } from "../utils/getUserid";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validationErrorFormater } from "../utils/validationErrorConverter";
import { ReportedMenu } from "../entities/ReportedMenu";

const service = new ReportedProductService();

class ReportProductController {
  public static getReportedMenu = (req: Request, res: Response) => {
    service
      .GetReportedMenu()
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static addReportedMenu = async (req: Request, res: Response) => {
    const report = plainToInstance(ReportedMenu, req.body);

    const errors = await validate(report);
    const err = validationErrorFormater(errors);

    if (errors.length > 0) {
      res.status(400).send(err);
    }

    const userId = await Promise.resolve(getUserId(req));

    service
      .AddReportedMenu(userId, req)
      .then((review) => {
        res.send(review);
      })
      .catch((error) => {
        res.send(error);
      });
  };
  //  form admin
  public static updateReview = async (
    req: Request,
    res: Response,
    next: any
  ) => {
    service
      .UpdateReview(req)
      .then((report) => {
        res.send(report);
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static removeReporte = async (req: Request, res: Response) => {
    const report = await ReportedMenu.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!report) {
      res.status(404).send({ message: "report not found" });
    } else {
      service
        .RemoveReporte(req)
        .then(async () => {
          res.send({ message: "report deleted successfully" });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  };
}

export default ReportProductController;
