import { Types } from "mongoose";
import Comment from "./comment.model";
import Post from "../post/post.model";
import Like from "../like/like.model";
import { ApiError } from "../../utils/api-error";
import { CreateCommentInput } from "./comment.types";

export const createComment = async (
  userId: string,
  postId: string,
  input: CreateCommentInput
) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    parent: input.parentId ?? null,
    text: input.text,
  });

  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  if (input.parentId) {
    await Comment.findByIdAndUpdate(input.parentId, { $inc: { replyCount: 1 } });
  }

  return comment.populate("author", "firstName lastName avatar");
};

const withLiked = async <T extends { _id: Types.ObjectId }>(
  userId: string,
  docs: T[]
) => {
  const myLikes = await Like.find({
    user: userId,
    targetType: "comment",
    target: { $in: docs.map((d) => d._id) },
  })
    .select("target")
    .lean();
  const likedSet = new Set(myLikes.map((like) => String(like.target)));
  return docs.map((d) => ({ ...d, liked: likedSet.has(String(d._id)) }));
};

export const getComments = async (
  postId: string,
  userId: string,
  cursor: string | undefined,
  limit: number
) => {
  const filter = {
    post: postId,
    parent: null,
    ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
  };

  const comments = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "firstName lastName avatar")
    .lean();

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].createdAt : null;

  return { comments: await withLiked(userId, comments), nextCursor };
};

export const getReplies = async (commentId: string, userId: string) => {
  const replies = await Comment.find({ parent: commentId })
    .sort({ createdAt: 1 })
    .populate("author", "firstName lastName avatar")
    .lean();

  return { replies: await withLiked(userId, replies) };
};
