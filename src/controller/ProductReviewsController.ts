import { error } from "console";
import { Request, Response } from "express";
import { ProductReviewService } from "../services/ProductReviewService";
import { getUserId } from "../utils/getUserid";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validationErrorFormater } from "../utils/validationErrorConverter";
import { Review } from "../entities/Review";

const service = new ProductReviewService();

class ProductRateingController {
  public static getProductReviews = (req: Request, res: Response) => {
    service
      .GetProductReviews(parseInt(req.params.id))
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((error) => {
        res.json(error);
      });
  };

  public static addProductReview = async (req: Request, res: Response) => {
    const review = plainToInstance(Review, req.body);

    const errors = await validate(review);
    const err = validationErrorFormater(errors);

    if (errors.length > 0) {
      res.status(400).send(err);
    }

    const userId = await Promise.resolve(getUserId(req));

    service
      .AddProductReview(userId, req)
      .then((review) => {
        res.send(review);
      })
      .catch((error) => {
        res.send(error);
      });
  };

  public static removeReview = async (
    req: Request,
    res: Response,
    next: any
  ) => {
    const userId = await Promise.resolve(getUserId(req));

    const review = await Review.findOne({
      where: { id: parseInt(req.params.id), user: { id: userId } },
    });

    if (!review) {
      return res
        .status(404)
        .send({ message: "You are not authorized to delete this review" });
    } else {
      service
        .RemoveReview(req)
        .then(() => {
          res.send({ message: "Review removed successfully" });
        })
        .catch((error) => {
          res.send(error);
        });
    }
  };
  public static updateReview = async (
    req: Request,
    res: Response,
    next: any
  ) => {
    const userId = await Promise.resolve(getUserId(req));

    const review = await Review.findOne({
      where: { id: parseInt(req.params.id), user: { id: userId } },
    });

    if (!review) {
      return res
        .status(404)
        .send({ message: "You are not authorized to update this review" });
    } else {
      service
        .UpdateReview(userId, req)
        .then((review) => {
          res.send(review);
        })
        .catch((error) => {
          res.send(error);
        });
    }
  };
}

export default ProductRateingController;
