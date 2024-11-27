import express from "express";
import router from "./routes/router";
import cors from "cors";
import { AppDataSource } from "./config";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();
const port: number = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   message: "Too many requests from this IP, please try again after 15 minutes",
// });
app.use(compression({ threshold: 1024 }));
// app.use(limiter);

const startServer = async () => {
  try {
    await AppDataSource.initialize(); // Initialize your DataSource
    console.log("db connected successfully !");
  } catch (error) {
    throw new Error("unable to connect to db");
  }

  app.use(express.static("public"));
  app.use(cors());

  app.use("/api", router);

  app.listen(port, () => {
    console.log("server started on port " + port);
  });
};

startServer();
