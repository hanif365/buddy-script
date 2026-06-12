import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const signToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_SECONDS });
};

export const setAuthCookie = (res: Response, token: string, remember = true) => {
  res.cookie("token", token, {
    ...cookieOptions,
    ...(remember ? { maxAge: TOKEN_EXPIRY_SECONDS * 1000 } : {}),
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", cookieOptions);
};
