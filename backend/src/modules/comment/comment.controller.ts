import { Request, Response } from "express";
import {
  createComment as saveComment,
  getComments,
  getReplies,
} from "./comment.service";
import { createCommentSchema } from "./comment.validator";
import { ApiError } from "../../utils/api-error";

export const createComment = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const data = createCommentSchema.parse(req.body);
  const comment = await saveComment(
    String(req.user._id),
    String(req.params.id),
    data
  );
  res.status(201).json({ comment });
};

export const getPostComments = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const result = await getComments(
    String(req.params.id),
    String(req.user._id),
    cursor,
    limit
  );
  res.json(result);
};

export const getCommentReplies = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const result = await getReplies(String(req.params.id), String(req.user._id));
  res.json(result);
};
