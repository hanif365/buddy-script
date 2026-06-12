"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { Post, PostAuthor, ReactionType, User } from "@/types";
import { reactionMap } from "@/lib/reactions";
import { formatTime } from "@/lib/formatTime";
import WhoLikedModal from "@/components/WhoLikedModal";
import CommentSection from "@/components/CommentSection";
import ReactionPicker from "@/components/ReactionPicker";

export default function PostCard({
  post,
  currentUser,
}: {
  post: Post;
  currentUser: User | null;
}) {
  const name = `${post.author.firstName} ${post.author.lastName}`;
  const avatar = post.author.avatar || "/images/default-avatar.svg";

  const [myReaction, setMyReaction] = useState<ReactionType | null>(
    post.myReaction ?? null
  );
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [reactors, setReactors] = useState<PostAuthor[]>(post.reactors ?? []);
  const [showPicker, setShowPicker] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openPicker = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setShowPicker(true), 350);
  };
  const closePicker = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setShowPicker(false), 250);
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const reqId = useRef(0);

  const active = myReaction ? reactionMap[myReaction] : null;

  const react = async (type: ReactionType) => {
    clearTimeout(hoverTimer.current);
    setShowPicker(false);

    const id = ++reqId.current;
    const prev = { reaction: myReaction, count: likeCount, reactors };
    const turningOff = myReaction === type;
    const next = turningOff ? null : type;

    setMyReaction(next);
    setLikeCount((c) => c + (myReaction ? (turningOff ? -1 : 0) : 1));
    setReactors((list) => {
      const others = list.filter((u) => u._id !== currentUser?.id);
      if (next && currentUser) {
        return [
          {
            _id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatar: currentUser.avatar,
          },
          ...others,
        ];
      }
      return others;
    });

    try {
      const res = await apiClient(`/posts/${post._id}/like`, {
        method: "POST",
        body: JSON.stringify({ reaction: type }),
      });
      if (id !== reqId.current) return;
      setMyReaction(res.reaction);
      setLikeCount(res.likeCount);
    } catch {
      if (id !== reqId.current) return;
      setMyReaction(prev.reaction);
      setLikeCount(prev.count);
      setReactors(prev.reactors);
    }
  };

  return (
    <div className="mb-4 rounded-md bg-surface py-6">
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={avatar}
              alt=""
              width={44}
              height={44}
              className="mr-4 h-11 w-11 rounded-full object-cover"
            />
            <div>
              <h4 className="text-[16px] leading-[1.1] text-heading">{name}</h4>
              <p className="text-[14px] leading-[1.2] text-muted">
                {formatTime(post.createdAt)} .{" "}
                <span>{post.visibility === "private" ? "Private" : "Public"}</span>
              </p>
            </div>
          </div>
          <button type="button" className="cursor-pointer px-1 py-[5px]">
            <svg width="4" height="17" viewBox="0 0 4 17" fill="none" className="text-muted">
              <circle cx="2" cy="2" r="2" fill="currentColor" />
              <circle cx="2" cy="8" r="2" fill="currentColor" />
              <circle cx="2" cy="15" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>

        {post.text && (
          <h4 className="mb-4 text-[14px] leading-[21px] text-heading">
            {post.text}
          </h4>
        )}
        {post.image?.url && (
          <div className="mb-6 overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image.url} alt="" className="w-full" />
          </div>
        )}
      </div>

      <div className="mb-[26px] flex items-center justify-between px-6">
        {likeCount > 0 ? (
          <button
            type="button"
            onClick={() => setShowLikes(true)}
            className="flex cursor-pointer items-center"
          >
            {reactors.slice(0, 5).map((r, i) => (
              <Image
                key={r._id}
                src={r.avatar || "/images/default-avatar.svg"}
                alt=""
                width={32}
                height={32}
                className={`h-8 w-8 rounded-full border border-surface object-cover ${
                  i === 0 ? "" : "-ml-4"
                }`}
              />
            ))}
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-[14px] text-white ${
                reactors.length > 0 ? "-ml-4" : ""
              }`}
            >
              {likeCount > 9 ? "9+" : likeCount}
            </span>
          </button>
        ) : (
          <span />
        )}
        <div className="flex text-[14px] leading-[1.2] text-muted">
          <button
            type="button"
            onClick={() => setShowComments((s) => !s)}
            className="mr-4 cursor-pointer"
          >
            <span className="text-heading">{commentCount}</span> Comment
          </button>
          <p>
            <span className="text-heading">0</span> Share
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-reaction p-2">
        <div
          className="relative flex-1"
          onMouseEnter={openPicker}
          onMouseLeave={closePicker}
        >
          {showPicker && (
            <ReactionPicker
              onPick={react}
              onMouseEnter={openPicker}
              onMouseLeave={closePicker}
            />
          )}
          <button
            type="button"
            onClick={() => react(myReaction ?? "like")}
            className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-[14px] transition hover:bg-[#e4f1fd] dark:hover:bg-[#263a52] ${
              active ? "bg-[#e4f1fd] dark:bg-[#263a52]" : "text-heading"
            }`}
          >
            {active ? (
              <active.Emoji size={20} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            )}
            <span style={active ? { color: active.color } : undefined}>
              {active ? active.label : "Like"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowComments(true)}
          className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md text-[14px] text-heading transition hover:bg-[#e4f1fd] dark:hover:bg-[#263a52]"
        >
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
            <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
          </svg>
          Comment
        </button>
        <button
          type="button"
          className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md text-[14px] text-heading transition hover:bg-[#e4f1fd] dark:hover:bg-[#263a52]"
        >
          <svg width="22" height="20" viewBox="0 0 24 21" fill="none">
            <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
          </svg>
          Share
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          currentUser={currentUser}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      )}

      {showLikes && (
        <WhoLikedModal
          endpoint={`/posts/${post._id}/likes`}
          onClose={() => setShowLikes(false)}
        />
      )}
    </div>
  );
}
