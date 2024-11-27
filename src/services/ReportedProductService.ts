import { Cart } from "../entities/Cart";
import { Wishlist } from "../entities/Wishlist";
import { Request } from "express";
import { Review } from "../entities/Review";
import { ReviewStatus } from "../Types";
import { ReportedMenu } from "../entities/ReportedMenu";
import { Menu } from "../entities/Menu";

export class ReportedProductService {
  async GetReportedMenu(): Promise<ReportedMenu[] | null> {
    try {
      return await ReportedMenu.find({});
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while retrieving wishlist"
      );
    }
  }

  async AddReportedMenu(
    userId: number,
    req: Request
  ): Promise<ReportedMenu | null> {
    try {
      const product = await Menu.findOne({
        where: { id: parseInt(req.params.id) },
      });
      if (!product) {
        return null;
      }

      const newReport = new ReportedMenu();
      newReport.message = req.body.message;
      newReport.menu = parseInt(req.params.id) as any;
      newReport.user = userId as any;

      try {
        await newReport.save();
      } catch (error) {
        console.log("erorr on saving");
      }
      return newReport;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the Report"
      );
    }
  }

  async UpdateReview(req: Request): Promise<ReportedMenu | null> {
    try {
      const report = await ReportedMenu.findOne({
        where: { id: parseInt(req.params.id) },
      });
      if (!report) {
        return null;
      }
      report.status = req.body.status;
      await report.save();
      return report;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async RemoveReporte(req: Request): Promise<any | null> {
    try {
      const review = await ReportedMenu.delete({
        id: parseInt(req.params.id),
      });
      if (review.affected === 0) {
        return null;
      }
      return review;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the wishlist"
      );
    }
  }
}
