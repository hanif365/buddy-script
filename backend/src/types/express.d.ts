import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: unknown;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
      };
    }
  }
}
