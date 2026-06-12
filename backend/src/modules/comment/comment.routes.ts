import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { verifyToken } from "../../middlewares/auth.middleware";
import { getCommentReplies } from "./comment.controller";
import { reactToComment, getCommentReactions } from "../like/like.controller";

const router = Router();

router.get("/:id/replies", asyncHandler(verifyToken), asyncHandler(getCommentReplies));
router.post("/:id/like", asyncHandler(verifyToken), asyncHandler(reactToComment));
router.get("/:id/likes", asyncHandler(verifyToken), asyncHandler(getCommentReactions));

export default router;
