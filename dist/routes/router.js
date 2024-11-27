"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controller/UserController"));
// import CartController from "../controller/CartController";
// import MenuController from "../controller/MenuController";
// import OrderController from "../controller/OrderController";
// import authMiddleware from "../middleware/authMiddleware";
// import CategoryController from "../controller/CategoryController";
// import SubcategoryController from "../controller/SubCategoryController";
// import WishListController from "../controller/WishListController";
// import ProductRateingController from "../controller/ProductReviewsController";
// import ReportProductController from "../controller/ReportProductController";
// import AdminController from "../controller/AdminController";
// import MealTimeController from "../controller/MealTimeController";
// import HeroController from "../controller/HeroController";
// import LogoController from "../controller/LogoController";
// import ReportsController from "../controller/ReportsController";
// import ProfileController from "../controller/ProfileController";
const router = (0, express_1.Router)();
const authRoutes = (0, express_1.Router)();
// Routes that do not require authentication
router.post("/login", UserController_1.default.LoginUser);
router.get("/users", UserController_1.default.getUsers);
router.post("/users", UserController_1.default.addUser);
router.put("/change-profile-pic/:id", UserController_1.default.updateProfilePic);
// authRoutes.post("/admin/categories", CategoryController.addCategory);
// authRoutes.get("/admin/categories/:id", CategoryController.getCategoryById);
// authRoutes.delete("/admin/categories/:id", CategoryController.removeCategory);
// authRoutes.put("/admin/categories/:id", CategoryController.updateCategory);
// authRoutes.get("/admin/all-sub-categories", SubcategoryController.getAll);
// authRoutes.get(
//   "/admin/sub-categories",
//   SubcategoryController.AdmingetSubCategories
// );
// authRoutes.post("/admin/sub-categories", SubcategoryController.addSubCategory);
// authRoutes.get("/admin/sub-categories/:id", SubcategoryController.getDetail);
// authRoutes.get("/admin/mealTimes", MealTimeController.getMealTimes);
// authRoutes.post("/admin/mealTimes", MealTimeController.addMealTime);
// authRoutes.get("/admin/mealTimes/:id", MealTimeController.getDetails);
// authRoutes.put("/admin/mealTimes/:id", MealTimeController.updateMealTime);
// authRoutes.delete("/admin/mealTimes/:id", MealTimeController.deleteMealTime);
// authRoutes.delete(
//   "/admin/sub-categories/:id",
//   SubcategoryController.deleteSubcategory
// );
// authRoutes.put(
//   "/admin/sub-categories/:id",
//   SubcategoryController.updateSubCategory
// );
// authRoutes.get("/categories", CategoryController.getCategories);
// authRoutes.get("/sub-categories", SubcategoryController.getAll);
// authRoutes.delete("/users/:id", UserController.deleteUser);
// authRoutes.post("/verifyToken", UserController.verifyToken);
// authRoutes.get("/userOrders", OrderController.userOrders);
// authRoutes.post("/order", OrderController.orderProduct);
// authRoutes.post("/cancel-full-order/:id", OrderController.cancelFullOrder);
// authRoutes.post("/cancel-order-item/:id", OrderController.cancelOrderItem);
// authRoutes.get("/cart", CartController.getCartItems);
// authRoutes.post("/cart", CartController.addToCart);
// authRoutes.delete("/cart/:id", CartController.removeFromCart);
// authRoutes.post("/cartAddQuantity/:id", CartController.AddQuantity);
// authRoutes.post("/cartSubtractQuantity/:id", CartController.SubtractQuantity);
// authRoutes.get("/userCartItems", CartController.getUserCart);
// authRoutes.post("/cart-to-wishlist/:id", CartController.cartToWishlist);
// authRoutes.post("/clear-cart", CartController.clearCart);
// authRoutes.get("/wishlist", WishListController.getwishlists);
// authRoutes.post("/wishlist", WishListController.addToWishlist);
// authRoutes.delete("/wishlist/:id", WishListController.removeFromWishlist);
// authRoutes.get("/userwishlist", WishListController.getUserWishlist);
// authRoutes.post("/wishlist-to-cart/:id", WishListController.wishListToCArt);
// authRoutes.post("/clear-wishlist", WishListController.clearWishlist);
// authRoutes.get("/menu/:id/review", ProductRateingController.getProductReviews);
// authRoutes.post("/menu/:id/review", ProductRateingController.addProductReview);
// authRoutes.delete("/menu/:id/review", ProductRateingController.removeReview);
// authRoutes.put("/menu/:id/review", ProductRateingController.updateReview);
// authRoutes.get("/reported-menues", ReportProductController.getReportedMenu);
// authRoutes.post("/report-menu/:id", ReportProductController.addReportedMenu);
// // will be done for admin only
// authRoutes.put("/report-menu/:id", ReportProductController.updateReview);
// authRoutes.get(
//   "/admin/states/menuByCategory",
//   ReportsController.menusByCategory
// );
// authRoutes.get(
//   "/admin/states/menuBysubCategory",
//   ReportsController.menusBySubCategory
// );
// authRoutes.get("/admin/states/mealtime", ReportsController.menusBymealtime);
// authRoutes.get("/admin/states", ReportsController.index);
// // Adimin routes
// authRoutes.get("/admin/profile", ProfileController.get);
// authRoutes.post("/admin/profile", ProfileController.addProfile);
// authRoutes.put("/admin/profile/:id", ProfileController.updateProfile);
// authRoutes.delete("/admin/profile/:id", ProfileController.get);
// authRoutes.post("/admin/changePassword", UserController.ChangePassword);
router.use(authRoutes);
exports.default = router;
