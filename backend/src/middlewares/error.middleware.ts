import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.issues[0].message });
  }

  const e = err as { code?: number; message?: string; name?: string };

  if (e.name === "MulterError") {
    return res.status(400).json({ message: e.message });
  }

  if (e.code === 11000) {
    return res.status(409).json({ message: "Email already in use" });
  }

  res.status(500).json({ message: e.message || "Something went wrong" });
};
