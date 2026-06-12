import { Request, Response } from "express";
import { getFeed, createPost as savePost } from "./post.service";
import { createPostSchema } from "./post.validator";
import { ApiError } from "../../utils/api-error";

export const getPosts = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const result = await getFeed(String(req.user._id), cursor, limit);
  res.json(result);
};

export const createPost = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const data = createPostSchema.parse(req.body);
  const post = await savePost(String(req.user._id), data, req.file);
  res.status(201).json({ post });
};
