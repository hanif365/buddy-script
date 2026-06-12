export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
};

export type PostAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type ReactionType =
  | "like"
  | "love"
  | "care"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

export type Reactor = PostAuthor & { reaction?: ReactionType };

export type Post = {
  _id: string;
  author: PostAuthor;
  text: string;
  image?: { url?: string; publicId?: string };
  visibility: "public" | "private";
  likeCount: number;
  commentCount: number;
  myReaction?: ReactionType | null;
  reactors?: PostAuthor[];
  createdAt: string;
};

export type Comment = {
  _id: string;
  post: string;
  author: PostAuthor;
  parent: string | null;
  text: string;
  likeCount: number;
  replyCount: number;
  liked?: boolean;
  createdAt: string;
};
