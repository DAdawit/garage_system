import dotenv from "dotenv";
dotenv.config();

export function getBaseUrl(): string {
  const host = process.env.HOST;
  return host ?? "http://localhost:4000/";
}
