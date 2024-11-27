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
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message: "Too many requests from this IP, please try again after 15 minutes",
// });
app.use((0, compression_1.default)({ threshold: 1024 }));
// app.use(limiter);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield config_1.AppDataSource.initialize(); // Initialize your DataSource
        console.log("db connected successfully !");
    }
    catch (error) {
        throw new Error("unable to connect to db");
    }
    app.use(express_1.default.static("public"));
    app.use((0, cors_1.default)());
    app.use("/api", router_1.default);
    app.listen(port, () => {
        console.log("server started on port " + port);
    });
});
startServer();
