"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import { Comment, User } from "@/types";
import { formatTime } from "@/lib/formatTime";
import WhoLikedModal from "@/components/WhoLikedModal";

export default function CommentItem({
  comment,
  currentUser,
  nested = false,
}: {
  comment: Comment;
  currentUser: User | null;
  nested?: boolean;
}) {
  const name = `${comment.author.firstName} ${comment.author.lastName}`;
  const avatar = comment.author.avatar || "/images/default-avatar.svg";

  const [liked, setLiked] = useState(comment.liked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const [replies, setReplies] = useState<Comment[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.replyCount ?? 0);
  const replyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showReply) replyInputRef.current?.focus();
  }, [showReply]);

  const handleLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevCount + (prevLiked ? -1 : 1));
    try {
      const res = await apiClient(`/comments/${comment._id}/like`, { method: "POST" });
      setLiked(res.reacted);
      setLikeCount(res.likeCount);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLikeBusy(false);
    }
  };

  const loadReplies = async () => {
    const res = await apiClient(`/comments/${comment._id}/replies`);
    setReplies(res.replies);
    setRepliesLoaded(true);
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await apiClient(`/posts/${comment.post}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: replyText, parentId: comment._id }),
      });
      setReplies((prev) => (repliesLoaded ? [...prev, res.comment] : [res.comment]));
      setRepliesLoaded(true);
      setReplyCount((c) => c + 1);
      setReplyText("");
      setShowReply(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex">
        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </span>

        <div className="ml-5 flex-1">
          <div className="relative inline-block max-w-full rounded-[18px] bg-comment p-3">
            <h4 className="text-[14px] font-semibold leading-[1.3] break-words text-heading">
              {name}
            </h4>
            <p className="text-[14px] leading-[1.2] break-words text-muted">
              {comment.text}
            </p>
            {likeCount > 0 && (
              <button
                type="button"
                onClick={() => setShowLikes(true)}
                className="absolute right-1 -bottom-3 flex cursor-pointer items-center gap-1 rounded-xl bg-surface px-2 py-0.5 shadow-[rgb(149_157_165_/_20%)_0px_8px_24px]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1890FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="text-[14px] font-medium text-heading">{likeCount}</span>
              </button>
            )}
          </div>

          <ul className="mt-2 flex items-center gap-3 pl-3 text-[14px] font-medium text-heading">
            <li
              onClick={handleLike}
              className={`cursor-pointer hover:underline ${liked ? "text-primary" : ""}`}
            >
              {liked ? "Liked" : "Like"}
            </li>
            <li
              onClick={() => setShowReply((s) => !s)}
              className="cursor-pointer hover:underline"
            >
              Reply
            </li>
            <li className="font-normal text-muted">{formatTime(comment.createdAt)}</li>
          </ul>

          {showReply && (
            <form
              onSubmit={submitReply}
              className="mt-2 flex items-center gap-2 rounded-[18px] bg-comment px-3 py-1"
            >
              <Image
                src={currentUser?.avatar || "/images/default-avatar.svg"}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
              <input
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply"
                className="h-8 w-full bg-transparent text-[14px] text-body outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="cursor-pointer text-[14px] font-medium text-primary disabled:opacity-50"
              >
                Send
              </button>
            </form>
          )}

          {replyCount > 0 && !repliesLoaded && (
            <button
              type="button"
              onClick={loadReplies}
              className="mt-2 cursor-pointer text-[14px] font-semibold text-muted hover:underline"
            >
              View {replyCount} {replyCount > 1 ? "replies" : "reply"}
            </button>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className={`mt-3 ${nested ? "" : "ml-12"}`}>
          {replies.map((r) => (
            <CommentItem
              key={r._id}
              comment={r}
              currentUser={currentUser}
              nested
            />
          ))}
        </div>
      )}

      {showLikes && (
        <WhoLikedModal
          endpoint={`/comments/${comment._id}/likes`}
          onClose={() => setShowLikes(false)}
        />
      )}
    </div>
  );
}
