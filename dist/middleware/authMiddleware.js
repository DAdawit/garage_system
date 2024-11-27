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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
function authMiddleware(request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const secrete = process.env.SECRETE;
        if (!secrete) {
            throw new Error("secrete environment variable is not set");
        }
        if (token) {
            try {
                const verificationResponse = jsonwebtoken_1.default.verify(token, secrete);
                const id = verificationResponse.id;
                const user = yield User_1.User.findOne({
                    where: {
                        id: id,
                    },
                });
                if (user) {
                    next();
                }
                else {
                    next(response.status(401).send({ detail: "invalid token" }));
                }
            }
            catch (error) {
                next(response.status(401).send({ detail: "invalid token" }));
            }
        }
        else {
            next(response.status(404).send({ detail: "Unauthorized" }));
        }
    });
}
exports.default = authMiddleware;
