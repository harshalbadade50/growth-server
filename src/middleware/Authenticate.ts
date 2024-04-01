import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_KEY } from "../services/UserService.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  console.log("token --- >>> ", token);
  if (!token) {
    return res.status(401).send({ message: "Access denied!" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_KEY) as JwtPayload;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token!" });
  }
};
