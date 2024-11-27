import { Cart } from "../entities/Cart";
import { Wishlist } from "../entities/Wishlist";
import { Request } from "express";
import { Review } from "../entities/Review";
import { ReviewStatus } from "../Types";

export class ProductReviewService {
  async GetProductReviews(id: number): Promise<Review[] | null> {
    try {
      return await Review.find({
        relations: {
          menu: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while retrieving wishlist"
      );
    }
  }

  async AddProductReview(userId: number, req: Request): Promise<Review | null> {
    try {
      const review = await Review.findOne({
        where: {
          menu: {
            id: parseInt(req.params.id),
          },
          user: {
            id: userId,
          },
        },
      });

      if (review) {
        review.rate = req.body.rate;
        review.comment = req.body.comment;
        review.edited = true;
        await review.save();
        return review;
      } else {
        const newReview = new Review();
        newReview.rate = req.body.rate;
        newReview.comment = req.body.comment;
        newReview.menu = parseInt(req.params.id) as any;
        newReview.user = userId as any;
        await newReview.save();
        return newReview;
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while saving the product review"
      );
    }
  }

  async RemoveReview(req: Request): Promise<any | null> {
    try {
      const review = await Review.delete({ id: parseInt(req.params.id) });
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

  async UpdateReview(userId: number, req: Request): Promise<Review | null> {
    try {
      const review = await Review.findOne({
        where: { id: parseInt(req.params.id), user: { id: userId } },
      });
      if (!review) {
        return null;
      }
      review.comment = req.body.comment;
      review.rate = req.body.rate;
      review.edited = false;

      await review.save();
      return review;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
}
