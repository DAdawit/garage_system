"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminService_1 = require("../services/AdminService");
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
const service = new AdminService_1.AdminService();
class AdminController {
}
AdminController.getUsers = (req, res) => {
    userService
        .get()
        .then((users) => {
        res.send(users);
    })
        .catch((error) => {
        res.json(error);
    });
};
AdminController.deActivateUser = (req, res) => {
    service
        .DeActivateUser(req)
        .then((user) => {
        res.send(user);
    })
        .catch((err) => {
        res.json(err);
    });
};
AdminController.activateUser = (req, res) => {
    service
        .ActivateUser(req)
        .then((user) => {
        res.send(user);
    })
        .catch((err) => {
        res.json(err);
    });
};
exports.default = AdminController;
