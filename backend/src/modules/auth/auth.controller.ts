import { Request, Response } from "express";
import { registerSchema, loginSchema, googleAuthSchema } from "./auth.validator";
import { registerUser, loginUser, googleLogin } from "./auth.service";
import { publicUser } from "../user/user.dto";
import { signToken, setAuthCookie, clearAuthCookie } from "../../utils/token";
import { ApiError } from "../../utils/api-error";

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await registerUser(data);
  const token = signToken(String(user._id));
  setAuthCookie(res, token);

  res.status(201).json({ user: publicUser(user) });
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await loginUser(data);
  const token = signToken(String(user._id));
  setAuthCookie(res, token, data.remember ?? true);

  res.json({ user: publicUser(user) });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { code } = googleAuthSchema.parse(req.body);

  const user = await googleLogin(code);
  const token = signToken(String(user._id));
  setAuthCookie(res, token);

  res.json({ user: publicUser(user) });
};

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  res.json({ user: publicUser(req.user) });
};
