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
// router.get("/users", UserController.getUsers);
router.get("/users", UserController_1.default.getUsers);
router.post("/users", UserController_1.default.addUser);
router.put("/change-profile-pic/:id", UserController_1.default.updateProfilePic);
// // Adimin routes
// authRoutes.get("/admin/profile", ProfileController.get);
// authRoutes.post("/admin/profile", ProfileController.addProfile);
// authRoutes.put("/admin/profile/:id", ProfileController.updateProfile);
// authRoutes.delete("/admin/profile/:id", ProfileController.get);
// authRoutes.post("/admin/changePassword", UserController.ChangePassword);
router.use(authRoutes);
exports.default = router;
