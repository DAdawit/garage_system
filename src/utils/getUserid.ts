import { Request } from "express";
import { jwtDecode } from "jwt-decode";
import { DataStoredInToken } from "../Types/dataStoredInToken";

export const getUserId = (req: Request) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decode = jwtDecode(token!) as DataStoredInToken;
  // console.log(decode.id);

  return decode.id;
};
