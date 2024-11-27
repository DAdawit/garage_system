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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
const User_1 = require("../entities/User");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validationErrorConverter_1 = require("../utils/validationErrorConverter");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const getUserid_1 = require("../utils/getUserid");
dotenv_1.default.config();
const service = new userService_1.UserService();
class UserController {
}
_a = UserController;
UserController.createToken = (id) => {
    const secrete = process.env.SECRETE;
    if (!secrete) {
        throw new Error("secrete environment variable is not set");
    }
    const token = jsonwebtoken_1.default.sign({ id: id }, secrete, { expiresIn: "10d" });
    return token;
};
UserController.GetUsers = (req, res) => {
    service
        .getUsers(req)
        .then((users) => {
        return res.send(users);
    })
        .catch((err) => {
        res.send(err);
    });
};
UserController.GetUserById = (req, res) => {
    service
        .getUserById(req.params.id)
        .then((users) => {
        return res.send(users);
    })
        .catch((err) => {
        res.send(err);
    });
};
UserController.addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Newuser = (0, class_transformer_1.plainToInstance)(User_1.User, req.body);
    const errors = yield (0, class_validator_1.validate)(Newuser);
    const err = (0, validationErrorConverter_1.validationErrorFormater)(errors);
    const user = yield User_1.User.findOne({ where: { email: Newuser.email } });
    if (user) {
        return res.status(400).json({ detail: "email already exists !" });
    }
    if (errors.length > 0) {
        res.status(400).send(err);
    }
    else {
        service
            .addUser(Newuser)
            .then((user) => {
            if (user) {
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                const token = _a.createToken(user.id);
                const data = {
                    user: userWithoutPassword,
                    token: token,
                };
                return res.status(200).send(data);
            }
            return res.status(400).send({ detail: "User creation failed" });
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    }
});
UserController.deleteUser = (req, res, next) => {
    service
        .remove(req.params.id)
        .then(() => {
        return res.send({ message: "user deleted successfully" });
    })
        .catch((error) => {
        return res.send(error);
    });
};
UserController.LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        return res.status(400).json({ detail: "Incorrect email or password." });
    }
    if (user && bcryptjs_1.default.compareSync(req.body.password, user.password)) {
        const token = _a.createToken(user.id);
        const data = {
            user: user,
            token: token,
        };
        return res.status(200).send(data);
    }
    else {
        return res.status(401).json({ detail: "Incorrect email or password." });
    }
});
UserController.verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, getUserid_1.getUserId)(req);
    const user = yield User_1.User.findOne({
        where: {
            id: userId,
        },
    });
    if (user) {
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(200).send(userWithoutPassword);
    }
});
UserController.updateProfilePic = (req, res) => {
    service
        .UpdateProfilePic(req.params.id, req)
        .then((user) => {
        return res.send(user);
    })
        .catch((err) => {
        return res.send(err);
    });
};
UserController.ChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (0, getUserid_1.getUserId)(req);
    const user = yield User_1.User.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(404).json({ detail: "User not found" });
    }
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
        return res
            .status(400)
            .json({ detail: "old and new passwords are required" });
    }
    const isPasswordCorrect = bcryptjs_1.default.compareSync(old_password, user.password);
    if (isPasswordCorrect) {
        user.password = bcryptjs_1.default.hashSync(new_password, 8);
        yield user.save();
        return res.status(200).send({ message: "Password changed successfully" });
    }
    else {
        return res.status(401).json({ detail: "old password is incorrect!" });
    }
});
exports.default = UserController;
