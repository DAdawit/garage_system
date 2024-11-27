import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres", // Database type
  host: "localhost", // Database host
  port: 5432, // Database port
  username: "postgres", // Database username
  password: "root", // Database password
  database: "hotelMenu", // Database name
  synchronize: true, // Automatically create database tables based on entities, use with caution in production
  logging: false,
  entities: [__dirname + "/entities/*{.js,.ts}"],
  migrations: [], // Specify your migration files here
  subscribers: [], // Specify your subscribers here
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
