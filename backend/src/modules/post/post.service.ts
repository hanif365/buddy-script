import Post from "./post.model";
import Like from "../like/like.model";
import { getReactionPreviews } from "../like/like.service";
import { uploadImage } from "../../config/cloudinary";
import { ApiError } from "../../utils/api-error";
import { CreatePostInput } from "./post.types";

export const createPost = async (
  userId: string,
  input: CreatePostInput,
  file?: Express.Multer.File
) => {
  const text = input.text?.trim() ?? "";
  if (!text && !file) {
    throw new ApiError(400, "Post must have text or an image");
  }

  const image = file ? await uploadImage(file.buffer) : undefined;

  const post = await Post.create({
    author: userId,
    text,
    image,
    visibility: input.visibility ?? "public",
  });

  return post.populate("author", "firstName lastName avatar");
};

export const getFeed = async (
  userId: string,
  cursor: string | undefined,
  limit: number
) => {
  const filter = {
    $or: [
      { visibility: "public" as const },
      { visibility: "private" as const, author: userId },
    ],
    ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
  };

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "firstName lastName avatar")
    .lean();

  const postIds = posts.map((p) => p._id);

  const myReactions = await Like.find({
    user: userId,
    targetType: "post",
    target: { $in: postIds },
  })
    .select("target reaction")
    .lean();
  const myReactionMap = new Map(myReactions.map((r) => [String(r.target), r.reaction]));

  const previews = await getReactionPreviews("post", postIds);

  const withReactions = posts.map((post) => ({
    ...post,
    myReaction: myReactionMap.get(String(post._id)) ?? null,
    reactors: previews.get(String(post._id)) ?? [],
  }));

  const nextCursor =
    posts.length === limit ? posts[posts.length - 1].createdAt : null;

  return { posts: withReactions, nextCursor };
};
