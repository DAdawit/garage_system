"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres", // Database type
    host: "localhost", // Database host
    port: 5432, // Database port
    username: "postgres", // Database username
    password: "root", // Database password
    database: "garage_system", // Database name
    synchronize: true, // Automatically create database tables based on entities, use with caution in production
    logging: false,
    entities: [__dirname + "/entities/*{.js,.ts}"],
    migrations: [], // Specify your migration files here
    subscribers: [], // Specify your subscribers here
});
// Initialize the data source
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
