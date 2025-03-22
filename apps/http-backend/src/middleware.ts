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
  const token = req.headers.authorization ?? "";

  try {
    if (token) {
      const decode = jwt.verify(token, JWT_SECRET as string);
      if (decode) {
        req.id = (decode as { id: string }).id;
        next();
      }
    }
  } catch (e) {
    console.error(e);
    res.status(401).send("Unauthorized");
  }
}
