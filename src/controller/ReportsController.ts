import { Request, Response } from "express";
import { ReportService } from "../services/ReportService";
const service = new ReportService();
class ReportsController {
  public static index(req: Request, res: Response) {
    service.Index().then((result) => {
      res.status(200).send(result);
    });
  }
  public static menusByCategory(req: Request, res: Response) {
    service.IenusByCategory().then((result) => {
      res.status(200).send(result);
    });
  }
  public static menusBySubCategory(req: Request, res: Response) {
    service.IenusBySubCategory().then((result) => {
      res.status(200).send(result);
    });
  }
  public static menusBymealtime(req: Request, res: Response) {
    service.MenusBymealtime().then((result) => {
      res.status(200).send(result);
    });
  }
}

export default ReportsController;
