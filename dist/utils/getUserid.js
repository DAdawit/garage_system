"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const jwt_decode_1 = require("jwt-decode");
const getUserId = (req) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decode = (0, jwt_decode_1.jwtDecode)(token);
    // console.log(decode.id);
    return decode.id;
};
exports.getUserId = getUserId;
