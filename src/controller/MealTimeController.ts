import { Request, Response } from "express";
import { MealTimeService } from "../services/MealTimeService";
import { AvailableMealTime } from "../entities/AvaliableMealTime";
import { DeleteImage } from "../utils/DeleteImages";
const service = new MealTimeService();
class MealTimeController {
  public static getMealTimes = (req: Request, res: Response) => {
    service
      .GetMealTimes()
      .then((mealTimes) => {
        res.send(mealTimes);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static addMealTime = (req: Request, res: Response) => {
    service
      .AddMealTime(req)
      .then((mealTime) => {
        res.send(mealTime);
      })
      .catch((err) => {
        res.json(err);
      });
  };
  public static getDetails = (req: Request, res: Response) => {
    service
      .GetDetails(req)
      .then((mealTime) => {
        res.send(mealTime);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static updateMealTime = (req: Request, res: Response) => {
    service
      .UpdateMealTime(req)
      .then((mealTime) => {
        res.send(mealTime);
      })
      .catch((err) => {
        res.json(err);
      });
  };

  public static deleteMealTime = async (req: Request, res: Response) => {
    const mealtime = await AvailableMealTime.findOne({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!mealtime) {
      res.status(404).send({ message: "Category not found" });
    }
    service
      .DeleteMealTime(req)
      .then(async () => {
        const imagePath = `public/${mealtime?.image}`;
        // console.log(imagePath);

        await DeleteImage(imagePath);
        res.send({ message: "mealTime deleted successfully" });
      })
      .catch((err) => {
        res.json(err);
      });
  };
}

export default MealTimeController;
