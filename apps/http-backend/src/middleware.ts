import JWT_SECRET from "@repo/common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  id?: string;
}

export default function auth_middleWare(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  console.log("auth middleware called");
  const token = req.headers.authorization?.split(" ")[1] ?? "";

  try {
    if (token) {
      let decode;
      try {
        decode = jwt.verify(token, JWT_SECRET);
      } catch (e) {
        console.error(e);
      }

      console.log(decode);
      if (decode) {
        req.id = (decode as { id: string }).id;
        console.log("id", req.id);
        next();
      }
    }
  } catch (e) {
    console.error(e);
    res.status(401).send("Unauthorized");
  }
}
