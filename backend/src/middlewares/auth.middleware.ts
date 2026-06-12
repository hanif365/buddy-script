import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model";
import { ApiError } from "../utils/api-error";
import { JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
};
