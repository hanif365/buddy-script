import { Request, Response } from "express";
import { setReaction, getReactions } from "./like.service";
import { reactionSchema } from "./like.validator";
import { ApiError } from "../../utils/api-error";

export const reactToPost = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const { reaction } = reactionSchema.parse(req.body);
  const result = await setReaction(String(req.user._id), "post", String(req.params.id), reaction);
  res.json(result);
};

export const getPostReactions = async (req: Request, res: Response) => {
  const users = await getReactions("post", String(req.params.id));
  res.json({ users });
};

export const reactToComment = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const { reaction } = reactionSchema.parse(req.body);
  const result = await setReaction(String(req.user._id), "comment", String(req.params.id), reaction);
  res.json(result);
};

export const getCommentReactions = async (req: Request, res: Response) => {
  const users = await getReactions("comment", String(req.params.id));
  res.json({ users });
};
