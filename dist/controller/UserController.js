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
    const secret = process.env.SECRET;
    if (!secret) {
        throw new Error("SECRET environment variable is not set");
    }
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: "10d" });
};
UserController.GetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield service.getUsers(req);
        return res.status(200).json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ detail: "Failed to fetch users" });
    }
});
UserController.GetUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield service.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(200).json(userWithoutPassword);
    }
    catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ detail: "Failed to fetch user" });
    }
});
UserController.addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Newuser = (0, class_transformer_1.plainToInstance)(User_1.User, req.body);
    const errors = yield (0, class_validator_1.validate)(Newuser);
    const err = (0, validationErrorConverter_1.validationErrorFormater)(errors);
    const user = yield User_1.User.findOne({ where: { email: Newuser.email } });
    if (user) {
        return res.status(400).json({ detail: "email already exists !" });
    }
    if (errors.length > 0) {
        return res.status(400).send(err);
    }
    else {
        try {
            const user = yield service.addUser(Newuser);
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
        }
        catch (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ detail: "Failed to create user" });
        }
    }
});
UserController.deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield service.remove(req.params.id);
        return res.send({ message: "user deleted successfully" });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ detail: "Failed to delete user" });
    }
});
UserController.LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ detail: "Email and password are required" });
        }
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
            return res.status(401).json({ detail: "Incorrect email or password" });
        }
        const token = _a.createToken(user.id);
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(200).json({
            user: userWithoutPassword,
            token
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ detail: "Authentication failed" });
    }
});
UserController.verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        else {
            return res.status(404).json({ detail: "User not found" });
        }
    }
    catch (err) {
        console.error('Error verifying token:', err);
        return res.status(500).json({ detail: "Failed to verify token" });
    }
});
UserController.updateProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield service.UpdateProfilePic(req.params.id, req);
        return res.send(user);
    }
    catch (err) {
        console.error('Error updating profile picture:', err);
        return res.status(500).json({ detail: "Failed to update profile picture" });
    }
});
UserController.ChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (err) {
        console.error('Error changing password:', err);
        return res.status(500).json({ detail: "Failed to change password" });
    }
});
exports.default = UserController;
