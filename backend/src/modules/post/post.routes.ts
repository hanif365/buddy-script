import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { verifyToken } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { getPosts, createPost } from "./post.controller";
import { reactToPost, getPostReactions } from "../like/like.controller";
import { createComment, getPostComments } from "../comment/comment.controller";

const router = Router();

router.get("/", asyncHandler(verifyToken), asyncHandler(getPosts));
router.post(
  "/",
  asyncHandler(verifyToken),
  upload.single("image"),
  asyncHandler(createPost)
);

router.post("/:id/like", asyncHandler(verifyToken), asyncHandler(reactToPost));
router.get("/:id/likes", asyncHandler(verifyToken), asyncHandler(getPostReactions));

router.get("/:id/comments", asyncHandler(verifyToken), asyncHandler(getPostComments));
router.post("/:id/comments", asyncHandler(verifyToken), asyncHandler(createComment));

export default router;
