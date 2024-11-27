"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SingleFileUploade_1 = require("../utils/SingleFileUploade");
const DeleteImages_1 = require("../utils/DeleteImages");
class UserService {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find({});
                return users;
            }
            catch (error) {
                throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
            }
        });
    }
    addUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = User_1.User.create({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: bcryptjs_1.default.hashSync(data.password, 8),
                });
                yield user.save();
                return user;
            }
            catch (error) {
                throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.delete({ id: parseInt(id) });
                if (user.affected === 0) {
                    return null;
                }
                return user;
            }
            catch (error) {
                throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
            }
        });
    }
    UpdateProfilePic(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({
                where: {
                    id: parseInt(id),
                },
            });
            let imagePath;
            try {
                imagePath = yield (0, SingleFileUploade_1.uploadFile)(req, "profiles");
            }
            catch (error) {
                imagePath = null;
            }
            const imageTodelete = `public/${user === null || user === void 0 ? void 0 : user.profilePic}`;
            if ((user === null || user === void 0 ? void 0 : user.profilePic) !== null) {
                if (imagePath !== null) {
                    yield (0, DeleteImages_1.DeleteImage)(imageTodelete);
                }
            }
            if (user !== null) {
                user.profilePic = imagePath ? imagePath : "";
            }
            user === null || user === void 0 ? void 0 : user.loadImagePath();
            yield (user === null || user === void 0 ? void 0 : user.save());
            return user;
        });
    }
}
exports.UserService = UserService;
