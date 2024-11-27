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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const User_1 = require("../entities/User");
class AdminService {
    DeActivateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOneBy({ id: parseInt(req.params.id) });
                if (!user) {
                    return null;
                }
                user.isActive = false;
                yield user.save();
                return user;
            }
            catch (error) {
                throw new Error(error instanceof Error
                    ? error.message
                    : "An unknown error occurred while deactivating user");
            }
        });
    }
    ActivateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOneBy({ id: parseInt(req.params.id) });
                if (!user) {
                    return null;
                }
                user.isActive = true;
                yield user.save();
                return user;
            }
            catch (error) {
                throw new Error(error instanceof Error
                    ? error.message
                    : "An unknown error occurred while activating user");
            }
        });
    }
}
exports.AdminService = AdminService;
