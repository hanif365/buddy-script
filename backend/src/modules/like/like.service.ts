import { Types } from "mongoose";
import Like from "./like.model";
import Post from "../post/post.model";
import Comment from "../comment/comment.model";
import User from "../user/user.model";
import { ApiError } from "../../utils/api-error";
import { ReactionType } from "./like.validator";

type TargetType = "post" | "comment";

const targetExists = (targetType: TargetType, targetId: string) =>
  targetType === "post"
    ? Post.exists({ _id: targetId })
    : Comment.exists({ _id: targetId });

const syncCount = async (targetType: TargetType, targetId: string, inc: number) => {
  if (targetType === "post") {
    const post = inc
      ? await Post.findByIdAndUpdate(targetId, { $inc: { likeCount: inc } }, { new: true })
      : await Post.findById(targetId);
    return post?.likeCount ?? 0;
  }
  const comment = inc
    ? await Comment.findByIdAndUpdate(targetId, { $inc: { likeCount: inc } }, { new: true })
    : await Comment.findById(targetId);
  return comment?.likeCount ?? 0;
};

export const setReaction = async (
  userId: string,
  targetType: TargetType,
  targetId: string,
  reaction: ReactionType
) => {
  if (!(await targetExists(targetType, targetId))) {
    throw new ApiError(404, `${targetType === "post" ? "Post" : "Comment"} not found`);
  }

  const existing = await Like.findOne({ user: userId, targetType, target: targetId });

  let reacted = true;
  let inc = 0;
  let current: ReactionType | null = reaction;

  if (!existing) {
    try {
      await Like.create({ user: userId, targetType, target: targetId, reaction });
      inc = 1;
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  } else if (existing.reaction === reaction) {
    await existing.deleteOne();
    reacted = false;
    current = null;
    inc = -1;
  } else {
    existing.reaction = reaction;
    await existing.save();
  }

  const likeCount = await syncCount(targetType, targetId, inc);

  return { reacted, reaction: current, likeCount };
};

export const getReactions = async (targetType: TargetType, targetId: string) => {
  const likes = await Like.find({ targetType, target: targetId })
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName avatar")
    .lean();

  return likes
    .filter((like) => like.user)
    .map((like) => ({ ...(like.user as object), reaction: like.reaction }));
};

export const getReactionPreviews = async (
  targetType: TargetType,
  targetIds: Types.ObjectId[]
) => {
  const grouped = await Like.aggregate([
    { $match: { targetType, target: { $in: targetIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$target", users: { $push: "$user" } } },
  ]);

  const topUserIds = grouped.flatMap((g) => g.users.slice(0, 5));
  const users = await User.find({ _id: { $in: topUserIds } })
    .select("firstName lastName avatar")
    .lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  const previews = new Map<string, typeof users>();
  for (const g of grouped) {
    const reactors = g.users
      .slice(0, 5)
      .map((id: Types.ObjectId) => userMap.get(String(id)))
      .filter(Boolean);
    previews.set(String(g._id), reactors);
  }
  return previews;
};
